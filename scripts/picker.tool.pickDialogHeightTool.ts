import NativeUI from 'NativeUI';
import Reactive from 'Reactive';
import { PickedDialogHeight } from './picked.data.PickedDialogHeight';
import type { TTool } from './picker.tool.TTool';
import type { TSignalData } from './type.TSignalData';

const MIN = 0;
const MAX = 0.2;

const [dialogHeight, setPickedDialogHeight] = PickedDialogHeight;
setPickedDialogHeight(MIN);

export const pickDialogHeightTool: TTool = async () => {
	await NativeUI.slider.configure({
		type: 'SCALE',
	});

	NativeUI.slider.value = dialogHeight
		.sub(MIN)
		.mul(1 / (MAX - MIN))
		.pin();
	NativeUI.slider.visible = true;

	const subscription = NativeUI.slider.value
		.monitor({ fireOnInitialValue: true })
		.subscribe(({ newValue }: TSignalData<number>) => {
			setPickedDialogHeight(Math.max(newValue, 0) * (MAX - MIN) + MIN);
		});

	return async () => {
		subscription.unsubscribe();
	};
};
