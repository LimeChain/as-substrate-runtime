import { Serialiser, Utils } from '@as-substrate/core-utils';
import { ext_misc_print_utf8_version_1, ext_logging_log_version_1 } from './env';

export class Log {
    public static readonly LOG_TARGET: string = "runtime";
    public static readonly ERROR_LEVEL: i32 = 0;
    public static readonly WARN_LEVEL: i32 = 1;
    /**
     * Base function for logging
     * @param logLevel 
     * @param message 
     */
    static baseLog(logLevel: i32, message: string): void {
        const messageU8a: u8[] = Utils.stringsToU8a([message]);
        const logTarget = Serialiser.serialiseResult(Utils.stringsToU8a([Log.LOG_TARGET]));
        const encodedMessage = Serialiser.serialiseResult(messageU8a);
        ext_logging_log_version_1(logLevel, logTarget, encodedMessage);
    }

    /**
     * Prints a message to the Host (log level is info and debug)
     * @param message message to log
     */
    static printUtf8(message: string): void {
        const encodedMessage = Serialiser.serialiseResult(Utils.stringsToU8a([message]));
        ext_misc_print_utf8_version_1(encodedMessage);
    }
    /**
     * Displays warning message to the Host
     * @param message 
     */
    static warn(message: string): void {
        Log.baseLog(Log.WARN_LEVEL, message);
    }

    /**
     * Sends error message to the Host
     * @param message 
     */
    static error(message: string): void {
        Log.baseLog(Log.ERROR_LEVEL, message);
    }
}