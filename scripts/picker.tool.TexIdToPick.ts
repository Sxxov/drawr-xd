import { pickBrushSizeTool } from './picker.tool.pickBrushSizeTool';
import { pickDialogHeightTool } from './picker.tool.pickDialogHeightTool';
import { pickEraserSizeTool } from './picker.tool.pickEraserSizeTool';
import { pickHueTool } from './picker.tool.pickHueTool';
import { pickLightnessTool } from './picker.tool.pickLightnessTool';
import { pickSaturationTool } from './picker.tool.pickSaturationTool';

/* eslint-disable @typescript-eslint/naming-convention */
export const TexIdToPick = {
	'ic.hue.png': pickHueTool,
	'ic.saturation.png': pickSaturationTool,
	'ic.lightness.png': pickLightnessTool,
	'ic.brushSize.png': pickBrushSizeTool,
	// 'ic.eraserSize.png': pickEraserSizeTool,
	'ic.dialog.png': pickDialogHeightTool,
} as const;
/* eslint-enable */
