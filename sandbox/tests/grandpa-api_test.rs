extern crate sandbox_execution_environment;
use sandbox_execution_environment::{ Setup };
use sp_core::{ traits::{ CallInWasm, MissingHostFunctions }};

#[test]
fn test_grandpa_api_grandpa_pending_change() {
    let mut setup = Setup::new();
    let result = setup.executor.call_in_wasm(
        &setup.wasm_code_array,
        None,
        "GrandpaApi_grandpa_pending_change",
        &[],
        &mut setup.ext.ext(),
        MissingHostFunctions::Allow).unwrap();
    println!("{:?}", result);
    assert_eq!(result, [0u8; 0]);
}

#[test]
fn test_grandpa_api_grandpa_forced_change() {
    let mut setup = Setup::new();
    let result = setup.executor.call_in_wasm(
        &setup.wasm_code_array,
        None,
        "GrandpaApi_grandpa_forced_change",
        &[],
        &mut setup.ext.ext(),
        MissingHostFunctions::Allow).unwrap();
    println!("{:?}", result);
    assert_eq!(result, [0u8; 0]);
}


#[test]
fn test_grandpa_api_grandpa_authorities() {
    let mut setup = Setup::new();
    let result = setup.executor.call_in_wasm(
        &setup.wasm_code_array,
        None,
        "GrandpaApi_grandpa_authorities",
        &[],
        &mut setup.ext.ext(),
        MissingHostFunctions::Allow).unwrap();
    println!("{:?}", result);
    assert_eq!(result, [0u8; 0]);
}