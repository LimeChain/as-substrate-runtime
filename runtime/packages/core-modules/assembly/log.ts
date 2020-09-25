import { Serialiser, Utils } from '@as-substrate/core-utils';
import { ext_logging_log_version_1 } from './env';

export class Log {
    public static readonly LOG_TARGET: string = "runtime";
    public static readonly ERROR_LEVEL: i32 = 0;
    public static readonly WARN_LEVEL: i32 = 1;
    public static readonly INFO_LEVEL: i32 = 2;
    public static readonly DEBUG_LEVEL: i32 = 3;
    /**
     * Base function for logging
     * @param logLevel 
     * @param message 
     */
    static _baseLog(logLevel: i32, message: string): void {
        const messageU8a: u8[] = Utils.stringsToBytes([message], false);
        const logTarget = Serialiser.serialiseResult(Utils.stringsToBytes([Log.LOG_TARGET], false));
        const encodedMessage = Serialiser.serialiseResult(messageU8a);
        ext_logging_log_version_1(logLevel, logTarget, encodedMessage);
    }

    /**
     * Displays info message to the Host
     * @param message message to log
     */
    static info(message: string): void {
        this._baseLog(this.INFO_LEVEL, message);
    }
    /**
     * Displays warning message to the Host
     * @param message 
     */
    static warn(message: string): void {
        this._baseLog(Log.WARN_LEVEL, message);
    }

    /**
     * Sends error message to the Host
     * @param message 
     */
    static error(message: string): void {
        this._baseLog(Log.ERROR_LEVEL, message);
    }

    /**
     * Displays debug message to the Host
     * @param message 
     */
    static debug(message: string): void {
        this._baseLog(Log.DEBUG_LEVEL, message);
    }
}