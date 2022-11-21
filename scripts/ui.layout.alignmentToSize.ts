import Reactive from 'Reactive';
import { EAlignment } from './ui.layout.EAlignment';
import type { TPointAlignment } from './ui.layout.TPointAlignment';

export const alignmentToSize = (
	[alignmentX, alignmentY]: TPointAlignment,
	[selfWidth, selfHeight]: [width: ScalarSignal, height: ScalarSignal],
	[canvasWidth, canvasHeight]: [width: ScalarSignal, height: ScalarSignal],
): [width: ScalarSignal, height: ScalarSignal] => [
	(() => {
		switch (alignmentX) {
			case EAlignment.SPAN:
				return canvasWidth;
			case EAlignment.START:
			case EAlignment.CENTRE:
			case EAlignment.END:
				return alignmentY === EAlignment.SPAN
					? canvasHeight.mul(selfWidth.div(selfHeight))
					: selfWidth;
			default:
				return Reactive.val(NaN);
		}
	})(),
	(() => {
		switch (alignmentY) {
			case EAlignment.SPAN:
				return canvasHeight;
			case EAlignment.START:
			case EAlignment.CENTRE:
			case EAlignment.END:
				return alignmentX === EAlignment.SPAN
					? canvasWidth.mul(selfHeight.div(selfWidth))
					: selfHeight;
			default:
				return Reactive.val(NaN);
		}
	})(),
];
