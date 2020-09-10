extern crate sandbox_execution_environment;
use sandbox_execution_environment::{ Transfer, Setup };
use sp_state_machine::TestExternalities as CoreTestExternalities;
use sp_keyring::AccountKeyring;
use parity_scale_codec::{Encode};
use sp_wasm_interface::HostFunctions as _;
use sp_runtime::{ traits::{BlakeTwo256 }};
use sc_executor::{WasmExecutor, WasmExecutionMethod};
use sp_core::{ traits::{ CallInWasm, Externalities, MissingHostFunctions }};
type HostFunctions = sp_io::SubstrateHostFunctions;
pub type TestExternalities = CoreTestExternalities<BlakeTwo256, u64>;



fn call_in_wasm<E: Externalities> (
    function: &str,
    call_data: &[u8],
    execution_method: WasmExecutionMethod,
    ext: &mut E
) -> Result<Vec<u8>, String> {
    let setup = Setup::new();
    let executor = crate::WasmExecutor::new(
		execution_method,
		Some(1024),
		HostFunctions::host_functions(),
		8,
	);
    executor.call_in_wasm(
        &setup.wasm_code_array,
        None,
        function,
        call_data,
        ext,
        MissingHostFunctions::Allow,
    )
}


#[test]
fn test_babeapi_configuration() {
    let mut setup = Setup::new();
    let result = setup.executor.call_in_wasm(
        &setup.wasm_code_array,
        None,
        "BabeApi_configuration",
        &[],
        &mut setup.ext.ext(),
        MissingHostFunctions::Allow).unwrap();
    println!("{:?}", result);
    assert_eq!(result, [0u8; 0]);
}

#[test]
fn test_session_keys_generate_session_keys() {
    let mut setup = Setup::new();
    let result = setup.executor.call_in_wasm(
        &setup.wasm_code_array,
        None,
        "SessionKeys_generate_session_keys",
        &[],
        &mut setup.ext.ext(),
        MissingHostFunctions::Allow).unwrap();
    println!("{:?}", result);
    assert_eq!(result, [0u8; 0]);
}


#[test]
fn test_tagged_transaction_queue_validate_transaction() {
    let setup = Setup::new();
    let mut ext = setup.ext;
    let mut ext = ext.ext();
    let ex = Transfer {
        from: AccountKeyring::Alice.into(),
        to: AccountKeyring::Bob.into(),
        amount: 69,
        nonce: 5,
    }.into_signed_tx();

    let result = call_in_wasm(
        "TaggedTransactionQueue_validate_transaction",
        &ex.encode(),
        WasmExecutionMethod::Interpreted,
        &mut ext
    );

    println!("{:?}", ex.encode());    
    println!("{:?}", result);
    // assert_eq!(result, [0u8; 0]);
}

#[test]
fn test_off_chain_worker_api_offchain_worker() {
    let mut setup = Setup::new();
    let result = setup.executor.call_in_wasm(
        &setup.wasm_code_array,
        None,
        "OffchainWorkerApi_offchain_worker",
        &[],
        &mut setup.ext.ext(),
        MissingHostFunctions::Allow).unwrap();
    println!("{:?}", result);
    assert_eq!(result, [0u8; 0]);
}

#[test]
fn test_metadata_metadata() {
    let mut setup = Setup::new();
    let result = setup.executor.call_in_wasm(
        &setup.wasm_code_array,
        None,
        "Metadata_metadata",
        &[],
        &mut setup.ext.ext(),
        MissingHostFunctions::Allow).unwrap();
    println!("{:?}", result);
    assert_eq!(result, [0u8; 0]);
}