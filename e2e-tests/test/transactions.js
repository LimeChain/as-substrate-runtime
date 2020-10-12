const { assert } = require('console');
const NodeClient = require('../node-client');
const { nodes } = require('./../config.json');
const { UInt, TypeRegistry } = require("@polkadot/types");
const U128 = UInt.with(128, "U128");
const U64 = UInt.with(64, "U64");

describe('Transactions', function () {
    this.timeout(10_000);

    let node1Client, node2Client;
    let [node1, node2, node3, node4] = nodes;
    
    /**
     * Initialize nodes and insert Aura keys
     */
    before(async () => {
        node1Client = new NodeClient(node1.port, node1.validator);
        node2Client = new NodeClient(node2.port, node2.validator);
        await node1Client.insertAuraKey(node1.publicKey, node1.mnemonic);
        await node2Client.insertAuraKey(node2.publicKey, node2.mnemonic);
    });

    it('Should be able to submit transaction', async function () {
        const res = await node1Client.transfer(node2.publicKey, 1010100101010, node1.privateKey);
        assert(!res.error, "Invalid transaction: Transaction has error message");
        assert(res.result, "Invalid transaction: Transaction does not have result property");
    });

    it('Should throw on insufficient balance', async() => {
        const res = await node1Client.transfer(node2.publicKey, "1152921504606847000", node1.privateKey);
        assert(res.error && !res.result, "Valid transaction: Transaction did not throw");
        assert(res.error.data === "Inability to pay some fees (e.g. account balance too low)", "Valid transaction");
    })

    it("Should throw on already used nonce", async() =>{
        const res = await node1Client.unsafeTransfer(node2.publicKey, 10021, 1, node1.privateKey);
        assert(res.error && !res.result, "Valid transaction: Transaction did not throw");
        assert(res.error.data === "Transaction is outdated", "Valid transaction");
    })

    it("should be ok to send to non-existing account", async () => {
        const res = await node1Client.transfer(node3.publicKey, 100, node1.privateKey);
        assert(!res.error, "Invalid transaction: Transaction did not throw");
        assert(res.result, "Invalid transaction: Transaction does not have result property");
    })

    it("should throw on sending from non-existing account ", async()=> {
        const res = await node1Client.transfer(node3.publicKey, 10, node4.privateKey);
        assert(res.error && !res.result, "Valid transaction: Transaction did not throw");
    })

    it("should throw on missing to", async() =>{
        const nonce = await node1Client.getNonce(node1.publicKey);
        const nextNonce = new U64(TypeRegistry, nonce.toNumber() + 1);
        const res = await node1Client.unsafeTransfer("0x", 10021, nextNonce, node1.privateKey);
        assert(res.error && !res.result, "Valid transaction: Transaction did not throw");
        assert(res.error.message === "Verification Error: Execution: Trap: Trap { kind: Unreachable }");
    })
    it("should throw on missing amount", async() =>{
        const nonce = await node1Client.getNonce(node1.publicKey);
        const nextNonce = new U64(TypeRegistry, nonce.toNumber() + 1);
        const res = await node1Client.unsafeTransfer(node3.publicKey, null, nextNonce, node1.privateKey);
        assert(res.error && !res.result, "Valid transaction: Transaction did not throw");
        assert(res.error.message === "Verification Error: Execution: Trap: Trap { kind: Unreachable }");
    })
    it("should throw on missing nonce", async() =>{
        const res = await node1Client.unsafeTransfer(node2.publicKey, 10021, null, node1.privateKey);
        assert(res.error && !res.result, "Valid transaction: Transaction did not throw");
        assert(res.error.message === "Verification Error: Execution: Trap: Trap { kind: Unreachable }");
    })

    it("tx should be mined, i.e balances reduced/increased correctly", async ()=>{
        const senderOldBalance = await node1Client.getBalance(node1.publicKey);
        const receiverOldBalance = await node1Client.getBalance(node3.publicKey);
        const res = await node1Client.transfer(node3.publicKey, 69, node1.privateKey);
        assert(!res.error && res.result, "Invalid transaction");
        node1Client.waitForHead().then(async() => {
            const senderNewBalance = await node1Client.getBalance(node1.publicKey);
            const receiverNewBalance = await node1Client.getBalance(node3.publicKey);
            const amount = new U128(TypeRegistry, 69);

            assert(senderOldBalance.sub(amount).eq(senderNewBalance), "Transaction not applied: Sender balance unchanged");
            assert(receiverOldBalance.add(amount).eq(receiverNewBalance), "Transaction not applied: Receiver balance unchanged");
        });
    })
    
    afterEach((done) => {
        node1Client.waitForHead().then(() => {
            done();
        })
    })
});