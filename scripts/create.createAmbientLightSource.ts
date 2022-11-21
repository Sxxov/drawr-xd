import { create } from './create.create';

export const createAmbientLightSource = async (
	initialState?: Partial<AmbientLightSource>,
) => create('AmbientLightSource', initialState);
