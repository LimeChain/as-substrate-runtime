extern crate wasmi;
extern crate wabt;
extern crate hex;

use hex::FromHex;
use wasmi::{ModuleInstance, ImportsBuilder, NopExternals, RuntimeValue::{I32}};

fn main() {

    // let wasm_binary: Vec<u8> = include_bytes!("../../hello-as/build/optimized.wasm").to_vec();
    let wasm_code = "0061736d0100000001130460000060027f7f017f60017f0060017f017f0308070103020000010005030100010611037f0141000b7f0141000b7f004180080b075508066d656d6f72790200075f5f616c6c6f630000085f5f72657461696e0001095f5f72656c656173650002095f5f636f6c6c6563740003075f5f726573657400040b5f5f727474695f6261736503020361646400050801060abe0107920101057f200041f0ffffff034b0440000b230141106a22042000410f6a41707122024110200241104b1b22066a22023f00220541107422034b04402005200220036b41ffff036a4180807c714110762203200520034a1b40004100480440200340004100480440000b0b0b20022401200441106b2202200636020020024101360204200220013602082002200036020c20040b040020000b0300010b0300010b0600230024010b0700200020016a0b0c0041a008240041a00824010b0b1c01004180080b15030000002000000000000000200000000000000020002610736f757263654d617070696e6755524c142e2f6f7074696d697a65642e7761736d2e6d6170";

    // Load wasm binary and prepare it for instantiation.
    let wasm_code_array: Vec<u8> = Vec::from_hex(wasm_code).expect("Decoding failed");
    let module = wasmi::Module::from_buffer(&wasm_code_array)
        .expect("failed to load wasm");

    // Instantiate a module with empty imports and
    // assert that there is no `start` function.
    let instance = ModuleInstance::new(
            &module,
            &ImportsBuilder::new()
        )
        .expect("failed to instantiate wasm module")
        .run_start(&mut NopExternals)
        .expect("failed to run start on Module");
    
    let a = instance.invoke_export(
            "add",
            &[I32(1), I32(2)],
            &mut NopExternals,
        ).expect("failed to execute export");
    println!("{:?}", a);
}
