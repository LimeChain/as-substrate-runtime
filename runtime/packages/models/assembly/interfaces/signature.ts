import { Codec } from "as-scale-codec";

export interface ISignature extends Codec{
    getValue(): u8[];
}