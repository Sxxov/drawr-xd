import Reactive from 'Reactive';
import { EAlignment } from './ui.layout.EAlignment';
import type { TPointAlignment } from './ui.layout.TPointAlignment';

export const alignmentToPos = (
	[alignmentX, alignmentY]: TPointAlignment,
	[selfWidth, selfHeight]: [width: ScalarSignal, height: ScalarSignal],
	[canvasWidth, canvasHeight]: [width: ScalarSignal, height: ScalarSignal],
): [width: ScalarSignal, height: ScalarSignal] => [
	(() => {
		switch (alignmentX) {
			case EAlignment.START:
				return canvasWidth.sub(selfWidth.div(2)).div(2).mul(-1);
			case EAlignment.SPAN:
			case EAlignment.CENTRE:
				return Reactive.val(0);
			case EAlignment.END:
				return canvasWidth.sub(selfWidth.div(2)).div(2);
			default:
				return Reactive.val(NaN);
		}
	})(),
	(() => {
		switch (alignmentY) {
			case EAlignment.START:
				return Reactive.val(0); // canvasHeight.sub(selfHeight).div(2).mul(-1);
			case EAlignment.SPAN:
			case EAlignment.CENTRE:
				return Reactive.val(0);
			case EAlignment.END:
				return canvasHeight.sub(selfHeight.div(2)).div(2);
			default:
				return Reactive.val(NaN);
		}
	})(),
];
