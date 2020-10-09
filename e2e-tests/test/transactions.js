const { assert } = require('console');
const NodeClient = require('../node-client');
const { nodes } = require('./../config.json');
describe('Transactions', function () {
    this.timeout(10_000);

    let node1, node2, node3;
    
    /**
     * Initialize nodes and insert Aura keys
     */
    before(async () => {
        node1 = new NodeClient(nodes[0].port, nodes[0].validator);
        node2 = new NodeClient(nodes[1].port, nodes[1].validator);
        node3 = new NodeClient(nodes[2].port, nodes[2].validator);
        node1.insertAuraKey(nodes[0].publicKey, nodes[0].mnemonic);
        node2.insertAuraKey(nodes[1].publicKey, nodes[1].mnemonic);
    });

    it('Should be able to submit transaction', async function () {
        const res = await node1.transfer(nodes[1].publicKey, 1010100101010, nodes[0].privateKey);
        assert(!res.error, "Invalid transaction");
        assert(res.result, "Invalid transaction");
    });

    it('Should throw on insufficient balance', async() => {
        const res = await node1.transfer(nodes[1].publicKey, "1152921504606847000", nodes[0].privateKey);
        assert(res.error && !res.result, "Valid transaction");
        assert(res.error.data === "Inability to pay some fees (e.g. account balance too low)", "Valid transaction");
    })

    it("Should throw on already used nonce", async() =>{
        const oldNonce = "0x0100000000000000";
        const res = await node1.unsafeTransfer(nodes[1].publicKey, 10021, oldNonce, nodes[0].privateKey);
        assert(res.error && !res.result, "Valid transaction");
        assert(res.error.data === "Transaction is outdated", "Valid transaction");
    })

    it("should be ok to send to non-existing account", async () => {
        const res = await node1.transfer(nodes[2].publicKey, 100, nodes[0].privateKey);
        assert(!res.error, "Invalid transaction");
        assert(res.result, "Invalid transaction");
    })

    it("should throw on sending from non-existing account ", async()=> {
        const res = await node1.transfer(nodes[2].publicKey, 10, nodes[3].privateKey);
        assert(res.error && !res.result, "Valid transaction");
    })

    it("should throw on missing to, amount, etc.", async() =>{
        const nonce = await node1.getNonce(nodes[0].publicKey);
        const res = await node1.unsafeTransfer("0x", 10021, nonce, nodes[0].privateKey);
        assert(res.error && !res.result, "Valid transaction");
        assert(res.error.message === "Extrinsic has invalid format: Error decoding field OpaqueExtrinsic.0");
    })

    it("tx should be mined, i.e balances reduced/increased correctly", async ()=>{
        const senderOldBalance = await node1.getBalance(nodes[0].publicKey);
        const receiverOldBalance = await node1.getBalance(nodes[2].publicKey);
        const res = await node1.transfer(nodes[2].publicKey, 1000, nodes[0].privateKey);
        assert(!res.error && res.result, "Invalid transaction");
        node1.waitForHead().then(async() => {
            const senderNewBalance = await node1.getBalance(nodes[0].publicKey);
            const receiverNewBalance = await node1.getBalance(nodes[2].publicKey);
            assert(senderOldBalance != senderNewBalance && receiverOldBalance != receiverNewBalance, 
                "Transaction not applied"
            );
        });
    })
    
    afterEach((done) => {
        node1.waitForHead().then(() => {
            done();
        })
    })
});