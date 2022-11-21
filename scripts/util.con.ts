import Diagnostics from 'Diagnostics';
import type { TSignalData } from './type.TSignalData';
import { stringify } from './util.stringify';

export const con = {
	log(...messages: any[]) {
		Diagnostics.log(
			messages.reduce<string>(
				(prev, message) =>
					`${prev} ${
						typeof message === 'string'
							? message
							: stringify(message)
					}`,
				'',
			),
		);
	},
	watch(
		tag: string,
		signal:
			| BoolSignal
			| HsvaSignal
			| RgbaSignal
			| Vec2Signal
			| Vec4Signal
			| ColorSignal
			| PointSignal
			| ScalarSignal
			| StringSignal
			| VectorSignal
			| TransformSignal
			| QuaternionSignal,
	) {
		if ('monitor' in signal) {
			Diagnostics.watch(tag, signal);
			signal
				.monitor({ fireOnInitialValue: true })
				.subscribe(({ newValue }: TSignalData<any>) => {
					con.log(tag, newValue);
				});
		} else if ('x' in signal && 'y' in signal) {
			let [x, y, z] = [NaN, NaN, NaN];

			signal.x
				.monitor({
					fireOnInitialValue: true,
				})
				.subscribe(({ oldValue, newValue }: TSignalData<number>) => {
					if (newValue === oldValue) return;

					x = newValue;

					if (Number.isNaN(y) || ('z' in signal && Number.isNaN(z)))
						return;

					con.log(tag, { x, y, ...('z' in signal ? { z } : {}) });
				});
			signal.y
				.monitor({
					fireOnInitialValue: true,
				})
				.subscribe(({ oldValue, newValue }: TSignalData<number>) => {
					if (newValue === oldValue) return;

					y = newValue;

					if (Number.isNaN(x) || ('z' in signal && Number.isNaN(z)))
						return;

					con.log(tag, { x, y, ...('z' in signal ? { z } : {}) });
				});
			if ('z' in signal)
				signal.z
					.monitor({
						fireOnInitialValue: true,
					})
					.subscribe(
						({ oldValue, newValue }: TSignalData<number>) => {
							if (newValue === oldValue) return;

							z = newValue;

							if (Number.isNaN(x) || Number.isNaN(y)) return;

							con.log(tag, { x, y, z });
						},
					);
		} else throw new Error('Unimplemented watch');
	},
} as const;
