import { create } from './create.create';

export const createDirectionalLightSource = async (
	initialState?: Partial<DirectionalLightSource>,
) => create('DirectionalLightSource', initialState);
