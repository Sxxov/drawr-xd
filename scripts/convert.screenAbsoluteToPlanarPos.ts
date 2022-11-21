import Reactive from 'Reactive';
import { screenRelativeToPlanarPos } from './convert.screenRelativeToPlanarPos';

export const screenAbsoluteToPlanarPos = (
	screenPos: Vec2Signal | Point2D,
	camera: Camera,
	planarWorldZ: ScalarSignal | number,
) =>
	screenRelativeToPlanarPos(
		Reactive.pack2(
			(typeof screenPos.x === 'number'
				? Reactive.val(screenPos.x)
				: screenPos.x
			).div(camera.focalPlane.width),
			(typeof screenPos.y === 'number'
				? Reactive.val(screenPos.y)
				: screenPos.y
			).div(camera.focalPlane.height),
		),
		camera,
		planarWorldZ,
	);
