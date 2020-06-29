extern crate wasmi;
extern crate wabt;
extern crate hex;
extern crate sp_wasm_interface;
extern crate sp_io;

use std::fs;
use hex::FromHex;
// use wasmi::{ModuleInstance, ImportsBuilder, NopExternals, RuntimeValue::{I32}};
use sc_executor::{WasmExecutor, WasmExecutionMethod};
use sp_core::{ traits::{ CallInWasm, MissingHostFunctions } };

fn main() {
    let wasm_code:String = fs::read_to_string("wasm-code")
        .expect("file cannot be found")
        .parse()
        .expect("unable to parse file content to string");
        
    let wasm_code_array: Vec<u8> = Vec::from_hex(wasm_code).expect("Decoding failed");

    let mut ext = sp_io::TestExternalities::default();
    let mut ext = ext.ext();
    
    let executor = WasmExecutor::new(
        WasmExecutionMethod::Interpreted,
        Some(1024),
        vec![],
        8,
    );
    let res = executor.call_in_wasm(
        &wasm_code_array,
        None,
        "add",
        &[],
        &mut ext,
        MissingHostFunctions::Allow).unwrap();
    println!("{:?}", res);

}

// Load wasm binary and prepare it for instantiation.
    
// let module = wasmi::Module::from_buffer(&wasm_code_array)
//     .expect("failed to load wasm");

// // Instantiate a module with empty imports and
// // assert that there is no `start` function.
// let instance = ModuleInstance::new(
//         &module,
//         &ImportsBuilder::new()
//     )
//     .expect("failed to instantiate wasm module")
//     .run_start(&mut NopExternals)
//     .expect("failed to run start on Module");

// let a = instance.invoke_export(
//         "add",
//         &[I32(1), I32(2)],
//         &mut NopExternals,
//     ).expect("failed to execute export");
// println!("{:?}", a);
