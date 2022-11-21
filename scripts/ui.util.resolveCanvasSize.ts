export const resolveCanvasSize = (
	canvas: Canvas,
): [width: ScalarSignal, height: ScalarSignal] => [
	canvas.boundingBox.max.x.sub(canvas.boundingBox.min.x),
	canvas.boundingBox.max.y.sub(canvas.boundingBox.min.y),
];
