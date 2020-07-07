extern crate sandbox_execution_environment;

use sandbox_execution_environment::get_wasm_code_arr;
use sandbox_execution_environment::Block;
use sandbox_execution_environment::get_wasm_executor;
use sandbox_execution_environment::Header;
use sp_core::{ traits::{ CallInWasm, MissingHostFunctions }};
use parity_scale_codec::{Decode, Encode};
use sp_version::{RuntimeVersion};


pub fn main() {
    let wasm_code_array = get_wasm_code_arr();
    let executor = get_wasm_executor();

    let mut ext = sp_io::TestExternalities::default();
    let mut ext = ext.ext();

    let res = executor.call_in_wasm(
        &wasm_code_array,
        None,
        "Core_version",
        &[],
        &mut ext,
        MissingHostFunctions::Allow).unwrap();
    println!("{:?}", <RuntimeVersion>::decode(&mut res.as_ref()));
    
    let h = Header {
        parent_hash: [69u8; 32].into(),
        number: 1,
        state_root: Default::default(),
        extrinsics_root: Default::default(),
        digest: Default::default(),
    };
    
    let b = Block {
        header: h.clone(),
        extrinsics: vec![],
    };
        
    let res1 = executor.call_in_wasm(
        &wasm_code_array,
        None,
        "Core_execute_block",
        &b.encode(),
        &mut ext,
        MissingHostFunctions::Allow).unwrap();
    println!("{:?}", <Block>::decode(&mut res1.as_ref()));


    let res2 = executor.call_in_wasm(
        &wasm_code_array,
        None,
        "Core_initialize_block",
        &h.encode(),
        &mut ext,
        MissingHostFunctions::Allow).unwrap();
    println!("{:?}", <Header>::decode(&mut res2.as_ref()));
}


// Not used
// fn get_runtime_version () -> RuntimeVersion {
//     let a: Vec<(ApiId, u32)> = vec![([1,1,1,1,1,1,1,1], 10)];

//     return RuntimeVersion {
//         spec_name: RuntimeString::from("a"),
//         impl_name: RuntimeString::from("a"),
//         authoring_version: 1,
//         spec_version: 1,
//         impl_version: 1,
//         apis: Cow::<[([u8; 8], u32)]>::Owned(a),
//         transaction_version: 1
//     };
// }
