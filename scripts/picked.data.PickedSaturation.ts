import Reactive from 'Reactive';
import type { TPickedState } from './picked.data.TPickedState';

const source = Reactive.scalarSignalSource(`pickedSaturation`);
export const PickedSaturation: TPickedState<ScalarSignal> = [
	source.signal,
	(picked) => void source.set(picked),
];
