import Reactive from 'Reactive';

export const radToDeg = <T extends number | ScalarSignal>(rad: T): T =>
	(typeof rad === 'number'
		? rad * (180 / Math.PI)
		: rad.mul(Reactive.val(180).div(Math.PI))) as T;
