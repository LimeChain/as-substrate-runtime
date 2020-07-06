extern crate wasmi;
extern crate wabt;
extern crate hex;
extern crate sp_wasm_interface;
extern crate sp_io;

use std::fs;
use hex::FromHex;
use sp_application_crypto::{sr25519};
use sp_consensus_babe::{AuthorityId};
use sc_executor::{WasmExecutor, WasmExecutionMethod};
use sp_wasm_interface::HostFunctions;
use sp_core::{ traits::{ CallInWasm, MissingHostFunctions }, RuntimeDebug, ChangesTrieConfiguration };
use parity_scale_codec::{Decode, Encode};
use sp_runtime::{
    testing::{
        Digest,
        DigestItem
    },
    traits::{
        BlakeTwo256,
        Verify
    }
 };
use sp_version::{RuntimeVersion};
use sp_keyring::AccountKeyring;
use hex_literal::hex;

pub type AccountSignature = sr25519::Signature;
pub type AccountId = <AccountSignature as Verify>::Signer;

/// Calls in transactions.
#[derive(Clone, PartialEq, Eq, Encode, Decode, RuntimeDebug)]
pub struct Transfer {
	pub from: AccountId,
	pub to: AccountId,
	pub amount: u64,
	pub nonce: u64,
}

impl Transfer {
	/// Convert into a signed extrinsic.
	#[cfg(feature = "std")]
	pub fn into_signed_tx(self) -> Extrinsic {
		let signature = AccountKeyring::from_public(&self.from)
			.expect("Creates keyring from public key.").sign(&self.encode()).into();
		Extrinsic::Transfer {
			transfer: self,
			signature,
			exhaust_resources_when_not_first: false,
		}
    }
}

/// Extrinsic for test-runtime.
#[derive(Clone, PartialEq, Eq, Encode, Decode, RuntimeDebug)]
pub enum Extrinsic {
	AuthoritiesChange(Vec<AuthorityId>),
	Transfer {
		transfer: Transfer,
		signature: AccountSignature,
		exhaust_resources_when_not_first: bool,
	},
	IncludeData(Vec<u8>),
	StorageChange(Vec<u8>, Option<Vec<u8>>),
	ChangesTrieConfigUpdate(Option<ChangesTrieConfiguration>),
}

#[cfg(feature = "std")]
impl serde::Serialize for Extrinsic {
	fn serialize<S>(&self, seq: S) -> Result<S::Ok, S::Error> where S: ::serde::Serializer {
		self.using_encoded(|bytes| seq.serialize_bytes(bytes))
	}
}

pub type Header = sp_runtime::generic::Header<u64, BlakeTwo256>;
pub type Block = sp_runtime::generic::Block<Header, Extrinsic>;

fn main() {
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
    
    let b = Block {
        header: Header {
            parent_hash: [69u8; 32].into(),
            number: 1,
            state_root: hex!("e8ff7b3dd4375f6f3a76e24a1999e2a7be2d15b353e49ac94ace1eae3e80eb87").into(),
            extrinsics_root: hex!("03170a2e7597b7b7e3d84c05391d139a62b157e78786d8c082f29dcf4c111314").into(),
            digest: Digest { logs: vec![DigestItem::Other(vec![1])], }, //
        },
        extrinsics: vec![],
    };

    /**
     * 
    Transfer {
            from: AccountKeyring::Alice.into(),
            to: AccountKeyring::Bob.into(),
            amount: 69,
            nonce: 0,
        }.into_signed_tx()
        */
        
    let res1 = executor.call_in_wasm(
        &wasm_code_array,
        None,
        "Core_execute_block",
        &b.encode(),
        &mut ext,
        MissingHostFunctions::Allow).unwrap();
    println!("{:?}", res1);
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
