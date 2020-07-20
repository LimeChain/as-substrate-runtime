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

// TODO Storage IT Tests

#[test]
fn test_ext_storage_get(){
}