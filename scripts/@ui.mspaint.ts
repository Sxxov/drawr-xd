import Reactive from 'Reactive';
import Scene from 'Scene';
import Textures from 'Textures';
import { createCanvas } from './create.createCanvas';
import { use } from './provider.use';
import { EAlignment } from './ui.layout.EAlignment';
import { createPanel } from './ui.blocks.createPanel';
import { layoutPlanar } from './ui.layout.layoutPlanar';

void use(async ({ focalDistance }) => {
	const canvas = await createCanvas({
		name: '!ui.mspaint',
		mode: Reactive.val(Scene.RenderMode.SCREEN_SPACE),
	});

	await focalDistance.addChild(canvas);

	// mid
	{
		const tex = (await Textures.findFirst('mspaint.mid.png'))!;
		const panel = await createPanel('!mspaint.mid', tex);
		layoutPlanar(canvas, tex, panel, {
			alignment: [EAlignment.SPAN, EAlignment.SPAN],
		});
		await canvas.addChild(panel);
	}

	// top
	{
		const tex = (await Textures.findFirst('mspaint.top.png'))!;
		const panel = await createPanel('!mspaint.top', tex);
		layoutPlanar(canvas, tex, panel, {
			alignment: [EAlignment.SPAN, EAlignment.START],
		});
		await canvas.addChild(panel);
	}

	// btm
	{
		const tex = (await Textures.findFirst('mspaint.btm.png'))!;
		const panel = await createPanel('!mspaint.btm', tex);
		layoutPlanar(canvas, tex, panel, {
			alignment: [EAlignment.SPAN, EAlignment.END],
		});
		await canvas.addChild(panel);
	}
});
