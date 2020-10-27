import { Codec } from "as-scale-codec";
import { IExtrinsic } from "./extrinsic";

export interface IInherent extends IExtrinsic{
    /**
     * @description Get call index of the Inherent object
     */
    getCallIndex(): u8[];
    /**
     * @description Get Module prefix of the Inherent object
     */
    getPrefix(): u8;
    /**
     * @description Get API version of the Inherent object
     */
    getVersion(): u8;
    /**
     * @description Get the argument value of the Inherent object
     */
    getArgument(): Codec;
}