/*
	eslint-disable
		@typescript-eslint/no-unsafe-return,
		@typescript-eslint/no-unsafe-assignment
*/
export const objectFromEntries = <
	T extends [key: string | number | symbol, value: any][],
>(
	entries: T,
): Record<T[number][0], T[number][1]> =>
	entries.reduce<any>((obj, [k, v]) => {
		obj[k] = v;

		return obj;
	}, {});
/* eslint-enable */
