import { AccountData, AccountId } from ".";
import { Extrinsic, TransactionValidity, ResponseCodes } from '@as-substrate/models';
import { Storage, Log, System } from "@as-substrate/core-modules";
import { ByteArray, UInt128 } from "as-scale-codec";
import { u128 } from "as-bignum";


/**
 * The Balances Module.
 * Used for account balance manipulation such as:
 *  - Getting and setting free/reserved balances
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
        const currentAccountData = this.getAccountData(accountId);

        // TODO Any meaningful checks

        currentAccountData.setFree(freeBalance);
        currentAccountData.setReserved(reservedBalance);
        Storage.set(accountId.getAddress(), currentAccountData.toU8a());

        return currentAccountData;
    }

    /**
     * Transfer the given amount from sender to receiver
     * Note: this is just draft implementation, without necessary checks
     * @param sender 
     * @param receiver 
     * @param amount 
     */
    static transfer(sender: AccountId, receiver: AccountId, amount: u64): void {
        const senderAccData = this.getAccountData(sender);
        const receiverAccData = this.getAccountData(receiver);
        const senderNewBalance: UInt128 = new UInt128(u128.sub(senderAccData.getFree().value, u128.fromU64(amount)));
        const receiverNewBalance: UInt128 = new UInt128(u128.add(receiverAccData.getFree().value, u128.fromU64(amount)));
        this.setBalance(sender, senderNewBalance, senderAccData.getReserved());
        this.setBalance(receiver, receiverNewBalance, receiverAccData.getReserved());
        System.incAccountNonce(sender);
        Log.info("done transfering: " + amount.toString());
    }

    /**
     * Apply extrinsic for the module
     * @param extrinsic 
     */
    static applyExtrinsic(extrinsic: Extrinsic): void{
        const sender: AccountId = AccountId.fromU8Array(extrinsic.from.toU8a()).result;
        const receiver: AccountId = AccountId.fromU8Array(extrinsic.to.toU8a()).result;
        const validated = this.validateTransaction(extrinsic);
        if(!validated.valid){
            Log.error(validated.message);
            return ;
        }
        this.transfer(sender, receiver, extrinsic.amount.value);
    }

    /**
     * 
     */
    static validateTransaction(extrinsic: Extrinsic): TransactionValidity{
        const from: AccountId = AccountId.fromU8Array(extrinsic.from.toU8a()).result;
        const fromBalance = BalancesModule.getAccountData(from);
        const balance: UInt128 = fromBalance.getFree();
        if(balance.value < u128.fromU64(extrinsic.amount.value)){
            return new TransactionValidity(
                false,
                ResponseCodes.INSUFFICIENT_BALANCE,
                "Validation error: Sender does not have enough balance"
            );
        }
        // TO-DO add check for existentialDeposit amount
        return new TransactionValidity(
            true,
            [],
            "Valid transaction"
        );
    }
}