import { Serialiser } from "../serialiser";
import { BalancesModule } from "../../modules/balances/balances-module";
import { AccountId } from "../../models/account-id";

export function test_balances_get_account_data(data: i32, len: i32): u64 {
    const input = Serialiser.deserialise_input(data, len);

    const decodedAccountId = AccountId.fromU8Array(input);
    BalancesModule.getAccountData(decodedAccountId.result);

    return Serialiser.serialise_result(input);
}