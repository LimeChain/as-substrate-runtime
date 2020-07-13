extern crate sandbox_execution_environment;
use sandbox_execution_environment::{ Setup };
use sp_core::{ traits::{ CallInWasm, MissingHostFunctions }};

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
    let mut setup = Setup::new();
    let result = setup.executor.call_in_wasm(
        &setup.wasm_code_array,
        None,
        "TaggedTransactionQueue_validate_transaction",
        &[],
        &mut setup.ext.ext(),
        MissingHostFunctions::Allow).unwrap();
    println!("{:?}", result);
    assert_eq!(result, [0u8; 0]);
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