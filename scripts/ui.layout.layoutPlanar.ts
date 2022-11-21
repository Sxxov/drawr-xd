import Reactive from 'Reactive';
import { alignmentToPos } from './ui.layout.alignmentToPos';
import { alignmentToSceneAlignment } from './ui.layout.alignmentToSceneAlignment';
import { alignmentToSize } from './ui.layout.alignmentToSize';
import { EAlignment } from './ui.layout.EAlignment';
import type { TPointAlignment } from './ui.layout.TPointAlignment';

export const layoutPlanar = (
	canvas: Canvas,
	source: { width: ScalarSignal; height: ScalarSignal },
	target: PlanarObject,
	options: {
		alignment?: TPointAlignment;
		margin?: [
			left: ScalarSignal | number,
			top: ScalarSignal | number,
			right: ScalarSignal | number,
			bottom: ScalarSignal | number,
		];
		offset?: [x: ScalarSignal | number, y: ScalarSignal | number];
		scale?: [x: ScalarSignal | number, y: ScalarSignal | number];
	} = {},
) => {
	const { width: srcWidth, height: srcHeight } = source;
	const {
		alignment = [EAlignment.START, EAlignment.START],
		offset: [offsetX, offsetY] = [0, 0],
		margin: [marginLeft, marginTop, marginRight, marginBottom] = [
			0, 0, 0, 0,
		],
		scale: [scaleX, scaleY] = [1, 1],
	} = options;
	const [alignmentX, alignmentY] = alignment;
	const {
		bounds: { width: canvasWidth, height: canvasHeight },
	} = canvas;
	const [width, height] = alignmentToSize(
		alignment,
		[srcWidth.mul(scaleX), srcHeight.mul(scaleY)],
		[
			canvasWidth.sub(marginLeft).sub(marginRight),
			canvasHeight.sub(marginTop).sub(marginBottom),
		],
	);
	const [horizontalAlignment, verticalAlignment] =
		alignmentToSceneAlignment(alignment);
	const [posX, posY] = alignmentToPos(
		alignment,
		[srcWidth.mul(scaleX), srcHeight.mul(scaleY)],
		[
			canvasWidth.sub(marginLeft).sub(marginRight),
			canvasHeight.sub(marginTop).sub(marginBottom),
		],
	);

	target.horizontalAlignment = horizontalAlignment;
	target.verticalAlignment = verticalAlignment;
	// target.horizontalAlignment = 'LEFT';
	// target.verticalAlignment = 'TOP';
	target.width = width;
	target.height = height;
	// target.transform.x = posX.add(marginLeft).add(offsetX);
	// target.transform.y = posY.add(marginTop).add(offsetY);

	switch (alignmentX) {
		case EAlignment.CENTRE:
			target.xCenterOffset = (
				typeof offsetX === 'number' ? Reactive.val(offsetX) : offsetX
			).add(marginLeft);
			break;
		case EAlignment.END:
			target.xEndOffset = (
				typeof offsetX === 'number' ? Reactive.val(offsetX) : offsetX
			).sub(marginRight);
			break;
		case EAlignment.START:
		case EAlignment.SPAN:
		default:
			target.xOffset =
				typeof offsetX === 'number' ? Reactive.val(offsetX) : offsetX;
			break;
	}

	switch (alignmentY) {
		case EAlignment.CENTRE:
			target.yCenterOffset = (
				typeof offsetY === 'number' ? Reactive.val(offsetY) : offsetY
			).add(marginTop);
			break;
		case EAlignment.END:
			target.yEndOffset = (
				typeof offsetY === 'number' ? Reactive.val(offsetY) : offsetY
			).sub(marginBottom);
			break;
		case EAlignment.START:
		case EAlignment.SPAN:
		default:
			target.yOffset =
				typeof offsetY === 'number' ? Reactive.val(offsetY) : offsetY;
			break;
	}

	return target;
};
