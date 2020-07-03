extern crate wasmi;
extern crate wabt;
extern crate hex;
extern crate sp_wasm_interface;
extern crate sp_io;

use std::fs;
use hex::FromHex;
use std::borrow::Cow;
// use wasmi::{ModuleInstance, ImportsBuilder, NopExternals, RuntimeValue::{I32}};
use sc_executor::{WasmExecutor, WasmExecutionMethod};
use sp_wasm_interface::HostFunctions;
use sp_core::{ traits::{ CallInWasm, MissingHostFunctions } };
use parity_scale_codec::{Encode, Decode};
use sp_runtime::{RuntimeString};
use sp_version::{RuntimeVersion, ApiId};

fn main() {
    let wasm_code_array = get_wasm_code_arr();
    let executor = get_wasm_executor();

    let mut ext = sp_io::TestExternalities::default();
    let mut ext = ext.ext();

    let runtime_version = get_runtime_version();
    let encoded = <RuntimeVersion>::encode(&runtime_version);
    let res = executor.call_in_wasm(
        &wasm_code_array,
        None,
        "Core_version",
        &encoded,
        &mut ext,
        MissingHostFunctions::Allow).unwrap();
    // println!("{:?}", res);
    println!("{:?}", <RuntimeVersion>::decode(&mut res.as_ref()));

}

fn get_wasm_code_arr () -> Vec<u8> {
    let wasm_code:String = fs::read_to_string("wasm-code")
        .expect("file cannot be found")
        .parse()
        .expect("unable to parse file content to string");
    return Vec::from_hex(wasm_code).expect("Decoding failed");
}

fn get_wasm_executor () -> WasmExecutor {
    return WasmExecutor::new(
        WasmExecutionMethod::Interpreted,
        Some(1024),
        sp_io::SubstrateHostFunctions::host_functions(),
        1,
    );
}

fn get_runtime_version () -> RuntimeVersion {
    let a: Vec<(ApiId, u32)> = vec![([1,1,1,1,1,1,1,1], 10)];

    return RuntimeVersion {
        spec_name: RuntimeString::from("a"),
        impl_name: RuntimeString::from("a"),
        authoring_version: 1,
        spec_version: 1,
        impl_version: 1,
        apis: Cow::<[([u8; 8], u32)]>::Owned(a),
        transaction_version: 1
    };
}
