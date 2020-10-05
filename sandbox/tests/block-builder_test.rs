extern crate sandbox_execution_environment;
use sandbox_execution_environment::{ Transfer, Setup, Header, AccountId };
use sc_executor::{WasmExecutor, WasmExecutionMethod};
use sp_state_machine::TestExternalities as CoreTestExternalities;
use parity_scale_codec::{Encode, Compact, Decode};
use sp_runtime::{ traits::{BlakeTwo256 }};
use sp_wasm_interface::HostFunctions as _;
pub use sp_inherents::{InherentData, InherentIdentifier, CheckInherentsResult, IsFatalError};
use sp_keyring::AccountKeyring;
use sp_core::{traits::{ CallInWasm, Externalities, MissingHostFunctions}};
type HostFunctions = sp_io::SubstrateHostFunctions;
pub type TestExternalities = CoreTestExternalities<BlakeTwo256, u64>;

use hex_literal::hex;


fn get_inherent_data_instance() -> InherentData {
    let mut inh = InherentData::new();
    
    const TM_KEY: InherentIdentifier = *b"timstap0";
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

fn get_timestamp_inherent() -> Vec<u8>{
    const ALL_MODULES: Compact<u8> = Compact(1);
    const SIZE: Compact<u8> = Compact(10);
    const OPTION: Compact<u8> = Compact(1);
    let call_index: Vec<u8> = vec![2, 0];
    const COMPACT_PREFIX: u8 = 11;
    const DEFAULT_VALUE: u64 = 1;

    let mut exp_inherent: Vec<u8> = vec![];
    exp_inherent.extend(ALL_MODULES.encode());
    exp_inherent.extend(SIZE.encode());
    exp_inherent.extend(OPTION.encode());
    exp_inherent.extend(call_index);
    exp_inherent.push(COMPACT_PREFIX);
    exp_inherent.extend((DEFAULT_VALUE).encode());

    exp_inherent
}

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

// scale encode array of strings
fn encode_strs(args: Vec<&str>) -> Vec<u8>{
    let mut result = vec![];
    for text in args{
        result.extend(text.encode());
    }
    result
}

#[test]
fn test_block_builder_apply_extrinsic() {
    let setup = Setup::new();
    let mut ext = setup.ext;
    let mut ext = ext.ext();
    
    let init_balance: u64 = 1234567;
    const EXTRINSIC_LEN: u16 = 145;

    let from: AccountId = AccountKeyring::Alice.into();
    let to: AccountId = AccountKeyring::Bob.into();

    ext.set_storage(from.encode(), init_balance.encode());
    ext.set_storage(to.encode(), init_balance.encode());

    let ex = Transfer {
        from: from,
        to: to,
        amount: 69,
        nonce: 0,
    }.into_signed_tx();
    
    let len: Compact<u16> = Compact(EXTRINSIC_LEN);

    let mut bytes = len.encode();
    bytes.extend(&ex.encode()[1..]);

    let result = call_in_wasm(
        "BlockBuilder_apply_extrinsic",
        &bytes,
        WasmExecutionMethod::Interpreted,
        &mut ext
    ).unwrap();
    assert_eq!(result, [0u8; 2]);
}

#[test]
fn test_block_builder_inherent_extrinsics() {
    let setup = Setup::new();
    let mut ext = setup.ext;
    let mut ext = ext.ext();

    let exp_inherent = get_timestamp_inherent();

    let inh = get_inherent_data_instance();

    let result = call_in_wasm(
        "BlockBuilder_inherent_extrinsics",
        &inh.encode(),
        WasmExecutionMethod::Interpreted,
        &mut ext
    ).unwrap();

    assert_eq!(result, &exp_inherent[0..12]);
}

#[test]
fn test_block_builder_check_inherent_result() {
    let setup = Setup::new();
    let mut ext = setup.ext;
    let mut ext = ext.ext();

    let expected_result = sp_inherents::CheckInherentsResult::new();
    let result = call_in_wasm(
        "BlockBuilder_check_inherents",
        &expected_result.encode(),
        WasmExecutionMethod::Interpreted,
        &mut ext,
    ).unwrap();
    println!("{:?}", result);
    assert_eq!(result, [0x1]);
}

#[test]
fn test_block_builder_finalize_block() {
    let setup = Setup::new();
    let mut ext = setup.ext;
    let mut ext = ext.ext();

    let header: Header = Header {
        parent_hash: [69u8; 32].into(),
        number: 1,
        state_root: hex!("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff").into(),
        extrinsics_root: hex!("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff").into(),
        digest: Default::default(),
    };

    let _ = call_in_wasm(
        "Core_initialize_block",
        &header.encode(),
        WasmExecutionMethod::Interpreted,
        &mut ext,
    );

    let timestamp_inherent: Vec<u8> = get_timestamp_inherent();
    println!("timstmp: {:?}", &timestamp_inherent[1..12]);

    let _res = call_in_wasm(
        "BlockBuilder_apply_extrinsic",
        &timestamp_inherent[1..12],
        WasmExecutionMethod::Interpreted,
        &mut ext,
    ).unwrap();

    let result = call_in_wasm(
        "BlockBuilder_finalize_block",
        &[],
        WasmExecutionMethod::Interpreted,
        &mut ext,
    ).unwrap();

    let storage_root = ext.storage_root();
    // check if values are removed
    let check_removed: bool = !(ext.exists_storage(&encode_strs(vec!["system", "exec_phase"]))
        && ext.exists_storage(&encode_strs(vec!["system", "block_num0"]))
        && ext.exists_storage(&encode_strs(vec!["system", "parent_hsh"]))
        && ext.exists_storage(&encode_strs(vec!["system", "extcs_root"]))
        && ext.exists_storage(&encode_strs(vec!["system", "digests_00"])));
    
    let final_header = <Header>::decode(&mut result.as_ref()).unwrap();

    let cmp_headers: bool = header.parent_hash == final_header.parent_hash
        && header.number == final_header.number
        && header.digest == final_header.digest;
    
    assert_eq!(cmp_headers, true);
    assert_eq!(check_removed, true);
    assert_eq!(final_header.state_root.encode(), storage_root);
}
#[test]
fn test_block_builder_random_seed() {
    let setup = Setup::new();
    let mut ext = setup.ext;
    let mut ext = ext.ext();

    let result = call_in_wasm(
        "BlockBuilder_random_seed",
        &[],
        WasmExecutionMethod::Interpreted,
        &mut ext,
    ).unwrap();
    println!("{:?}", result);
    assert_eq!(result, [0u8; 0]);
}