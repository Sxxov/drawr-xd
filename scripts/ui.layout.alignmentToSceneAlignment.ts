import Scene from 'Scene';
import { EAlignment } from './ui.layout.EAlignment';
import type { TPointAlignment } from './ui.layout.TPointAlignment';

export const alignmentToSceneAlignment = ([
	alignmentX,
	alignmentY,
]: TPointAlignment): [
	x: typeof Scene.HorizontalAlignment[keyof typeof Scene.HorizontalAlignment],
	y: typeof Scene.VerticalAlignment[keyof typeof Scene.VerticalAlignment],
] => [
	(() => {
		switch (alignmentX) {
			case EAlignment.START:
				return Scene.HorizontalAlignment.LEFT;
			case EAlignment.END:
				return Scene.HorizontalAlignment.RIGHT;
			case EAlignment.SPAN:
			case EAlignment.CENTRE:
			default:
				return Scene.HorizontalAlignment.CENTER;
		}
	})(),
	(() => {
		switch (alignmentY) {
			case EAlignment.START:
				return Scene.VerticalAlignment.TOP;
			case EAlignment.END:
				return Scene.VerticalAlignment.BOTTOM;
			case EAlignment.SPAN:
			case EAlignment.CENTRE:
			default:
				return Scene.VerticalAlignment.CENTER;
		}
	})(),
];
