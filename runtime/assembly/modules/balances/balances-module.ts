import { Extrinsic } from "../../models";
import { AccountData, AccountId } from ".";
import { Storage } from "../storage";

/**
 * The Balances Module.
 * Used for account balance manipulation such as:
 *  - Getting and setting free/reserved balances (TODO)
 *  - Retrieving total, reserved and unreserved balances (TODO)
 *  - Transferring a balance between accounts (when not reserved) (TODO)
 *  - Slashing an account balance (TODO)
 *  - Account creation and removal (TODO)
 *  - Managing total issuance (TODO)
 *  - Setting and managing locks (TODO)
 */
export class BalancesModule {

    /**
     * Returns AccountData for a given AccountId
     * Returns AccountData. If the account does not exist, Default AccountData is returned.
     */
    static getAccountData(accountId: AccountId): AccountData {
        const accDataBytes = Storage.get(accountId.getAddress());
        if (accDataBytes.isSome()) {
            return AccountData.fromU8Array((<u8[]>accDataBytes.unwrap()).slice(1)).result;
        } else {
            return AccountData.getDefault();
        }
    }

    /**
     * 
     * @param params 
     */
    static setBalance(origin: Extrinsic): void {
        // TODO
    }



}