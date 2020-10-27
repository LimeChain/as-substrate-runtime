import { Codec } from 'as-scale-codec';
import { DigestItem } from '../digest-items';

/**
 * Header interface
 */
export interface IHeader extends Codec{
    /**
     * @description Get parent hash of the Header
     */
    getParentHash(): Codec;
    /**
     * @description Get extrinsicsRoot property of the Header
     */
    getExtrinsicsRoot(): Codec;
    /**
     * @description Get Block's number
     */
    getNumber(): Codec;
    /**
     * @description Get the state root of the Header
     */
    getStateRoot(): Codec;
    /**
     * @description Get the array of digests of the Header
     */
    getDigests(): DigestItem[];
}