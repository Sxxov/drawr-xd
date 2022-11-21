import Reactive from 'Reactive';
import Scene from 'Scene';
import TouchGestures from 'TouchGestures';
import { screenRelativeToPlanarPos } from './convert.screenRelativeToPlanarPos';
import { createSceneObject } from './create.createSceneObject';
import { PickedDialogHeight } from './picked.data.PickedDialogHeight';
import { PickedToolIndex } from './picked.data.PickedToolIndex';
import { TexIdToPick } from './picker.tool.TexIdToPick';
import { use } from './provider.use';
import { createDialog } from './ui.dialog.createDialog';

const DialogContents = [
	'Just Monika.',
	'Hello World.',
	'This person is a trap.',
	'Nothing to see here.',
	'You are not supposed\nto be here.',
	'Your mom',
	'Daddy issues',
	"You're cool, I like you.",
	'Mamamia.',
	'What is love?',
	'Never gonna give you up.',
	'Is this thing working?',
	'Hello?',
	'If you see this,\nyou are doomed.',
	'Wake up.',
	'I am watching you.',
	'There is no escape.',
	'It is too late.',
	'You are already dead.',
	'Can you hear them?',
	'Hot stuff.',
	'Hey.',
	'Leave.',
	'Is there really\nnothing better for you\nto do?',
] as const;

const randomisedDialogContents = [...DialogContents].sort(
	() => Math.random() - 0.5,
);
let i = 0;
const dynamicDialogs: SceneObject[] = [];

void use(async ({ foreground, textpool, camera, focalDistance }) => {
	const texIds = Object.keys(TexIdToPick) as (keyof typeof TexIdToPick)[];
	const dialogToolIndices = texIds
		.map((texId, i) => (texId === 'ic.dialog.png' ? i : false))
		.filter((v) => v !== false) as number[];

	const onDown = async ({ location }: TapGesture) => {
		const [toolIndex] = PickedToolIndex;
		const isDialogToolPicked = dialogToolIndices.includes(
			toolIndex.pinLastValue(),
		);

		if (!isDialogToolPicked) return;

		const [dialogHeight] = PickedDialogHeight;

		const z = Reactive.val(-0.1);
		const [x, y] = screenRelativeToPlanarPos(
			location,
			camera,
			z.add(camera.focalPlane.distance.mul(z.sign())),
		);
		const measurerSurface = await createSceneObject({
			name: `@dialog.${dynamicDialogs.length}.measurerSurface`,
		});
		measurerSurface.transform.position =
			focalDistance.worldTransform.position;
		measurerSurface.transform.rotation =
			focalDistance.worldTransform.rotation;
		await foreground.addChild(measurerSurface);
		const measurer = await createSceneObject({
			name: `@dialog.${dynamicDialogs.length}.measurer`,
		});
		[measurer.transform.x, measurer.transform.y, measurer.transform.z] = [
			x,
			y,
			z,
		];
		await measurerSurface.addChild(measurer);
		const measuredPos = measurer.worldTransform.position;
		const measuredRot = measurer.worldTransform.rotation;

		await Scene.destroy(measurerSurface);

		const dialog = await createDialog(
			foreground,
			textpool,
			camera,
			Reactive.val(
				randomisedDialogContents[
					(i = (i + 1) % randomisedDialogContents.length)
				]!,
			),
			{
				// position,
				// rotation: Reactive.quaternionFromEuler(
				// 	radToDeg(Reactive.atan2(position.z, position.y)),
				// 	radToDeg(Reactive.atan2(position.z, position.x)),
				// 	0,
				// ),
				// rotation,
				// rotation: Reactive.quaternionFromEuler(
				// 	look.x,
				// 	look.y.add(degToRad(180)),
				// 	look.z,
				// ),
				// rotation: look,
				padding: [0, dialogHeight.pinLastValue() || 0],
				// position: focalDistance.worldTransform.position,
				// rotation: focalDistance.worldTransform.rotation,
				position: measuredPos.pinLastValue(),
				rotation: measuredRot.pinLastValue(),
			},
		);
		dynamicDialogs.push(dialog);
	};

	TouchGestures.onTap({ normalizeCoordinates: true }).subscribe(onDown);
	// TouchGestures.onLongPress({ normalizeCoordinates: true }).subscribe(onDown);
	TouchGestures.onPan({ normalizeCoordinates: true }).subscribe(onDown);
});
