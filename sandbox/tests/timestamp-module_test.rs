// extern crate sandbox_execution_environment;
// use sc_executor::{WasmExecutor, WasmExecutionMethod};
// use sandbox_execution_environment::{Setup};
// use sp_core::{ traits::{ CallInWasm, Externalities, MissingHostFunctions}};
// use sp_runtime::{ traits::{BlakeTwo256 }};
// use sp_state_machine::TestExternalities as CoreTestExternalities;
// use parity_scale_codec::{Encode};
// use sp_wasm_interface::HostFunctions as _;
// pub use sp_inherents::{InherentData, InherentIdentifier, CheckInherentsResult, IsFatalError};
// type HostFunctions = sp_io::SubstrateHostFunctions;


// pub type TestExternalities = CoreTestExternalities<BlakeTwo256, u64>;

// fn call_in_wasm<E: Externalities> (
//     function: &str,
//     call_data: &[u8],
//     execution_method: WasmExecutionMethod,
//     ext: &mut E
// ) -> Result<Vec<u8>, String> {
//     let setup = Setup::new();
//     let executor = crate::WasmExecutor::new(
// 		execution_method,
// 		Some(1024),
// 		HostFunctions::host_functions(),
// 		8,
// 	);
//     executor.call_in_wasm(
//         &setup.wasm_code_array,
//         None,
//         function,
//         call_data,
//         ext,
//         MissingHostFunctions::Allow,
//     )
// }

// #[test]
// fn timestamp_set_works() {
//     let setup = Setup::new();
//     let mut ext = setup.ext;
//     let mut ext = ext.ext();

//     let mut key = vec![];
//     key.extend(b"timestamp".to_vec().encode());
//     key.extend(b"now".to_vec().encode());

//     let init_value: u64 = 42;
//     ext.set_storage(key.clone(), init_value.encode());
    
//     let value: u64 = 69;
//     let result = call_in_wasm(
//         "test_timestamp_set", 
//         &value.encode(),
//         WasmExecutionMethod::Interpreted,
//         &mut ext
//     );
//     println!("{:?}", result);
//     println!("{:?}", ext.storage(&key.clone()));
//     //assert_eq!(Some(ext.storage(&key)).unwrap(), Option(69));
// }

// // #[test]
// // #[should_panic(expected = "Timestamp must be updated only once in the block")]
// // fn double_timestamp_should_fail() {
// //     new_test_ext().execute_with(|| {
// //         Timestamp::set_timestamp(42);
// //         assert_ok!(Timestamp::set(Origin::none(), 69));
// //         let _ = Timestamp::set(Origin::none(), 70);
// //     });
// // }

// // #[test]
// // #[should_panic(expected = "Timestamp must increment by at least <MinimumPeriod> between sequential blocks")]
// // fn block_period_minimum_enforced() {
// //     new_test_ext().execute_with(|| {
// //         Timestamp::set_timestamp(42);
// //         let _ = Timestamp::set(Origin::none(), 46);
// //     });
// // }
