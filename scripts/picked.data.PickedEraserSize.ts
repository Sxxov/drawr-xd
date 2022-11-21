import Reactive from 'Reactive';
import type { TPickedState } from './picked.data.TPickedState';

const source = Reactive.scalarSignalSource(`pickedEraserSize`);
export const PickedEraserSize: TPickedState<ScalarSignal> = [
	source.signal,
	(picked) => void source.set(picked),
];
