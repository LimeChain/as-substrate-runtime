
/**
 * Temporary test functions for the Balances Module
 */
import { Serialiser } from "../serialiser";
import { BalancesModule, AccountId } from "../../modules/balances";

/**
 * Test get account data using the Balances Module
 * @param data - i32 pointer to the start of the arguments passed
 * @param len - i32 length (in bytes) of the arguments passed
 */

export function test_balances_get_account_data(data: i32, len: i32): u64 {
    const input = Serialiser.deserialiseInput(data, len);

    const decodedAccountId = AccountId.fromU8Array(input);
    const accountData = BalancesModule.getAccountData(decodedAccountId.result);

    return Serialiser.serialiseResult(accountData.toU8a());
}