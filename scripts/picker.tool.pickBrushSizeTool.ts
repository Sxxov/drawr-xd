import NativeUI from 'NativeUI';
import Reactive from 'Reactive';
import { PickedBrushSize } from './picked.data.PickedBrushSize';
import type { TTool } from './picker.tool.TTool';
import type { TSignalData } from './type.TSignalData';

const MIN = 0.01;
const MAX = 0.2;

const [brushSize, setPickedBrushSize] = PickedBrushSize;
setPickedBrushSize(0.5 * (MAX - MIN) + MIN);

export const pickBrushSizeTool: TTool = async () => {
	await NativeUI.slider.configure({
		type: 'SCALE',
	});

	NativeUI.slider.value = brushSize
		.sub(MIN)
		.mul(1 / (MAX - MIN))
		.pin();
	NativeUI.slider.visible = true;

	const subscription = NativeUI.slider.value
		.monitor({ fireOnInitialValue: true })
		.subscribe(({ newValue }: TSignalData<number>) => {
			setPickedBrushSize(Math.max(newValue, 0) * (MAX - MIN) + MIN);
		});

	return async () => {
		subscription.unsubscribe();
	};
};
