const { assert } = require('console');
const NodeClient = require('../node-client');
const { nodes } = require('./../config.json');
const { UInt, TypeRegistry } = require("@polkadot/types");
const U128 = UInt.with(128, "U128");
const U64 = UInt.with(64, "U64");

describe('Transactions', function () {
    this.timeout(10_000);

    let node1, node2, node3;
    let node1Obj = nodes[0];
    let node2Obj = nodes[1];
    let node3Obj = nodes[2];
    let node4Obj = nodes[3];
    
    /**
     * Initialize nodes and insert Aura keys
     */
    before(async () => {
        node1 = new NodeClient(node1Obj.port, node1Obj.validator);
        node2 = new NodeClient(node2Obj.port, node2Obj.validator);
        node3 = new NodeClient(node3Obj.port, node3Obj.validator);
        await node1.insertAuraKey(node1Obj.publicKey, node1Obj.mnemonic);
        await node2.insertAuraKey(node2Obj.publicKey, node2Obj.mnemonic);
    });

    it('Should be able to submit transaction', async function () {
        const res = await node1.transfer(node2Obj.publicKey, 1010100101010, node1Obj.privateKey);
        assert(!res.error, "Invalid transaction: Transaction has error message");
        assert(res.result, "Invalid transaction: Transaction does not have result property");
    });

    it('Should throw on insufficient balance', async() => {
        const res = await node1.transfer(node2Obj.publicKey, "1152921504606847000", node1Obj.privateKey);
        assert(res.error && !res.result, "Valid transaction: Transaction did not throw");
        assert(res.error.data === "Inability to pay some fees (e.g. account balance too low)", "Valid transaction");
    })

    it("Should throw on already used nonce", async() =>{
        const res = await node1.unsafeTransfer(node2Obj.publicKey, 10021, 1, node1Obj.privateKey);
        assert(res.error && !res.result, "Valid transaction: Transaction did not throw");
        assert(res.error.data === "Transaction is outdated", "Valid transaction");
    })

    it("should be ok to send to non-existing account", async () => {
        const res = await node1.transfer(node3Obj.publicKey, 100, node1Obj.privateKey);
        assert(!res.error, "Invalid transaction: Transaction did not throw");
        assert(res.result, "Invalid transaction: Transaction does not have result property");
    })

    it("should throw on sending from non-existing account ", async()=> {
        const res = await node1.transfer(node3Obj.publicKey, 10, node4Obj.privateKey);
        assert(res.error && !res.result, "Valid transaction: Transaction did not throw");
    })

    it("should throw on missing to", async() =>{
        const nonce = await node1.getNonce(node1Obj.publicKey);
        const nextNonce = new U64(TypeRegistry, nonce.toNumber() + 1);
        const res = await node1.unsafeTransfer("0x", 10021, nextNonce, node1Obj.privateKey);
        assert(res.error && !res.result, "Valid transaction: Transaction did not throw");
        assert(res.error.message === "Verification Error: Execution: Trap: Trap { kind: Unreachable }");
    })
    it("should throw on missing amount", async() =>{
        const nonce = await node1.getNonce(node1Obj.publicKey);
        const nextNonce = new U64(TypeRegistry, nonce.toNumber() + 1);
        const res = await node1.unsafeTransfer(node3Obj.publicKey, null, nextNonce, node1Obj.privateKey);
        assert(res.error && !res.result, "Valid transaction: Transaction did not throw");
        assert(res.error.message === "Verification Error: Execution: Trap: Trap { kind: Unreachable }");
    })
    it("should throw on missing nonce", async() =>{
        const res = await node1.unsafeTransfer(node2Obj.publicKey, 10021, null, node1Obj.privateKey);
        assert(res.error && !res.result, "Valid transaction: Transaction did not throw");
        assert(res.error.message === "Verification Error: Execution: Trap: Trap { kind: Unreachable }");
    })

    it("tx should be mined, i.e balances reduced/increased correctly", async ()=>{
        const senderOldBalance = await node1.getBalance(node1Obj.publicKey);
        const receiverOldBalance = await node1.getBalance(node3Obj.publicKey);
        const res = await node1.transfer(node3Obj.publicKey, 69, node1Obj.privateKey);
        assert(!res.error && res.result, "Invalid transaction");
        node1.waitForHead().then(async() => {
            const senderNewBalance = await node1.getBalance(node1Obj.publicKey);
            const receiverNewBalance = await node1.getBalance(node3Obj.publicKey);
            const amount = new U128(TypeRegistry, 69);
            assert(senderOldBalance != senderNewBalance && receiverOldBalance != receiverNewBalance, 
                "Transaction not applied"
            );

            assert(senderOldBalance.sub(amount).eq(senderNewBalance) && receiverOldBalance.add(amount).eq(receiverNewBalance), 
                "Transaction not applied");
        });
    })
    
    afterEach((done) => {
        node1.waitForHead().then(() => {
            done();
        })
    })
});