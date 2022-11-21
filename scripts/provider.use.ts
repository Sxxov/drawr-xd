import { provide } from './provider.provide';

export const use = async (
	fn: (ctx: Awaited<ReturnType<typeof provide>>) => Promise<void> | void,
) => {
	await fn(await provide());
};
