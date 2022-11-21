import Materials from 'Materials';
import Textures from 'Textures';
import Reactive from 'Reactive';
import Time from 'Time';
import Scene from 'Scene';
import TouchGestures from 'TouchGestures';
import { screenRelativeToPlanarPos } from './convert.screenRelativeToPlanarPos';
import { createParticleSystem } from './create.createParticleSystem';
import { createSceneObject } from './create.createSceneObject';
import { PickedBrushSize } from './picked.data.PickedBrushSize';
import { PickedHue } from './picked.data.PickedHue';
import { PickedLightness } from './picked.data.PickedLightness';
import { PickedSaturation } from './picked.data.PickedSaturation';
import { PickedToolIndex } from './picked.data.PickedToolIndex';
import { TexIdToPick } from './picker.tool.TexIdToPick';
import { use } from './provider.use';
import type { TSignalData } from './type.TSignalData';
import { PickedEraserSize } from './picked.data.PickedEraserSize';

const BIRTHRATE = 200;

const strokes: ParticleSystem[] = [];
const hslHashToMat = new Map<string, DefaultMaterial>();
let eraserMat: DefaultMaterial | undefined;

export const undo = async () => {
	if (strokes.length > 0) await Scene.destroy(strokes.pop()!);
};

const hashifyHsl = (
	hue: ScalarSignal,
	saturation: ScalarSignal,
	lightness: ScalarSignal,
) =>
	`h${(hue.pinLastValue() as number).toFixed(4)}.s${(
		saturation.pinLastValue() as number
	).toFixed(4)}.l${(lightness.pinLastValue() as number).toFixed(4)}`;

