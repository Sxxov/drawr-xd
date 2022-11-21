import TouchGestures from 'TouchGestures';
import { undo } from './@stroke';
import { use } from './provider.use';

void use(() => {
	TouchGestures.onLongPress().subscribe(async () => {
		await undo();
	});
});
