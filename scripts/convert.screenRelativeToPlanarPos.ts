import Reactive from 'Reactive';

export const screenRelativeToPlanarPos = (
	screenPos: Vec2Signal | Point2D,
	camera: Camera,
	planarWorldZ: ScalarSignal | number,
) => {
	if (typeof planarWorldZ === 'number')
		planarWorldZ = Reactive.val(planarWorldZ);

	const focalHeightRad = Reactive.atan(
		camera.focalPlane.height.div(2).div(camera.focalPlane.distance),
	);
	const focalWidthRad = Reactive.atan(
		camera.focalPlane.width.div(2).div(camera.focalPlane.distance),
	);
	// const drawPlaneHeightZ = drawPlaneDist.mul(Reactive.cos(focalHeightDeg));
	// const drawPlaneHeightY = drawPlaneDist.mul(Reactive.sin(focalHeightDeg));
	const planarHeight = planarWorldZ
		.abs()
		.mul(Reactive.sin(focalHeightRad))
		.mul(2);
	// const drawPlaneWidthZ = drawPlaneDist.mul(Reactive.cos(focalWidthDeg));
	// const drawPlaneWidthY = drawPlaneDist.mul(Reactive.sin(focalWidthDeg));
	const planarWidth = planarWorldZ
		.abs()
		.mul(Reactive.sin(focalWidthRad))
		.mul(2);

	return [
		(typeof screenPos.x === 'number'
			? Reactive.val(screenPos.x)
			: screenPos.x
		)
			.mul(planarWidth)
			.sub(planarWidth.div(2)),
		(typeof screenPos.y === 'number'
			? Reactive.val(screenPos.y)
			: screenPos.y
		)
			.mul(planarHeight)
			.sub(planarHeight.div(2))
			.mul(-1),
	] as const;
};
