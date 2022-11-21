export const degToRad = <T extends number | ScalarSignal>(deg: T): T =>
	(typeof deg === 'number'
		? (deg * Math.PI) / 180
		: deg.mul(Math.PI).div(180)) as T;
