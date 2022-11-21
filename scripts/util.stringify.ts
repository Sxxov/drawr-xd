/*
    eslint-disable
        @typescript-eslint/no-unsafe-assignment,  
*/
const allKeysOf = (
	o: Record<any, any>,
	depth = 3,
	shouldExcludeNativeObject = true,
) => {
	const result: string[] = [];

	for (
		let i = 0, curr = o;
		i < depth
		&& curr
		// eslint-disable-next-line no-unmodified-loop-condition
		&& (!shouldExcludeNativeObject || curr !== Object.prototype);
		++i, curr = Object.getPrototypeOf(curr)
	)
		result.push(...Object.getOwnPropertyNames(curr));

	return result;
};
/* eslint-enable */

export const stringify = (() => {
	const seen: any[] = [];

	return (value: any): string => {
		if (typeof value === 'object' && value !== null) {
			if (seen.includes(value))
				return `<circular #${seen.indexOf(value)}>`;

			seen.push(value);

			return Array.isArray(value)
				? `[${value
						.map(
							(v) =>
								`    ${stringify(v).replace(/\n/g, '\n    ')}`,
						)
						.join(',\n')}]`
				: `{\n${allKeysOf(value)
						.map((k) => {
							const desc = Object.getOwnPropertyDescriptor(
								value,
								k,
							);

							return `    ${String(k)}: ${
								desc
									? desc.get
										? `<getter> ${stringify(
												desc.value,
										  ).replace(/\n/g, '\n    ')}`
										: stringify(desc.value).replace(
												/\n/g,
												'\n    ',
										  )
									: (() => {
											try {
												return stringify(
													value[k],
												).replace(/\n/g, '\n    ');
											} catch (err) {
												return `<error accessing value> ${String(
													err,
												)}`;
											}
									  })()
							}`;
						})
						.join(',\n')}\n}`;
		}

		if (typeof value === 'string') return `"${value}"`;

		return String(value);
	};
})();
