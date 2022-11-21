import Reactive from 'Reactive';
import type { TPickedState } from './picked.data.TPickedState';

const source = Reactive.scalarSignalSource(`pickedTool`);
export const PickedToolIndex: TPickedState<ScalarSignal> = [
	source.signal,
	(picked) => void source.set(picked),
];
