import { create } from './create.create';

export const createParticleSystem = async (
	initialState?: Partial<ParticleSystem>,
) => create('ParticleSystem', initialState);
