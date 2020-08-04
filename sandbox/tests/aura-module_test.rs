extern crate sandbox_execution_environment;
use sc_executor::{WasmExecutor, WasmExecutionMethod};
use sandbox_execution_environment::{Setup};
use sp_core::{ traits::{ CallInWasm, Externalities, MissingHostFunctions}};
use sp_runtime::{ traits::{BlakeTwo256 }};
use sp_state_machine::TestExternalities as CoreTestExternalities;
use parity_scale_codec::{Encode};
use sp_keyring::AccountKeyring;
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
fn aura_get_slot_duration_works() {
    let setup = Setup::new();
    let mut ext = setup.ext;
    let mut ext = ext.ext();

    let expected_value: u64 = 5;
    let result = call_in_wasm(
        "AuraApi_slot_duration", 
        &[],
        WasmExecutionMethod::Interpreted,
        &mut ext
    ).unwrap();
    assert_eq!(result, expected_value.to_le_bytes());
}

#[test]
fn timestamp_get_authorities() {
    let setup = Setup::new();
    let mut ext = setup.ext;
    let mut ext = ext.ext();

    let mut auth_id = vec![];

    auth_id.extend(b"aura".to_vec().encode());
    auth_id.extend(b"authorities".to_vec().encode());
    
    let mut value = vec![];
    value.extend(AccountKeyring::Alice.to_account_id().encode());
    value.extend(AccountKeyring::Bob.to_account_id().encode());

    ext.set_storage(auth_id.clone(), value.encode());

    let result = call_in_wasm(
        "AuraApi_authorities", 
        &[],
        WasmExecutionMethod::Interpreted,
        &mut ext
    ).unwrap();
    assert_eq!(ext.storage(&auth_id).unwrap(), result);
}

// #[test]
// fn double_timestamp_should_fail() {
//     let setup = Setup::new();
//     let mut ext = setup.ext;
//     let mut ext = ext.ext();

//     let mut now = vec![];
//     let mut did_update = vec![];

//     now.extend(b"timestamp".to_vec().encode());
//     did_update.extend(b"timestamp".to_vec().encode());
//     now.extend(b"now".to_vec().encode());
//     did_update.extend(b"didupdate".to_vec().encode());
    
//     let init_value: u64 = 42;
//     ext.set_storage(now.clone(), init_value.encode());

//     let value: u64 = 69;
//     let result = call_in_wasm(
//         "test_timestamp_set", 
//         &value.encode(),
//         WasmExecutionMethod::Interpreted,
//         &mut ext
//     );
//     let value1: u64 = 80;
//     let result1 = call_in_wasm(
//         "test_timestamp_set", 
//         &value1.encode(),
//         WasmExecutionMethod::Interpreted,
//         &mut ext
//     );
//     assert_eq!(result.is_ok(), true);
//     assert_eq!(ext.storage(&now).unwrap(), value.to_le_bytes());
//     assert_eq!(result1.is_err(), true);
// }

// #[test]
// fn block_period_minimum_enforced() {
//     let setup = Setup::new();
//     let mut ext = setup.ext;
//     let mut ext = ext.ext();

//     let mut now = vec![];
//     let mut did_update = vec![];

//     now.extend(b"timestamp".to_vec().encode());
//     did_update.extend(b"timestamp".to_vec().encode());
//     now.extend(b"now".to_vec().encode());
//     did_update.extend(b"didupdate".to_vec().encode());

//     let init_value: u64 = 42;
//     ext.set_storage(now.clone(), init_value.encode());

//     let value: u64 = 46;
//     let result = call_in_wasm(
//         "test_timestamp_set", 
//         &value.encode(),
//         WasmExecutionMethod::Interpreted,
//         &mut ext
//     );
//     assert_eq!(result.is_err(), true);
//     assert_eq!(ext.storage(&now).unwrap(), init_value.to_le_bytes());
//     assert_eq!(ext.storage(&did_update), std::option::Option::None);
// }