void use(async ({ camera, focalDistance, background }) => {
	const surface = await createSceneObject({
		name: '!stroke.surface',
	});

	surface.transform.position = focalDistance.worldTransform.position;
	surface.transform.rotation = focalDistance.worldTransform.rotation;

	await background.addChild(surface);

	const texIds = Object.keys(TexIdToPick) as (keyof typeof TexIdToPick)[];
	const brushToolIndices = texIds
		.map((texId, i) =>
			texId === 'ic.brushSize.png'
			|| texId === 'ic.hue.png'
			|| texId === 'ic.lightness.png'
			|| texId === 'ic.saturation.png'
				? i
				: false,
		)
		.filter((v) => v !== false) as number[];
	const eraserToolIndices = texIds
		// @ts-expect-error this is currently commented out in the other file
		// how the hell do you impl an eraser material?
		.map((texId, i) => (texId === 'ic.eraserSize.png' ? i : false))
		.filter((v) => v !== false) as number[];
	const brushTex = (await Textures.findFirst(
		'circle.32.png',
	)!) as ImageTexture;
	const onDown = async ({
		state,
		location,
	}: PanGesture | TapGesture | LongPressGesture) => {
		type TGestureState = 'BEGAN' | 'CHANGED' | 'ENDED';

		const [toolIndex] = PickedToolIndex;
		const isBrushToolPicked = brushToolIndices.includes(
			toolIndex.pinLastValue(),
		);
		const isEraserToolPicked = eraserToolIndices.includes(
			toolIndex.pinLastValue(),
		);

		let mat: DefaultMaterial;
		const [brushSize] = isEraserToolPicked
			? PickedEraserSize
			: PickedBrushSize;

		if (isBrushToolPicked) {
			const [hue] = PickedHue;
			const [saturation] = PickedSaturation;
			const [lightness] = PickedLightness;

			const hslHash = hashifyHsl(hue, saturation, lightness);
			mat = hslHashToMat.get(hslHash)!;

			if (!mat) {
				mat = (await Materials.create('DefaultMaterial', {
					name: `!stroke.${hslHash}.mat`,
					diffuseColorFactor: Reactive.HSVA(
						hue.pin(),
						saturation.pin(),
						lightness.pin(),
						Reactive.val(1),
					).toRGBA(),
					diffuse: brushTex,
					blendMode: Materials.BlendMode.ALPHA,
					alphaTestEnabled: Reactive.val(true),
				} as Partial<DefaultMaterial>)) as DefaultMaterial;

				hslHashToMat.set(hslHash, mat);
			}
		} else if (isEraserToolPicked) {
			if (!eraserMat) {
				eraserMat = (await Materials.create('DefaultMaterial', {
					name: '!stroke.eraser.mat',
					diffuseColorFactor: Reactive.RGBA(
						Reactive.val(0),
						Reactive.val(0),
						Reactive.val(0),
						Reactive.val(1),
					),
					diffuse: brushTex,
					blendMode: Materials.BlendMode.ALPHA,
					alphaTestEnabled: Reactive.val(true),
				} as Partial<DefaultMaterial>)) as DefaultMaterial;
			}

			mat = eraserMat;
		} else return;

		const stroke = await createParticleSystem({
			name: `@stroke.${strokes.length}`,
			material: mat,
			birthrate: Reactive.val(BIRTHRATE),
			lifetimeSeconds: Reactive.val(99999),
			scale: brushSize.pin(),
			initialVelocityMagnitude: Reactive.val(0),
			sprayAngle: Reactive.pack3(0, 0, 0),
			sprayAngleDelta: Reactive.pack3(0, 0, 0),
			acceleration: Reactive.vector(0, 0, 0),
			worldSpace: Reactive.val(true),
		});

		const z = Reactive.val(-1);
		const [x, y] = screenRelativeToPlanarPos(
			location,
			camera,
			z.add(camera.focalPlane.distance.mul(z.sign())),
		);

		[stroke.transform.x, stroke.transform.y, stroke.transform.z] = [
			x,
			y,
			z,
		];

		await surface.addChild(stroke);

		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		state
			.monitor({ fireOnInitialValue: true })
			.subscribe(
				async ({ oldValue, newValue }: TSignalData<TGestureState>) => {
					if (newValue === 'ENDED')
						if (oldValue) stroke.birthrate = Reactive.val(0);
						else
							Time.setTimeout(() => {
								stroke.birthrate = Reactive.val(0);
							}, 100);
				},
			);

		// const drawPlaneDist = camera.focalPlane.distance.add(
		// 	stroke.transform.z.abs(),
		// );
		// const focalHeightRad = Reactive.atan(
		// 	camera.focalPlane.height.div(2).div(camera.focalPlane.distance),
		// );
		// const focalWidthRad = Reactive.atan(
		// 	camera.focalPlane.width.div(2).div(camera.focalPlane.distance),
		// );
		// // const drawPlaneHeightZ = drawPlaneDist.mul(Reactive.cos(focalHeightDeg));
		// // const drawPlaneHeightY = drawPlaneDist.mul(Reactive.sin(focalHeightDeg));
		// const drawPlaneHeight = drawPlaneDist
		// 	.mul(Reactive.sin(focalHeightRad))
		// 	.mul(2);
		// // const drawPlaneWidthZ = drawPlaneDist.mul(Reactive.cos(focalWidthDeg));
		// // const drawPlaneWidthY = drawPlaneDist.mul(Reactive.sin(focalWidthDeg));
		// const drawPlaneWidth = drawPlaneDist
		// 	.mul(Reactive.sin(focalWidthRad))
		// 	.mul(2);

		// [stroke.transform.x, stroke.transform.y] = [
		// 	(typeof location.x === 'number'
		// 		? Reactive.val(location.x)
		// 		: location.x
		// 	)
		// 		.mul(drawPlaneWidth)
		// 		.sub(drawPlaneWidth.div(2))
		// 		.mul(stroke.transform.z)
		// 		.mul(-1),
		// 	(typeof location.y === 'number'
		// 		? Reactive.val(location.y)
		// 		: location.y
		// 	)
		// 		.mul(drawPlaneHeight)
		// 		.sub(drawPlaneHeight.div(2))
		// 		.mul(stroke.transform.z),
		// ];

		strokes.push(stroke);
	};

	TouchGestures.onTap({ normalizeCoordinates: true }).subscribe(onDown);
	// TouchGestures.onLongPress({ normalizeCoordinates: true }).subscribe(onDown);
	TouchGestures.onPan({ normalizeCoordinates: true }).subscribe(onDown);
});
