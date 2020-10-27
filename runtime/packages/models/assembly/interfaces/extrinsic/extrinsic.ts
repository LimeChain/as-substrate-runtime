import { Codec } from "as-scale-codec";

export interface IExtrinsic extends Codec{
    /**
     * @description Get Type ID of the Extrinsic
     */
    getTypeId(): i32;
}