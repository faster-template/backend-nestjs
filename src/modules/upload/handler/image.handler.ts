import * as sharp from 'sharp';
import { ResizeOptions } from 'sharp';

// resize: null | ResizeOptions,
// width: 可选，指定缩放后的图片宽度（像素）。如果同时指定了 width 和 height，则 width 优先级更高。
// height: 可选，指定缩放后的图片高度（像素）。如果同时指定了 width 和 height，则 width 优先级更高。
// fit: 可选，指定如何将图片缩放以适应提供的 width 和 height。可选值为 FitEnum 枚举类型中的一个，默认值为 'cover'。常见取值：
// // cover: 图片会完全覆盖指定区域，可能会被裁剪。
// // contain: 图片会完整地包含在指定区域内，可能会留白。
// // fill: 图片会填充整个区域，可能会拉伸变形。
// // inside: 图片会被缩放以适应指定区域，但不会放大。
// // outside: 图片会被缩放以完全包含指定区域，但不会缩小。
// position: 可选，当 fit 为 'cover' 或 'contain' 时，指定图片在区域内的位置或对齐方式。可以是数字、字符串或预定义常量，默认值为 'centre'。
// background: 可选，当 fit 为 'contain' 时，指定背景颜色。默认值为黑色不透明 ({r: 0, g: 0, b: 0, alpha: 1})，可以使用 Color 类型指定其他颜色。
// kernel: 可选，指定图片缩小时使用的内核算法。可选值为 KernelEnum 枚举类型中的一个，默认值为 'lanczos3'。不同算法会产生不同的锐化效果。
// withoutEnlargement: 可选，如果图片宽度或高度已经小于指定的尺寸，则不进行放大。相当于 GraphicsMagick 的 > 几何选项，默认值为 false。
// withoutReduction: 可选，如果图片宽度或高度已经大于指定的尺寸，则不进行缩小。相当于 GraphicsMagick 的 < 几何选项，默认值为 false。
// fastShrinkOnLoad: 可选，是否利用 JPEG 和 WebP 格式的 "shrink-on-load" 特性，这可能会在某些图片上产生轻微的摩尔纹。默认值为 true。

const defaultResizeOption: ResizeOptions = {
  background: { r: 255, g: 255, b: 255, alpha: 1 },
};

export const resizeImage = async (
  image: Buffer,
  resize: null | ResizeOptions,
  quality: number,
): Promise<Buffer> => {
  return await sharp(image)
    .flatten({ background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .resize(Object.assign(defaultResizeOption, resize))
    .jpeg({ quality })
    .toBuffer();
};
