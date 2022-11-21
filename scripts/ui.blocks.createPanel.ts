import Materials from 'Materials';
import Reactive from 'Reactive';
import Scene from 'Scene';
import { createPlanarImage } from './create.createPlanarImage';

const panelNames: string[] = [];
const texIdToMaterial = new Map<string, DefaultMaterial>();

export const createPanel = async (name: string, tex: TextureBase) => {
	if (panelNames.includes(name))
		name = `${name}.${panelNames.reduce<string>(
			(acc, curr) => (curr === acc ? `${acc}.copy` : acc),
			name,
		)}`;

	let mat = texIdToMaterial.get(tex.name);

	if (!mat) {
		mat = (await Materials.create('DefaultMaterial', {
			name: `${name}.mat`,
			diffuseColorFactor: Reactive.RGBA(1, 1, 1, 1),
			diffuse: tex,
			blendMode: Materials.BlendMode.ALPHA,
		} as Partial<DefaultMaterial>)) as DefaultMaterial;
		texIdToMaterial.set(tex.name, mat);

		panelNames.push(name);
	}

	// if (mat.name.replace(/\.mat$/, '') !== name)
	// 	mat = (await Materials.clone(mat, {
	// 		name: `${name}.mat`,
	// 	})) as DefaultMaterial;

	return createPlanarImage({
		name,
		scalingOption: Scene.ScalingOption.FILL,
		material: mat,
	});
};
