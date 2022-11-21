import { create } from './create.create';

export const createPointLightSource = async (
	initialState?: Partial<PointLightSource>,
) => create('PointLightSource', initialState);
