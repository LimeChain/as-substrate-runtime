extern crate sandbox_execution_environment;
extern crate hex;

use sandbox_execution_environment::get_wasm_code_arr;
use sandbox_execution_environment::get_wasm_executor;
use sandbox_execution_environment::{ Block, Header };

use sp_version::{ApiId, RuntimeVersion};
use sp_core::{ traits::{ CallInWasm, MissingHostFunctions }};
use parity_scale_codec::{Encode, Decode};

use sp_runtime::{ RuntimeString };

use std::borrow::Cow;
use hex_literal::hex;

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
fn test_core_version() {
    let mut setup = Setup::new();
    let test_api: Vec<(ApiId, u32)> = vec![([1,1,1,1,1,1,1,1], 10)];

    let version = RuntimeVersion {
        spec_name: RuntimeString::Borrowed("Node-test"),
        impl_name: RuntimeString::Borrowed("AssemblyScript"),
        authoring_version: 1,
        spec_version: 1,
        impl_version: 1,
        apis: Cow::<[([u8; 8], u32)]>::Owned(test_api),
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
    println!("{:?}", Some(&version));
    assert_eq!(wasm_version.is_ok(), true);
    assert_eq!(wasm_version.iter().next(), Some(&version));
}

#[test]
fn test_core_execute_block_mock() {
    let mut setup = Setup::new();

    let b = Block {
        header: Header {
            parent_hash: [69u8; 32].into(),
            number: 1,
            state_root: hex!("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff").into(),
            extrinsics_root: hex!("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff").into(),
            digest: Default::default(),
        },
        extrinsics: vec![],
    };

    let result = setup.executor.call_in_wasm(
        &setup.wasm_code_array,
        None,
        "Core_execute_block",
        &b.encode(),
        &mut setup.ext.ext(),
        MissingHostFunctions::Allow).unwrap();
    println!("{:?}", result);
    assert_eq!(result, [0x1]);
}

#[test]
fn test_core_initialize_block() {
    let mut setup = Setup::new();
    let h = Header {
        parent_hash: [69u8; 32].into(),
        number: 1,
        state_root: Default::default(),
        extrinsics_root: Default::default(),
        digest: Default::default(),
    };

    let result = setup.executor.call_in_wasm(
        &setup.wasm_code_array,
        None,
        "Core_initialize_block",
        &h.encode(),
        &mut setup.ext.ext(),
        MissingHostFunctions::Allow).unwrap();
    println!("{:?}", result);
    assert_eq!(result, [0x00]);
}