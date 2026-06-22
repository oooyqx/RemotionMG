import {z} from 'zod';

/**
 * 各场景的 props schema。其他 AI / 调用方可据此构造 `--props='{...}'` JSON，
 * 零改代码渲染任意文字 + 任意动效原子（effectId ∈ [1,100]）。
 */

export const effectIdSchema = z.number().int().min(1).max(100);

export const timingSchema = z.object({
  inF: z.number().int().positive(),
  holdF: z.number().int().nonnegative(),
  outF: z.number().int().positive(),
});
export type Timing = z.infer<typeof timingSchema>;

export const heroSchema = z.object({
  entries: z.array(
    z.object({text: z.string(), sub: z.string().optional(), effectId: effectIdSchema})
  ),
  timing: timingSchema,
  background: z.string(),
  color: z.string(),
  fontSize: z.number().positive(),
});
export type HeroProps = z.infer<typeof heroSchema>;

export const captionSchema = z.object({
  lines: z.array(z.object({text: z.string(), effectId: effectIdSchema})),
  timing: timingSchema,
  background: z.string(),
  barColor: z.string(),
  color: z.string(),
  fontSize: z.number().positive(),
});
export type CaptionProps = z.infer<typeof captionSchema>;

export const listSchema = z.object({
  title: z.string(),
  items: z.array(z.object({text: z.string(), effectId: effectIdSchema})),
  stepFrames: z.number().int().positive(),
  inFrames: z.number().int().positive(),
  background: z.string(),
  color: z.string(),
  fontSize: z.number().positive(),
});
export type ListProps = z.infer<typeof listSchema>;

export const lowerThirdSchema = z.object({
  entries: z.array(
    z.object({name: z.string(), role: z.string(), effectId: effectIdSchema})
  ),
  timing: timingSchema,
  background: z.string(),
  accent: z.string(),
});
export type LowerThirdProps = z.infer<typeof lowerThirdSchema>;

export const emphasisSchema = z.object({
  lines: z.array(
    z.object({
      pre: z.string(),
      token: z.string(),
      post: z.string(),
      effectId: effectIdSchema,
      accent: z.string().optional(),
    })
  ),
  timing: timingSchema,
  background: z.string(),
  color: z.string(),
  fontSize: z.number().positive(),
});
export type EmphasisProps = z.infer<typeof emphasisSchema>;

export const gallerySchema = z.object({
  effectIds: z.array(effectIdSchema),
  background: z.string(),
  color: z.string(),
  fontSize: z.number().positive(),
});
export type GalleryProps = z.infer<typeof gallerySchema>;

/** 时长计算（帧）。供 Remotion calculateMetadata 使用。 */
const slot = (t: Timing): number => t.inF + t.holdF + t.outF;

export const heroFrames = (p: {entries: unknown[]; timing: Timing}): number =>
  Math.max(1, p.entries.length) * slot(p.timing);
export const captionFrames = (p: {lines: unknown[]; timing: Timing}): number =>
  Math.max(1, p.lines.length) * slot(p.timing);
export const lowerThirdFrames = (p: {entries: unknown[]; timing: Timing}): number =>
  Math.max(1, p.entries.length) * slot(p.timing);
export const emphasisFrames = (p: {lines: unknown[]; timing: Timing}): number =>
  Math.max(1, p.lines.length) * slot(p.timing);
export const listFrames = (p: {items: unknown[]; stepFrames: number; inFrames: number}): number =>
  Math.max(0, p.items.length - 1) * p.stepFrames + p.inFrames + 30;
export const galleryFrames = (p: {effectIds: number[]}): number => (p.effectIds.length + 3) * 40;
