import Scene from 'Scene';
import type { TCreatableClassName } from './type.TCreatableClassName';

type TCreator<
	ClassName extends TCreatableClassName,
	T extends SceneObjectBase,
> = (className: ClassName, initialState?: Partial<T>) => Promise<T>;

export const create: TCreator<'AmbientLightSource', AmbientLightSource> &
	TCreator<'Canvas', Canvas> &
	TCreator<'DirectionalLightSource', DirectionalLightSource> &
	TCreator<'ParticleSystem', ParticleSystem> &
	TCreator<'PlanarImage', PlanarImage> &
	TCreator<'PlanarText', PlanarText> &
	TCreator<'Plane', Plane> &
	TCreator<'PointLightSource', PointLightSource> &
	TCreator<'SceneObject', SceneObject> &
	TCreator<'SpotLightSource', SpotLightSource> = Scene.create.bind(
	Scene,
) as TCreator<any, any>;
