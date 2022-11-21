import { createDialog } from './ui.dialog.createDialog';

export const createStaticDialog = async (
	parent: SceneObject,
	textpool: SceneObject,
	camera: Camera,
	content: StringSignal | string,
	focalDistance: FocalDistance,
	options: Parameters<typeof createDialog>[4] = {},
) =>
	createDialog(parent, textpool, camera, content, {
		position: focalDistance.worldTransform.position,
		rotation: focalDistance.worldTransform.rotation,
		...options,
	});
