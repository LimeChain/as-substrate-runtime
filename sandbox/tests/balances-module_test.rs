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
fn test_get_account_data(){
    let setup = Setup::new();
    let mut ext = setup.ext;
    let mut ext = ext.ext();

    let key = AccountKeyring::Alice.to_account_id();
    ext.set_storage(key.encode(), vec![
        0x13, 0x8e, 0x17, 0x2c, 0x21, 0x6a, 0xe7, 0xe7, 0x2a,
        0x13, 0x8e, 0x17, 0x2c, 0x21, 0x6a, 0xe7, 0xe7, 0x2a
    ].encode());

    let result = call_in_wasm(
        "test_balances_get_account_data", 
        &key.encode(),
        WasmExecutionMethod::Interpreted,
        &mut ext
    ).unwrap();

    // let exp_value = ext.storage(&b"rust".to_vec());
    // println!("{:?}", exp_value);
    println!("{:?}", result);
    // assert_eq!(exp_value, Some(result));
}

// Test Getting Account Balances

// Test Setting Account Balances