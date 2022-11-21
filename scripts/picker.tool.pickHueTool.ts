import NativeUI from 'NativeUI';
import Scene from 'Scene';
import Animation from 'Animation';
import Reactive from 'Reactive';
import { PickedHue } from './picked.data.PickedHue';
import type { TTool } from './picker.tool.TTool';
import type { TSignalData } from './type.TSignalData';
import { PickedSaturation } from './picked.data.PickedSaturation';
import { PickedLightness } from './picked.data.PickedLightness';
import { coalesceNullish } from './util.coalesceNullish';
import { con } from './util.con';

const MIN = 0;
const MAX = 1;

const [hue, setPickedHue] = PickedHue;
// const [saturation] = PickedSaturation;
// const [lightness] = PickedLightness;
setPickedHue(MIN);

export const pickHueTool: TTool = async () => {
	await NativeUI.slider.configure({
		// type: 'COLOR',
		// colorSampler: Animation.samplers.HSVA(
		// 	Animation.samplers.linear(
		// 		[
		// 			1,
		// 			coalesceNullish(saturation.pinLastValue() as number, 1),
		// 			coalesceNullish(lightness.pinLastValue() as number, 1),
		// 			1,
		// 		],
		// 		[
		// 			0,
		// 			coalesceNullish(saturation.pinLastValue() as number, 1),
		// 			coalesceNullish(lightness.pinLastValue() as number, 1),
		// 			1,
		// 		],
		// 	) as ArrayOfScalarSamplers,
		// ),
		// colorSampler: Animation.samplers.HSVA(
		// 	Animation.samplers.linear(
		// 		[0, 0, 0, 1],
		// 		[1, 0, 0, 1],
		// 	) as ArrayOfScalarSamplers,
		// ),
	});

	NativeUI.slider.value = hue
		.sub(MIN)
		.mul(1 / (MAX - MIN))
		.pin();
	NativeUI.slider.visible = true;

	const subscription = NativeUI.slider.value
		.monitor({ fireOnInitialValue: true })
		.subscribe(({ newValue }: TSignalData<number>) => {
			setPickedHue(Math.max(newValue, 0) * (MAX - MIN) + MIN);
		});

	return async () => {
		subscription.unsubscribe();
	};
};
