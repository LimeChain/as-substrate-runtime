const { assert } = require('console');
const NodeClient = require('../node-client');
const { nodes } = require('./../config.json');
describe('Transactions', function () {
    let node1, node2, node3;
    /**
     * Initialize nodes and insert Aura keys
     */
    before(async () => {
        node1 = new NodeClient(nodes[0].port, nodes[0].validator, nodes[0].publicKey);
        node2 = new NodeClient(nodes[1].port, nodes[1].validator, nodes[1].publicKey);
        node3 = new NodeClient(nodes[2].port, nodes[2].validator, nodes[2].publicKey);
        node1.insertAuraKey(nodes[0].mnemonic);
        node2.insertAuraKey(nodes[1].mnemonic);
    })

    it('Should be able to submit transaction', async function () {
        const res = await node1.transfer(node2.publicKey, 1010100101010, nodes[0].privateKey);
        assert(!res.error, "Invalid transaction");
        assert(res.result, "Invalid transaction");
    });

    it('Should throw on insufficient balance', async() => {
        const res = await node1.transfer(node2.publicKey, 10101001010, nodes[0].privateKey);
        console.log(res);
        assert(res.error && !res.result, "Valid transaction");
        assert(res.error.data === "Inability to pay some fees (e.g. account balance too low)", "Valid transaction");
    })

});