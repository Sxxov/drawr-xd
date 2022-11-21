import Scene from 'Scene';
import { objectFromEntries } from './util.objectFromEntries';

const cache = new Map<string, SceneObjectBase>();

const resolveOrProvide = async <T extends SceneObjectBase = SceneObjectBase>(
	path: string,
): Promise<T> => {
	let value = cache.get(path);

	if (!value) {
		value = (await Scene.root.findByPath(path, { limit: 1 }))[0]!;
		cache.set(path, value);
	}

	return value as T;
};

export const provideFromCache = () =>
	objectFromEntries(Array.from(cache.entries())) as Partial<TProvided>;

export const provide = async () => ({
	device: await resolveOrProvide<SceneObject>('Device'),
	camera: await resolveOrProvide<Camera>('Device/Camera'),
	background: await resolveOrProvide<SceneObject>('Device/@background'),
	foreground: await resolveOrProvide<SceneObject>('Device/@foreground'),
	focalDistance: await resolveOrProvide<SceneObject>(
		'Device/Camera/Focal Distance',
	),
	textpool: await resolveOrProvide<SceneObject>('Device/@textpool'),
	mspaintTop: await resolveOrProvide<PlanarObject>(
		'Device/Camera/Focal Distance/@mspaint/@top',
	),
	mspaintBtm: await resolveOrProvide<PlanarObject>(
		'Device/Camera/Focal Distance/@mspaint/@btm',
	),
});

export type TProvided = Awaited<ReturnType<typeof provide>>;
