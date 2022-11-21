import Animation from 'Animation';
import NativeUI from 'NativeUI';
import type { TSliderType } from './ui.slider.TSliderType';

export const configureSliderForHue = async () => {
	await NativeUI.slider.configure({
		type: 'COLOR' as TSliderType,
		colorSampler: Animation.samplers.HSVA([
			Animation.samplers.linear([0, 1, 1, 1], [1, 1, 1, 1]),
		]),
	});
};
