const { Keyring } = require('@polkadot/api');
const { u8aToHex, stringToU8a } = require('@polkadot/util');
const { Text, TypeRegistry } = require('@polkadot/types');

class Aura {
    
    static AURA_AUTHORITIES = u8aToHex(result);
    static toRaw(authorities){
        const rawAuthorities = [];

        const aura = new Text(TypeRegistry, "aura");
        const authorities = new Text(TypeRegistry, "authorities");

        let result = new Uint8Array(aura.toU8a().length + authorities.toU8a().length);
        result.set(aura.toU8a());
        result.set(authorities.toU8a(), aura.toU8a().length);

        authorities.forEach(element => {
            const keyringInstance = Keyring.addFromAddress();
            const key = keyringInstance.publicKey;
            rawAuthorities.concat(key);
        });
    }
}
