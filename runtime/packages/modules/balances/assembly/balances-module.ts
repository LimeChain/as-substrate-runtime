import { AccountData, AccountId } from ".";
import { Storage } from "@as-substrate/core-modules";
import { ByteArray, UInt128 } from "as-scale-codec";

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
     * If the account does not exist, Default AccountData is returned.
     */
    static getAccountData(accountId: AccountId): AccountData {
        const accDataBytes = Storage.get(accountId.getAddress());
        if (accDataBytes.isSome()) {
            return AccountData.fromU8Array((<ByteArray>accDataBytes.unwrap()).values).result;
        } else {
            return AccountData.getDefault();
        }
    }

    /**
     * Sets the balances of a given AccountId
     * Alters the Free balance and Reserved balances in Storage.
     */
    static setBalance(accountId: AccountId, freeBalance: UInt128, reservedBalance: UInt128): AccountData {
        const currentAccountData = BalancesModule.getAccountData(accountId);

        // TODO Any meaningful checks

        currentAccountData.setFree(freeBalance);
        currentAccountData.setReserved(reservedBalance);
        Storage.set(accountId.getAddress(), currentAccountData.toU8a());

        return currentAccountData;
    } 



}