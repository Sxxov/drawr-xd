import { create } from './create.create';

export const createCanvas = async (initialState?: Partial<Canvas>) =>
	create('Canvas', initialState);
