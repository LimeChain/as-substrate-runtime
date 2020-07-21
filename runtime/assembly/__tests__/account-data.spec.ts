import { MockBuilder } from "./mock-builder";
import { AccountData } from "../modules/balances/account-data";
import { Utils } from "../utils";

describe("AccountData", () => {

    it("should instanciate AccountData from SCALE encoded Byte array", () => {
        const mock = MockBuilder.getAccountDataMock();
        const accountData = AccountData.fromU8Array(mock.bytes);
        assert(accountData.result == mock.instance, "accountData was not instanciated properly");
    });

    it("should instanciate AccountData with zero values from SCALE encoded Byte array", () => {
        const mock = MockBuilder.getDefaultAccountDataMock();
        const accountData = AccountData.fromU8Array(mock.bytes);
        assert(accountData.result == mock.instance, "default account data was not instanciated properly");
    });

    it("should encode AccountData into SCALE Byte Array", () => {
        const accountData = MockBuilder.getAccountDataMock();
        assert(Utils.areArraysEqual(accountData.instance.toU8a(), accountData.bytes), "AccountData was not encoded successfully");
    })

    it("should encode AccountData with zero values into SCALE Byte Array", () => {
        const accountData = MockBuilder.getDefaultAccountDataMock();
        assert(Utils.areArraysEqual(accountData.instance.toU8a(), accountData.bytes), "AccountData was not encoded successfully with zero values");
    })
})