import Reactive from 'Reactive';
import type { TPickedState } from './picked.data.TPickedState';

const source = Reactive.scalarSignalSource(`pickedHue`);
export const PickedHue: TPickedState<ScalarSignal> = [
	source.signal,
	(picked) => void source.set(picked),
];
