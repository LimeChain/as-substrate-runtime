import { Codec } from "as-scale-codec";
import { IDigestItem } from "./digest-item";

export interface IBaseConsensusItem extends IDigestItem{
    unwrap(): Codec;
}