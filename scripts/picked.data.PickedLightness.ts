import Reactive from 'Reactive';
import type { TPickedState } from './picked.data.TPickedState';

const source = Reactive.scalarSignalSource(`pickedLuminance`);
export const PickedLightness: TPickedState<ScalarSignal> = [
	source.signal,
	(picked) => void source.set(picked),
];
