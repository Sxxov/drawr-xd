import Reactive from 'Reactive';

export const returnTextToPool = async (borrowedText: PlanarText) => {
	const borrowedCanvas = (await borrowedText.getParent()) as Canvas;

	borrowedCanvas.hidden = Reactive.val(true);

	// canvas transform & bounds are currently left as is to leak
	// but it's probably not a big deal
};
