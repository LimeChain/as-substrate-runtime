import { Extrinsic, Option } from "../../models";
import { AccountId } from "../../models/account-id";
import { AccountData } from "./account-data";
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
        // const accDataBytes = Storage.get(accountId.getAddress()); //TODO use new version of Storage
        // if (accDataBytes.length != 0) {
        //     return AccountData.fromU8Array(accDataBytes).result;            
        // } else {
        //     return AccountData.getDefault();
        // }
    }

    /**
     * 
     * @param params 
     */
    static setBalance(origin: Extrinsic): void {
        

    }



}