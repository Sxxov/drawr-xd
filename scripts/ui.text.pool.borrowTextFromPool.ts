import TouchGestures from 'TouchGestures';
import NativeUI from 'NativeUI';
import Reactive from 'Reactive';
import Scene from 'Scene';
import Materials from 'Materials';
import { con } from './util.con';
import type { TSignalData } from './type.TSignalData';

export const borrowTextFromPool = async (
	pool: SceneObject,
	canvas: Canvas,
	content: StringSignal | string,
	options: {
		fontSize?: ScalarSignal | number;
		leading?: ScalarSignal | number;
		isEditable?: boolean;
		isTitle?: boolean;
	} = {},
) => {
	const {
		fontSize = 0.005,
		leading = fontSize,
		isEditable = false,
		isTitle = false,
	} = options;

	const borrowableCanvases = (await pool.findByPath('*')) as Canvas[];
	const borrowedCanvas = borrowableCanvases.find((v) =>
		v.hidden.pinLastValue(),
	);

	if (!borrowedCanvas) return;

	borrowedCanvas.hidden = Reactive.val(false);
	borrowedCanvas.transform.position = canvas.transform.position;
	borrowedCanvas.transform.rotation = canvas.transform.rotation;
	borrowedCanvas.width = canvas.bounds.width;
	borrowedCanvas.height = canvas.bounds.height;

	const borrowedText = (
		await borrowedCanvas.findByPath('*')
	)[0] as PlanarText;

	borrowedText.text =
		typeof content === 'string' ? Reactive.val(content) : content;

	if (isEditable)
		TouchGestures.onTap(borrowedText).subscribe(async () => {
			await NativeUI.enterTextEditMode(borrowedCanvas.name);
		});

	if (isTitle)
		borrowedText.material = await Materials.findFirst('text.title.mat');
	else
		borrowedText.material = await Materials.findFirst('text.paragraph.mat');

	if (typeof fontSize === 'number') borrowedText.fontSize = fontSize;
	else {
		borrowedText.fontSize = fontSize.pinLastValue() as number;
		fontSize
			.monitor({ fireOnInitialValue: true })
			.subscribe(({ newValue }: TSignalData<number>) => {
				borrowedText.fontSize = newValue;
			});
	}

	if (typeof leading === 'number') borrowedText.leading = leading;
	else {
		borrowedText.leading = leading.pinLastValue() as number;
		leading
			.monitor({ fireOnInitialValue: true })
			.subscribe(({ newValue }: TSignalData<number>) => {
				borrowedText.leading = newValue;
			});
	}

	return {
		canvas: borrowedCanvas,
		text: borrowedText,
	};
};
