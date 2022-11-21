import { create } from './create.create';

export const createPlanarText = async (initialState?: Partial<PlanarText>) =>
	create('PlanarText', initialState);
