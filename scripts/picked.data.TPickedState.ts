export type TPickedState<
	T extends
		| ScalarSignal
		| BoolSignal
		| HsvaSignal
		| RgbaSignal
		| Vec2Signal
		| Vec4Signal
		| PointSignal
		| StringSignal
		| TransformSignal
		| QuaternionSignal,
> = [data: T, set: (picked: ReturnType<T['pinLastValue']>) => void];
