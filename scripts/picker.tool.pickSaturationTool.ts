import NativeUI from 'NativeUI';
import Animation from 'Animation';
import Reactive from 'Reactive';
import { PickedSaturation } from './picked.data.PickedSaturation';
import type { TTool } from './picker.tool.TTool';
import type { TSignalData } from './type.TSignalData';
import { PickedHue } from './picked.data.PickedHue';
import { PickedLightness } from './picked.data.PickedLightness';
import { coalesceNullish } from './util.coalesceNullish';

const MIN = 0;
const MAX = 1;

// const [hue] = PickedHue;
const [saturation, setPickedSaturation] = PickedSaturation;
// const [lightness] = PickedLightness;
setPickedSaturation(MAX);

export const pickSaturationTool: TTool = async () => {
	await NativeUI.slider.configure({
		// type: 'COLOR',
		// colorSampler: Animation.samplers.HSVA(
		// 	Animation.samplers.linear(
		// 		[
		// 			coalesceNullish(hue.pinLastValue() as number, 0),
		// 			0,
		// 			coalesceNullish(lightness.pinLastValue() as number, 1),
		// 			1,
		// 		],
		// 		[
		// 			coalesceNullish(hue.pinLastValue() as number, 0),
		// 			1,
		// 			coalesceNullish(lightness.pinLastValue() as number, 1),
		// 			1,
		// 		],
		// 	) as ArrayOfScalarSamplers,
		// ),
	});

	NativeUI.slider.value = saturation
		.sub(MIN)
		.mul(1 / (MAX - MIN))
		.pin();
	NativeUI.slider.visible = true;

	const subscription = NativeUI.slider.value
		.monitor({ fireOnInitialValue: true })
		.subscribe(({ newValue }: TSignalData<number>) => {
			setPickedSaturation(Math.max(newValue, 0) * (MAX - MIN) + MIN);
		});

	return async () => {
		subscription.unsubscribe();
	};
};
