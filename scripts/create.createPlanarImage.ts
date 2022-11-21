import { create } from './create.create';

export const createPlanarImage = async (initialState?: Partial<PlanarImage>) =>
	create('PlanarImage', initialState);
