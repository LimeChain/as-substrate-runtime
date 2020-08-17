//! Service and ServiceFactory implementation. Specialized wrapper over substrate service.

use std::sync::Arc;
use std::time::Duration;
use sc_client_api::{ExecutorProvider, RemoteBackend};
use node_template_runtime::{self, opaque::Block, RuntimeApi};
use sc_service::{error::Error as ServiceError, Configuration, ServiceComponents, TaskManager};
use sp_inherents::InherentDataProviders;
use sc_executor::native_executor_instance;
pub use sc_executor::NativeExecutor;
use parking_lot::Mutex;
use sp_consensus_aura::sr25519::{AuthorityPair as AuraPair};
use sc_finality_grandpa::{
	FinalityProofProvider as GrandpaFinalityProofProvider, StorageAndProofProvider, SharedVoterState,
};

// Our native executor instance.
native_executor_instance!(
	pub Executor,
	node_template_runtime::api::dispatch,
	node_template_runtime::native_version,
);

type FullClient = sc_service::TFullClient<Block, RuntimeApi, Executor>;
type FullBackend = sc_service::TFullBackend<Block>;
type FullSelectChain = sc_consensus::LongestChain<FullBackend, Block>;

pub fn new_full_params(config: Configuration) -> Result<(
	sc_service::ServiceParams<
		Block, FullClient,
		sc_consensus_aura::AuraImportQueue<Block, FullClient>,
		sc_transaction_pool::FullPool<Block, FullClient>,
		(), FullBackend,
	>,
	FullSelectChain,
	sp_inherents::InherentDataProviders
), ServiceError> {
	let inherent_data_providers = sp_inherents::InherentDataProviders::new();

	let (client, backend, keystore, task_manager) =
		sc_service::new_full_parts::<Block, RuntimeApi, Executor>(&config)?;
	let client = Arc::new(client);

	let select_chain = sc_consensus::LongestChain::new(backend.clone());

	let pool_api = sc_transaction_pool::FullChainApi::new(
		client.clone(), config.prometheus_registry(),
	);
	let transaction_pool = sc_transaction_pool::BasicPool::new_full(
		config.transaction_pool.clone(),
		std::sync::Arc::new(pool_api),
		config.prometheus_registry(),
		task_manager.spawn_handle(),
		client.clone(),
	);

	let import_queue = sc_consensus_aura::import_queue::<_, _, _, AuraPair, _>(
		sc_consensus_aura::slot_duration(&*client)?,
		client.clone(),
		None,
		None,
		client.clone(),
		inherent_data_providers.clone(),
		&task_manager.spawn_handle(),
		config.prometheus_registry(),
	)?;

	let provider = client.clone() as Arc<dyn StorageAndProofProvider<_, _>>;
	
	let params = sc_service::ServiceParams {
		backend, client, import_queue, keystore, task_manager, transaction_pool,
		config,
		block_announce_validator_builder: None,
		finality_proof_request_builder: None,
		finality_proof_provider: None,
		on_demand: None,
		remote_blockchain: None,
		rpc_extensions_builder: Box::new(|_| ()),
	};

	Ok((
		params, select_chain, inherent_data_providers,
	))
}

/// Builds a new service for a full client.
pub fn new_full(config: Configuration) -> Result<TaskManager, ServiceError> {	
	let (
		params, select_chain, inherent_data_providers,
	) = new_full_params(config)?;

	let (
		role, force_authoring, name, enable_grandpa, prometheus_registry,
		client, transaction_pool, keystore,
	) = {
		let sc_service::ServiceParams {
			config, client, transaction_pool, keystore, ..
		} = &params;

		(
			config.role.clone(),
			config.force_authoring,
			config.network.node_name.clone(),
			!config.disable_grandpa,
			config.prometheus_registry().cloned(),

			client.clone(), transaction_pool.clone(), keystore.clone(),
		)
	};

	let ServiceComponents {
		task_manager, network, telemetry_on_connect_sinks, ..
	 } = sc_service::build(params)?;

	if role.is_authority() {
		let proposer = sc_basic_authorship::ProposerFactory::new(
			client.clone(),
			transaction_pool,
			prometheus_registry.as_ref(),
		);

		let can_author_with =
			sp_consensus::CanAuthorWithNativeVersion::new(client.executor().clone());

		let aura = sc_consensus_aura::start_aura::<_, _, _, _, _, AuraPair, _, _, _>(
			sc_consensus_aura::slot_duration(&*client)?,
			client.clone(),
			select_chain,
			client.clone(),
			proposer,
			network.clone(),
			inherent_data_providers.clone(),
			force_authoring,
			keystore.clone(),
			can_author_with,
		)?;

		// the AURA authoring task is considered essential, i.e. if it
		// fails we take down the service with it.
		task_manager.spawn_essential_handle().spawn_blocking("aura", aura);
	}

	// if the node isn't actively participating in consensus then it doesn't
	// need a keystore, regardless of which protocol we use below.
	let keystore = if role.is_authority() {
		Some(keystore as sp_core::traits::BareCryptoStorePtr)
	} else {
		None
	};


	sc_finality_grandpa::setup_disabled_grandpa(
		client,
		&inherent_data_providers,
		network,
	)?;

	Ok(task_manager)
}

/// Builds a new service for a light client.
pub fn new_light(config: Configuration) -> Result<TaskManager, ServiceError> {
	let (client, backend, keystore, task_manager, on_demand) =
		sc_service::new_light_parts::<Block, RuntimeApi, Executor>(&config)?;
	
	let transaction_pool_api = Arc::new(sc_transaction_pool::LightChainApi::new(
		client.clone(), on_demand.clone(),
	));
	let transaction_pool = sc_transaction_pool::BasicPool::new_light(
		config.transaction_pool.clone(),
		transaction_pool_api,
		config.prometheus_registry(),
		task_manager.spawn_handle(),
	);

	let grandpa_block_import = sc_finality_grandpa::light_block_import(
		client.clone(), backend.clone(), &(client.clone() as Arc<_>),
		Arc::new(on_demand.checker().clone()) as Arc<_>,
	)?;
	let finality_proof_import = grandpa_block_import.clone();
	let finality_proof_request_builder =
		finality_proof_import.create_finality_proof_request_builder();

	let import_queue = sc_consensus_aura::import_queue::<_, _, _, AuraPair, _>(
		sc_consensus_aura::slot_duration(&*client)?,
		grandpa_block_import,
		None,
		Some(Box::new(finality_proof_import)),
		client.clone(),
		InherentDataProviders::new(),
		&task_manager.spawn_handle(),
		config.prometheus_registry(),
	)?;

	let finality_proof_provider =
		Arc::new(GrandpaFinalityProofProvider::new(backend.clone(), client.clone() as Arc<_>));

	sc_service::build(sc_service::ServiceParams {	
		block_announce_validator_builder: None,
		finality_proof_request_builder: Some(finality_proof_request_builder),
		finality_proof_provider: Some(finality_proof_provider),
		on_demand: Some(on_demand),
		remote_blockchain: Some(backend.remote_blockchain()),
		rpc_extensions_builder: Box::new(|_| ()),
		transaction_pool: Arc::new(transaction_pool),
		config, client, import_queue, keystore, backend, task_manager
	 }).map(|ServiceComponents { task_manager, .. }| task_manager)
}
