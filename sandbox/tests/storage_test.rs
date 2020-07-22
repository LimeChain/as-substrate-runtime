extern crate sandbox_execution_environment;
use sc_executor::{WasmExecutor, WasmExecutionMethod};
use sandbox_execution_environment::{Setup};
use sp_core::{traits::{ CallInWasm, Externalities, MissingHostFunctions}};
use sp_runtime::{ traits::{BlakeTwo256 }};
use sp_state_machine::TestExternalities as CoreTestExternalities;
use parity_scale_codec::{Encode, Decode};
use sp_wasm_interface::HostFunctions as _;
pub use sp_inherents::{InherentData, InherentIdentifier, CheckInherentsResult, IsFatalError};

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
fn test_ext_storage_get(){
    let setup = Setup::new();
    let mut ext = setup.ext;
    let mut ext = ext.ext();
    let key = b"python".to_vec().encode();
    let value = b"greatest".to_vec();
    ext.set_storage(key.clone(), value.clone()); 
    let result = call_in_wasm(
        "test_storage_get", 
        &key,
        WasmExecutionMethod::Interpreted,
        &mut ext
    ).unwrap();
    println!("{:?}", result);
    assert_eq!(&value, &result);
}

#[test]
fn test_ext_storage_set(){
    let setup = Setup::new();
    let mut ext = setup.ext;
    let mut ext = ext.ext();
    let key = b"rust".to_vec();
    let value = b"goodest".to_vec();
    let pair = [key.clone(), value.clone()];
    let result = call_in_wasm(
        "test_storage_set", 
        &pair.encode(),
        WasmExecutionMethod::Interpreted,
        &mut ext
    ).unwrap();
    let exp_value = ext.storage(&key.encode());
    println!("{:?}", exp_value);
    println!("{:?}", result);
    assert_eq!(result, [0u8; 0]);
    assert_eq!(exp_value, Some(value.encode()));
}

#[test]
fn test_ext_storage_read(){
    let setup = Setup::new();
    let mut ext = setup.ext;
    let mut ext = ext.ext();

    let key = b"great".to_vec();
    let value: [u8; 25] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2];
    let offset: u32 = 10;
    ext.set_storage(key.encode(), value.to_vec());

    let mut arg = vec![];
    arg.extend(key.encode());
    arg.extend(offset.encode());
    let result = call_in_wasm(
        "test_storage_read", 
        &arg,
        WasmExecutionMethod::Interpreted,
        &mut ext
    ).unwrap();
    let res: u32 = <u32>::decode(&mut result.as_ref()).unwrap();
    println!("{:?}", arg);
    println!("{:?}", result);
    assert!(res >= offset);
    assert_eq!(&result[4..result.len()], &[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0]);
}
#[test]
#[should_panic]
fn test_ext_storage_clear(){
    let setup = Setup::new();
    let mut ext = setup.ext;
    let mut ext = ext.ext();

    let key = b"clearthis".to_vec();
    let value = b"nonsense".to_vec();

    ext.set_storage(key.encode(), value);

    let result = call_in_wasm(
        "test_storage_clear", 
        &key.encode(),
        WasmExecutionMethod::Interpreted,
        &mut ext
    ).unwrap();

    let check = call_in_wasm(
        "test_storage_get", 
        &key.encode(),
        WasmExecutionMethod::Interpreted,
        &mut ext
    ).unwrap();
    assert_eq!(result, [0u8; 0]);
    assert_eq!(check, [0u8; 0]);
    let _res = ext.storage(&key).unwrap();
}

#[test]
fn test_storage_exists(){
    let setup = Setup::new();
    let mut ext = setup.ext;
    let mut ext = ext.ext();

    let key = b"itexists".to_vec();
    let value = b"check if".to_vec();

    let invalid_key = b"notexists".to_vec();
    ext.set_storage(key.encode(), value);

    let result1 = call_in_wasm(
        "test_storage_exists", 
        &key.encode(),
        WasmExecutionMethod::Interpreted,
        &mut ext
    ).unwrap();

    let result2 = call_in_wasm(
        "test_storage_exists", 
        &invalid_key.encode(),
        WasmExecutionMethod::Interpreted,
        &mut ext
    ).unwrap();
    
    let check1 = <u32>::decode(&mut result1.as_ref()).unwrap();
    let check2 = <u32>::decode(&mut result2.as_ref()).unwrap();
    assert_eq!(check1, ext.exists_storage(&key.encode()) as u32);
    assert_eq!(check2, ext.exists_storage(&invalid_key.encode()) as u32);
}