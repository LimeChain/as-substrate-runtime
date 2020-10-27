import { Codec } from "as-scale-codec";

export interface IExtrinsicData extends Codec{
    getData(): Map<Codec, Codec>;
}