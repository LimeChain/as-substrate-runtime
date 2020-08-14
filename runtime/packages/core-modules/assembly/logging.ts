import { Serialiser } from '@as-substrate/core-utils';
import { ScaleString } from 'as-scale-codec';
import { ext_misc_print_utf8_version_1 } from './env';

export class Logging {
    /**
     * Prints a message to the Host
     * @param message message to log
     */
    static printUtf8(message: string): void{
        const msg: ScaleString = new ScaleString(message);
        const encodedMessage = Serialiser.serialiseResult(msg.toU8a().slice(1, msg.encodedLength()));
        ext_misc_print_utf8_version_1(encodedMessage);
    }
}