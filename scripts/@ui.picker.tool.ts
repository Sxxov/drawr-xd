import NativeUI from 'NativeUI';
import Textures from 'Textures';
import { PickedToolIndex } from './picked.data.PickedToolIndex';
import { TexIdToPick } from './picker.tool.TexIdToPick';
import { use } from './provider.use';
import type { TSignalData } from './type.TSignalData';
import { createStaticDialog } from './ui.dialog.createStaticDialog';

void use(async ({ foreground, camera, textpool, focalDistance }) => {
	const hintGenerators: (
		| (() => ReturnType<typeof createStaticDialog>)
		| undefined
	)[] = [
		async () =>
			createStaticDialog(
				foreground,
				textpool,
				camera,
				'Welcome to DRAWR XD!\n\n1. Pick a parameter from\nbelow. (i.e. Hue, Brush\nSize, etc.)\n2. Adjust them using the\nslider on the right.\n3. Tap on your\nsurrounding to draw.\n4. Long press to undo.',
				focalDistance,
			),
		async () =>
			createStaticDialog(
				foreground,
				textpool,
				camera,
				'You just selected the\n"saturation" parameter!\n\nAdjust the right slider to\ncontrol the amount\nof colour.',
				focalDistance,
			),
		async () =>
			createStaticDialog(
				foreground,
				textpool,
				camera,
				'You just selected the\n"lightness" parameter!\n\nAdjust the right slider to\ncontrol how much black\nis mixed with the\ncolour.',
				focalDistance,
			),
		async () =>
			createStaticDialog(
				foreground,
				textpool,
				camera,
				'You just selected the\n"brush size" parameter!\n\nAdjust the right slider to\ncontrol the size of\nthe brush.\n\nNote: The smaller the\nbrush, the slower your\nstrokes have to be.',
				focalDistance,
			),
		async () =>
			createStaticDialog(
				foreground,
				textpool,
				camera,
				'You just selected the\n"dialog" parameter!\n\nThis one is special.\n\nAdjust the right slider to\ncontrol the height of the\ndialogs created when\ntapping.',
				focalDistance,
			),
	];

	const texAndPicks = await Promise.all(
		Object.entries(TexIdToPick).map(
			async ([texId, pick]) =>
				[
					(await Textures.findFirst(texId))! as ImageTexture,
					pick,
				] as const,
		),
	);

	await NativeUI.picker.configure({
		selectedIndex: 0,
		items: texAndPicks.map(([tex]) => ({
			// eslint-disable-next-line @typescript-eslint/naming-convention
			image_texture: tex,
		})),
	});

	NativeUI.picker.visible = true;

	const unpickQueue: (() => Promise<void>)[] = [];
	const unhintQueue: (() => Promise<void>)[] = [];
	NativeUI.picker.selectedIndex
		.monitor({ fireOnInitialValue: true })
		.subscribe(async ({ newValue }: TSignalData<number>) => {
			if (newValue < 0 || newValue >= texAndPicks.length) return;

			const [, setPickedToolIndex] = PickedToolIndex;
			const [, pick] = texAndPicks[newValue]!;

			while (unpickQueue.length > 0) void unpickQueue.shift()!();
			while (unhintQueue.length > 0) void unhintQueue.shift()!();

			setPickedToolIndex(newValue);

			const hintGenerator = hintGenerators[newValue];
			if (hintGenerator) {
				const hint = await hintGenerator();
				unhintQueue.push(async () => hint.close());
				hintGenerators[newValue] = undefined;
			}

			const unpick = await pick();
			unpickQueue.push(unpick);
		});
});
