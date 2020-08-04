const { u8aToHex, hexToU8a } = require('@polkadot/util');
const { Text, TypeRegistry, Compact } = require('@polkadot/types');
const { Keyring } = require('@polkadot/api');

const aura = new Text(TypeRegistry, "aura");
const authorities = new Text(TypeRegistry, "authorities");

let result = new Uint8Array(aura.toU8a().length + authorities.toU8a().length);
result.set(aura.toU8a());
result.set(authorities.toU8a(), aura.toU8a().length);

let rawAuthorities = [];

let auth = [
    "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
    "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
];

const keyring = new Keyring({ type: 'sr25519' });
auth.forEach(element => {
    const keyringInstance = keyring.addFromAddress(element);
    const key = keyringInstance.publicKey;
    rawAuthorities = rawAuthorities.concat(u8aToHex(key));
});

console.log(u8aToHex([16, 97, 117, 114, 97, 44, 97, 117, 116, 104, 111, 114, 105, 116, 105, 101, 115]));