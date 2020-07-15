export namespace Constants {

    /**
     * U8 array with one Zero byte
     */
    export const EMPTY_BYTE_ARRAY:u8[] = [0]; 

    /**
     * Length of the bytes of a signature
     */
    export const SIGNATURE_LENGTH = 64;

    /**
     * Length of the InherentIdentifier in InherentData
     */
    export const INHERENT_IDENTIFIER_LENGTH = 8;

    /**
     * Number of bytes for the Consensus Engine IDs
     */
    export const CONSENSUS_ENGINE_ID_LENGTH = 4;
}