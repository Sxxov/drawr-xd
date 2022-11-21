// import Fonts from 'Fonts';
import Reactive from 'Reactive';
import Scene from 'Scene';
import Textures from 'Textures';
import NativeUI from 'NativeUI';
import TouchGestures from 'TouchGestures';
import { degToRad } from './convert.degToRad';
import { screenAbsoluteToPlanarPos } from './convert.screenAbsoluteToPlanarPos';
import { screenRelativeToPlanarPos } from './convert.screenRelativeToPlanarPos';
import { createCanvas } from './create.createCanvas';
import { createPlanarText } from './create.createPlanarText';
import type { TSignalData } from './type.TSignalData';
import { createPanel } from './ui.blocks.createPanel';
import { EAlignment } from './ui.layout.EAlignment';
import { layoutPlanar } from './ui.layout.layoutPlanar';
import { borrowTextFromPool } from './ui.text.pool.borrowTextFromPool';
import { con } from './util.con';
import { returnTextToPool } from './ui.text.pool.returnTextToPool';

const dialogs: Canvas[] = [];

export const createDialog = async (
	parent: SceneObject,
	textpool: SceneObject,
	camera: Camera,
	content: StringSignal | string,
	options: {
		isEditable?: boolean;
		hasButton?: boolean;
		position?: PointSignal;
		rotation?: QuaternionSignal;
		padding?: [x: number, y: number];
	} = {},
) => {
	let hasMounted = false;
	const {
		isEditable = false,
		hasButton = true,
		position = Reactive.pack3(0, 0, 0.4),
		rotation = Reactive.quaternionIdentity(),
		padding = [0, 0],
	} = options;

	if (typeof content === 'string') content = Reactive.val(content);

	// const font = await Fonts.findFirst('sans.ttf')!;

	// const z = (
	// 	typeof offsetZ === 'number' ? Reactive.val(offsetZ) : offsetZ
	// ).add(position.z);
	const [unprojectedX, unprojectedY] = screenRelativeToPlanarPos(
		Reactive.pack2(1, 1),
		camera,
		position.distance(Reactive.vector(0, 0, 0)),
	);
	const [paddingX, paddingY] = padding;
	const canvas = await createCanvas({
		name: `!ui.dialog.${dialogs.length}`,
		mode: Reactive.val(Scene.RenderMode.WORLD_SPACE),
		width: unprojectedX.abs().mul(0.9).add(paddingX),
		height: unprojectedY.abs().mul(0.9).add(paddingY),
	});
	// [canvas.transform.x, canvas.transform.y, canvas.transform.z] = [
	// 	position.x,
	// 	position.y,
	// 	z,
	// ];
	// canvas.transform.z = z;
	canvas.transform.position = position;
	// [
	// 	canvas.transform.rotationX,
	// 	canvas.transform.rotationY,
	// 	canvas.transform.rotationZ,
	// ] = [rotation.x, rotation.y.add(degToRad(180)), rotation.z];
	canvas.transform.rotation = rotation;
	// canvas.transform.rotationY = rotation.y.add(degToRad(180));
	// canvas.transform.rotation = rotation;
	await parent.addChild(canvas);

	// mid
	{
		const tex = (await Textures.findFirst('dialog.mid.png'))!;
		const panel = await createPanel('!dialog.mid', tex);
		layoutPlanar(canvas, tex, panel, {
			alignment: [EAlignment.SPAN, EAlignment.SPAN],
		});
		await canvas.addChild(panel);

		if (isEditable)
			TouchGestures.onTap(panel).subscribe(async () => {
				if (borrowed)
					await NativeUI.enterTextEditMode(borrowed.text.name);
			});
	}

	// btm
	{
		const tex = (await Textures.findFirst('dialog.btm.png'))!;
		const panel = await createPanel('!dialog.btm', tex);
		layoutPlanar(canvas, tex, panel, {
			alignment: [EAlignment.SPAN, EAlignment.END],
		});
		await canvas.addChild(panel);
	}

	// top
	{
		const tex = (await Textures.findFirst('dialog.top.png'))!;
		const panel = await createPanel('!dialog.top', tex);
		layoutPlanar(canvas, tex, panel, {
			alignment: [EAlignment.SPAN, EAlignment.START],
		});
		await canvas.addChild(panel);

		TouchGestures.onTap(panel).subscribe(async () => {
			if (hasMounted) await close();
		});
	}

	// ok
	if (hasButton) {
		const tex = (await Textures.findFirst('dialog.ok.png'))!;
		const panel = await createPanel('!dialog.ok', tex);
		layoutPlanar(canvas, tex, panel, {
			alignment: [EAlignment.CENTRE, EAlignment.END],
			offset: [0, canvas.width.mul(0.06)],
			// scale: [0.00038, 0.00038],
		});
		panel.width = canvas.width.mul(0.425);
		panel.height = panel.width.mul(tex.height.div(tex.width));
		await canvas.addChild(panel);

		TouchGestures.onTap(panel).subscribe(async () => {
			if (hasMounted) await close();
		});
	}

	// text
	const borrowed = await borrowTextFromPool(textpool, canvas, content, {
		fontSize: canvas.width.mul(0.075),
		isEditable,
		isTitle: false,
	});
	if (borrowed) {
		const { canvas: borrowedCanvas, text: borrowedText } = borrowed;
		const heightApproximationSource = Reactive.scalarSignalSource(
			`${canvas.name}.title.heightApproximation`,
		);
		const onChange = ({ newValue }: TSignalData<string>) => {
			heightApproximationSource.set(
				canvas.width.mul(0.075).mul(newValue.split('\n').length),
			);
		};

		onChange({ newValue: content.pinLastValue() as string });

		borrowedText.text.monitor().subscribe(onChange);

		canvas.height = heightApproximationSource.signal
			.add(paddingY)
			.add(canvas.width.mul(hasButton ? 0.45 : 0.3));

		borrowedText.transform.x = canvas.width.mul(0.1);
		borrowedText.transform.y = canvas.width.mul(0.2);

		layoutPlanar(
			borrowedCanvas,
			{
				width: borrowedText.bounds.width,
				height: heightApproximationSource.signal,
			},
			borrowedText,
			{
				alignment: [EAlignment.SPAN, EAlignment.START],
				margin: [
					canvas.width.mul(0.1),
					canvas.width.mul(0.2),
					canvas.width.mul(0.1),
					canvas.width.mul(0.2),
				],
			},
		);

		// borrowedText.verticalAlignment = 'TOP';

		if (isEditable)
			TouchGestures.onTap(canvas).subscribe(async () => {
				await NativeUI.enterTextEditMode(borrowedText.name);
			});
	}

	const hasClosedSource = Reactive.boolSignalSource(
		`${canvas.name}.hasClosed`,
	);
	const close = async () => {
		hasClosedSource.set(true);
		await Scene.destroy(canvas);
		if (borrowed) await returnTextToPool(borrowed.text);
	};

	hasMounted = true;

	dialogs.push(canvas);

	(canvas as any).close = close;
	(canvas as any).hasClosed = hasClosedSource.signal;

	return canvas as Canvas & {
		close: () => Promise<void>;
		hasClosed: BoolSignal;
	};
};
