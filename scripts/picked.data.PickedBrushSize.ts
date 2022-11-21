import Reactive from 'Reactive';
import type { TPickedState } from './picked.data.TPickedState';

const source = Reactive.scalarSignalSource(`pickedBrushSize`);
export const PickedBrushSize: TPickedState<ScalarSignal> = [
	source.signal,
	(picked) => void source.set(picked),
];
