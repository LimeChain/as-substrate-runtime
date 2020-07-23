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
    ext.set_storage(key.encode(), value.to_vec());

    let mut args1 = vec![];
    let mut args2 = vec![];
    let mut args3 = vec![];

    args1.extend(key.encode());
    args2.extend(key.encode());
    args3.extend(key.encode());

    args1.extend((25 as u32).encode());
    args2.extend((25 as u32).encode());
    args3.extend((15 as u32).encode());

    args1.extend((0 as u32).encode());
    args2.extend((10 as u32).encode());
    args3.extend((0 as u32).encode());

    let result1 = call_in_wasm(
        "test_storage_read", 
        &args1,
        WasmExecutionMethod::Interpreted,
        &mut ext
    ).unwrap();

    let result2 = call_in_wasm(
        "test_storage_read", 
        &args2,
        WasmExecutionMethod::Interpreted,
        &mut ext
    ).unwrap();

    let result3 = call_in_wasm(
        "test_storage_read", 
        &args3,
        WasmExecutionMethod::Interpreted,
        &mut ext
    ).unwrap();

    let res1 = <u32>::decode(&mut result1.as_ref()).unwrap();
    let res2 = <u32>::decode(&mut result2.as_ref()).unwrap();
    let res3 = <u32>::decode(&mut result3.as_ref()).unwrap();

    assert!(res1 >= 25);
    assert!(res2 >= 5);
    assert!(res3 >= 10);

    assert_eq!(&result1[4..result1.len()], &value);
    assert_eq!(&result2[4..result2.len()], &[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    assert_eq!(&result3[4..result3.len()], &value[0..15]);
}
#[test]
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

    let res = ext.storage(&key);
    assert_eq!(result, [0u8; 0]);
    assert_eq!(res.iter().next(), std::option::Option::None);
}

#[test]
fn test_ext_storage_exists(){
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
    
    let check1 = <u8>::decode(&mut result1.as_ref()).unwrap();
    let check2 = <u8>::decode(&mut result2.as_ref()).unwrap();
    assert_eq!(check1 as u32, ext.exists_storage(&key.encode()) as u32);
    assert_eq!(check2 as u32, ext.exists_storage(&invalid_key.encode()) as u32);
}