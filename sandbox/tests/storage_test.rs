extern crate sandbox_execution_environment;
use sc_executor::{WasmExecutor, WasmExecutionMethod};
use sandbox_execution_environment::{Setup};
use sp_core::{ traits::{ CallInWasm, Externalities, MissingHostFunctions}};
use sp_runtime::{ traits::{BlakeTwo256 }};
use sp_state_machine::TestExternalities as CoreTestExternalities;
use parity_scale_codec::{Encode};
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
