extern crate sandbox_execution_environment;
use sandbox_execution_environment::{ Transfer, Setup, Header };
use sp_core::{ traits::{ CallInWasm, MissingHostFunctions }};
use parity_scale_codec::{Encode, Compact};
pub use sp_inherents::{InherentData, InherentIdentifier, CheckInherentsResult, IsFatalError};
use sp_keyring::AccountKeyring;

use hex_literal::hex;

fn get_inherent_data_instance() -> InherentData {
    let mut inh = InherentData::new();
    
    const TM_KEY: InherentIdentifier = *b"timstmp0";
    let tm_value: u64 = 1;
    
    const BS_KEY: InherentIdentifier = *b"babeslot";
    let bs_value: u64 = 2;
    
    const FN_KEY: InherentIdentifier = *b"finalnum";
    let fn_value: Compact<u64> = Compact(1);
    
    const UN_KEY: InherentIdentifier = *b"uncles00";

    let header_1: Header = Header {
        parent_hash: [69u8; 32].into(),
        number: 1,
        state_root: hex!("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff").into(),
        extrinsics_root: hex!("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff").into(),
        digest: Default::default(),
    };

    let un_value: [Header; 1] = [header_1];

    inh.put_data(TM_KEY, &tm_value).unwrap();
    inh.put_data(BS_KEY, &bs_value).unwrap();
    inh.put_data(FN_KEY, &fn_value).unwrap();
    inh.put_data(UN_KEY, &un_value).unwrap();

    return inh;
}

#[test]
fn test_block_builder_apply_extrinsics() {
    let mut setup = Setup::new();
    let ex = Transfer {
        from: AccountKeyring::Alice.into(),
        to: AccountKeyring::Bob.into(),
        amount: 69,
        nonce: 5,
    }.into_signed_tx();
    
    let result = setup.executor.call_in_wasm(
        &setup.wasm_code_array,
        None,
        "BlockBuilder_apply_extrinsics",
        &ex.encode(),
        &mut setup.ext.ext(),
        MissingHostFunctions::Allow).unwrap();
    println!("{:?}", result);
    assert_eq!(result, [0u8; 0]);
}

#[test]
fn test_block_builder_inherent_extrinsics() {
    let mut setup = Setup::new();

    let inh = get_inherent_data_instance();

    let result = setup.executor.call_in_wasm(
        &setup.wasm_code_array,
        None,
        "BlockBuilder_inherent_extrinsics",
        &inh.encode(),
        &mut setup.ext.ext(),
        MissingHostFunctions::Allow).unwrap();

    println!("{:?}", &inh.encode());
    assert_eq!(result, [0u8; 0]);
}

#[test]
fn test_block_builder_check_inherent_result() {
    let mut setup = Setup::new();
    let expected_result = sp_inherents::CheckInherentsResult::new();
    let result = setup.executor.call_in_wasm(
        &setup.wasm_code_array,
        None,
        "BlockBuilder_check_inherents",
        &expected_result.encode(),
        &mut setup.ext.ext(),
        MissingHostFunctions::Allow).unwrap();
    println!("{:?}", result);
    assert_eq!(result, [0x1]);
}

#[test]
fn test_block_builder_finalize_block() {
    let mut setup = Setup::new();
    let result = setup.executor.call_in_wasm(
        &setup.wasm_code_array,
        None,
        "BlockBuilder_finalize_block",
        &[],
        &mut setup.ext.ext(),
        MissingHostFunctions::Allow).unwrap();
    println!("{:?}", result);
    assert_eq!(result, [0x1]);
}

#[test]
fn test_block_builder_random_seed() {
    let mut setup = Setup::new();
    let result = setup.executor.call_in_wasm(
        &setup.wasm_code_array,
        None,
        "BlockBuilder_random_seed",
        &[],
        &mut setup.ext.ext(),
        MissingHostFunctions::Allow).unwrap();
    println!("{:?}", result);
    assert_eq!(result, [0u8; 0]);
}