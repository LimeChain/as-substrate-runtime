const NodeClient = require('./node-client');
const config = require('./config.json');
const { numberToU8a } = require('@polkadot/util');
const { TypeRegistry, UInt} = require('@polkadot/types');

const nodeJson = config.nodes[0];
const nodeJson1 = config.nodes[1];

const node1 = new NodeClient(nodeJson.port, nodeJson.validator, nodeJson.publicKey);
const node2 = new NodeClient(nodeJson1.port, nodeJson1.validator, nodeJson1.publicKey);


// node1.transfer(node2.publicKey, 2, nodeJson.privateKey)
//     .then(res => console.log(res))
//     .catch(error => console.log(error))

const U64 = UInt.with(64, "u64");
const num64 = new U64(TypeRegistry, 123412441241241);
const num = numberToU8a(1000000, 64);
console.log(num64.toU8a() + " and " + num.toString());