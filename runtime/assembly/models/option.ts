
/**
 * Class representing an optional value (T or null)
 */
export class Option<T> {

    public value: T | null

    constructor(value: T | null) {
        this.value = value;
    }

    /**
     * Checks whether the `Option` contains a value.
     *
     * @returns True if the `Option` has some value.
     */
    isSome(): bool {
        return this.value != null;
    }

    /**
	 * Unwraps the `Option`, returning the inner value (or `null` if there was none).
	 *
	 * @returns The inner value, or `null` if there was none.
	 */
    unwrap(): T | null {
        return this.value;
    }
    
}