extern crate sandbox_execution_environment;
use sandbox_execution_environment::{ Transfer, Setup, AccountId };
use sp_state_machine::TestExternalities as CoreTestExternalities;
use sp_keyring::AccountKeyring;
use parity_scale_codec::{Encode, Compact};
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

    let init_balance: u64 = 1234567;
    const EXTRINSIC_LEN: u16 = 145;
    

    let from: AccountId = AccountKeyring::Alice.into();
    let to: AccountId = AccountKeyring::Bob.into();

    ext.set_storage(from.encode(), init_balance.encode());
    ext.set_storage(to.encode(), init_balance.encode());


    let ex = Transfer {
        from: from,
        to: to,
        amount: 69,
        nonce: 5,
    }.into_signed_tx();

    let len: Compact<u16> = Compact(EXTRINSIC_LEN);

    let mut bytes = len.encode();

    bytes.extend(&ex.encode()[1..]);
    println!("bytes: {:?}", bytes);
    let result = call_in_wasm(
        "TaggedTransactionQueue_validate_transaction",
        &bytes,
        WasmExecutionMethod::Interpreted,
        &mut ext
    ).unwrap();

    let valid_transaction: Vec<u8> = vec![0, 145, 0, 0, 0, 0, 0, 0, 0, 0, 4, 144, 212, 53, 147, 199, 21, 253, 211, 28, 97, 20, 26, 189, 4, 169, 159, 214, 130, 44, 133, 88, 133, 76, 205, 227, 154, 86, 132, 231, 165, 109, 162, 125, 5, 0, 0, 0, 64, 0, 0, 0, 0, 0, 0, 0, 1];
    assert_eq!(result, valid_transaction);
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