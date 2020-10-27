import { Codec } from 'as-scale-codec';
import { IHeader } from './header';
import { IExtrinsic } from './extrinsic/extrinsic';

export interface IBlock extends Codec{
    /**
     * @description Get Header object of the Block
     */
    getHeader(): IHeader;
    /**
     * @description Get body (list of extrinsics) of the Block
     */
    getExtrinsics(): IExtrinsic[];
}