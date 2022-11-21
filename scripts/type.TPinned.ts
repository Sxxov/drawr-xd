export type TPinned<T extends { pinLastValue(): any }> = ReturnType<
	T['pinLastValue']
>;
