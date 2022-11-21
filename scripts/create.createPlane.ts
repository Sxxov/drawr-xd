import { create } from './create.create';

export const createPlane = async (initialState?: Partial<Plane>) =>
	create('Plane', initialState);
