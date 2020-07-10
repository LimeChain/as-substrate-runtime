extern crate sp_wasm_interface;
extern crate sp_io;
use std::fs;
use hex::FromHex;
use sp_application_crypto::{sr25519};
use sp_consensus_babe::{AuthorityId};
use sc_executor::{WasmExecutor, WasmExecutionMethod};
use sp_wasm_interface::HostFunctions;
use sp_core::{ RuntimeDebug, ChangesTrieConfiguration };
use parity_scale_codec::{Decode, Encode, Compact};
use sp_runtime::{
    traits::{
        BlakeTwo256,
        Verify
    }
 };
pub type AccountSignature = sr25519::Signature;
pub type AccountId = <AccountSignature as Verify>::Signer;

#[derive(Clone, PartialEq, Eq, Encode, Decode, RuntimeDebug)]
pub struct Inherent {
	pub timestamp: u64,
	pub babeslot: u64,
	pub finalnum: Compact<u64>,
	pub uncles: Vec<Header>
}

impl Inherent {
	pub fn new() -> Self {
		Self {
			timestamp: 0,
			babeslot: 0,
			finalnum: Compact(0),
			uncles: Default::default()
		}
	}
}

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
		let signature = sp_keyring::AccountKeyring::from_public(&self.from)
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


// setup for the tests
pub struct Setup {
    pub executor: sc_executor::WasmExecutor,
    pub wasm_code_array: Vec<u8>,
    pub ext: sp_io::TestExternalities
}
impl Setup{
    pub fn new() -> Self {
        Self {
            executor: get_wasm_executor(),
            wasm_code_array: get_wasm_code_arr(),
            ext: sp_io::TestExternalities::default()
        }
    }
}

pub fn get_wasm_code_arr () -> Vec<u8> {
    let wasm_code:String = fs::read_to_string("wasm-code")
        .expect("file cannot be found")
        .parse()
        .expect("unable to parse file content to string");
    return Vec::from_hex(wasm_code).expect("Decoding failed");
}
pub fn get_wasm_executor () -> WasmExecutor {
    return WasmExecutor::new(
        WasmExecutionMethod::Interpreted,
        Some(1024),
        sp_io::SubstrateHostFunctions::host_functions(),
        1,
    );
}