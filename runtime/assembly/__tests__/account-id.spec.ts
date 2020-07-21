import { MockConstants } from "./mock-constants";
import { AccountId } from "../modules/balances";

describe("AccountId", () => {

    it("should instanciate AccountId from SCALE encoded Byte array", () => {
        const expectedObj = new AccountId(MockConstants.ALICE_ADDRESS)
        const accountId = AccountId.fromU8Array(MockConstants.ALICE_ADDRESS);
        assert(accountId.result == expectedObj, "AccountId was not instanciated properly");
    });

    throws("should throw when trying to instanciate AccountId with bytes length != 32", () => {
        AccountId.fromU8Array([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    })

    throws("should throw when trying to instanciate AccountId from SCALE Ecndoed bytes with length < 32", () => {
        const accId = new AccountId([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    })

});