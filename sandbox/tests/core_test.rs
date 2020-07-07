extern crate sandbox_execution_environment;
use sandbox_execution_environment::get_wasm_code_arr;
use sandbox_execution_environment::get_wasm_executor;
use sp_version::{ApiId, RuntimeVersion};
use sp_core::{ traits::{ CallInWasm, MissingHostFunctions }};
use parity_scale_codec::{Decode};
use sp_runtime::{RuntimeString};
use std::borrow::Cow;

struct Setup {
    executor: sc_executor::WasmExecutor,
    wasm_code_array: Vec<u8>,
    ext: sp_io::TestExternalities
}

impl Setup{
    fn new() -> Self {
        Self {
            executor: get_wasm_executor(),
            wasm_code_array: get_wasm_code_arr(),
            ext: sp_io::TestExternalities::default()
        }
    }
}

#[test]
// necessary variables to execute wasm code
fn test_core_version() {
    // default value for the vector
    let mut setup = Setup::new();
    let a: Vec<(ApiId, u32)> = vec![([1,1,1,1,1,1,1,1], 10)];

    let version = RuntimeVersion {
        spec_name: RuntimeString::Borrowed("Node-test"),
        impl_name: RuntimeString::Borrowed("AssemblyScript"),
        authoring_version: 1,
        spec_version: 1,
        impl_version: 1,
        apis: Cow::<[([u8; 8], u32)]>::Owned(a),
        transaction_version: 1
    };

    let res = setup.executor.call_in_wasm(
        &setup.wasm_code_array,
        None,
        "Core_version",
        &[],
        &mut setup.ext.ext(),
        MissingHostFunctions::Allow).unwrap();
    let wasm_version = <RuntimeVersion>::decode(&mut res.as_ref());
    // the 
    assert_eq!(wasm_version.is_ok(), true);
    assert_eq!(wasm_version.iter().next(), Some(&version));    
}
