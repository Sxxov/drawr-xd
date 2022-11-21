import { create } from './create.create';

export const createSceneObject = async (initialState?: Partial<SceneObject>) =>
	create('SceneObject', initialState);
