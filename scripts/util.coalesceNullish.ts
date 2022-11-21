export const coalesceNullish = <T, U>(
	value: T | null | undefined,
	defaultValue: U,
	// eslint-disable-next-line eqeqeq
): T | U => (value == null ? defaultValue : value);
