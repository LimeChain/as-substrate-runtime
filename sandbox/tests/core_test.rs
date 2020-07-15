extern crate sandbox_execution_environment;
extern crate hex;
use sandbox_execution_environment::{ Block, Header, Setup };
use sp_version::{ApiId, RuntimeVersion};
use sp_core::{ traits::{ CallInWasm, MissingHostFunctions }, ChangesTrieConfiguration};
use parity_scale_codec::{Encode, Decode};
use sp_keyring::AccountKeyring;
use sp_runtime::{ RuntimeString, Digest, DigestItem, generic::ChangesTrieSignal };
use std::borrow::Cow;
use hex_literal::hex;


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
            digest: Digest {
				logs: vec![
                    DigestItem::Other(vec![1,1,1]),
                    DigestItem::ChangesTrieRoot(hex!("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff").into()),
                    DigestItem::Consensus([b'a', b'u', b'r', b'a'], vec![1,1,1]),
                    DigestItem::Seal([1, 1, 1, 1], vec![2, 2, 2]),
                    DigestItem::PreRuntime([1, 1, 1, 1], vec![2, 2, 2])
				],
			},
        },
        extrinsics: vec![]
    };


            // sandbox_execution_environment::Transfer {
            //     from: AccountKeyring::Alice.into(),
            //     to: AccountKeyring::Bob.into(),
            //     amount: 69,
            //     nonce: 15,
            // }.into_signed_tx(),
            // sandbox_execution_environment::Transfer {
            //     from: AccountKeyring::Alice.into(),
            //     to: AccountKeyring::Bob.into(),
            //     amount: 70,
            //     nonce: 16,
            // }.into_signed_tx()

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
