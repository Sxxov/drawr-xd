import { create } from './create.create';

export const createSpotLightSource = async (
	initialState?: Partial<SpotLightSource>,
) => create('SpotLightSource', initialState);
