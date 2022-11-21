import Reactive from 'Reactive';
import type { TPickedState } from './picked.data.TPickedState';

const source = Reactive.scalarSignalSource(`pickedDialogHeight`);
export const PickedDialogHeight: TPickedState<ScalarSignal> = [
	source.signal,
	(picked) => void source.set(picked),
];
