import { z } from "zod";

export const captionItemSchema = z.object({
  platform: z.enum(["Instagram", "TikTok", "X", "LinkedIn"]),
  text: z.string().min(1).max(3000),
  hashtags: z.array(z.string().regex(/^#[^\s#]+$/, "must start with # and contain no spaces")).min(0).max(30),
});

export const captionResultSchema = z.object({
  intro: z.string().min(1).max(400),
  captions: z.array(captionItemSchema).max(4),
});

export type CaptionResult = z.infer<typeof captionResultSchema>;
export type CaptionItem = z.infer<typeof captionItemSchema>;

export const strategySectionSchema = z.object({
  title: z.string().min(1).max(80),
  bullets: z.array(z.string().min(3).max(400)).min(1).max(10),
});

export const strategyResultSchema = z.object({
  intro: z.string().min(1).max(400),
  sections: z.array(strategySectionSchema).min(0).max(10),
});

export type StrategyResult = z.infer<typeof strategyResultSchema>;
export type StrategySection = z.infer<typeof strategySectionSchema>;

export const reelBriefSchema = z.object({
  intro: z.string().min(1).max(300),
  image_prompt: z.string().min(0).max(1500),
  aspect_ratio: z.enum(["1:1", "9:16", "16:9", "3:4", "4:3", "4:5"]).default("9:16"),
  title: z.string().min(1).max(80),
  caption_overlay: z.string().max(200).default(""),
});

export type ReelBrief = z.infer<typeof reelBriefSchema>;

export const allInOnePostSchema = z.object({
  title: z.string().min(1).max(80),
  image_prompt: z.string().min(10).max(1500),
  aspect_ratio: z.enum(["1:1", "9:16", "16:9", "3:4", "4:3", "4:5"]).default("1:1"),
  caption_overlay: z.string().max(200).default(""),
  platform: z.enum(["Instagram", "TikTok", "X", "LinkedIn"]),
  caption: z.string().min(1).max(3000),
  hashtags: z
    .array(z.string().regex(/^#[^\s#]+$/, "must start with # and contain no spaces"))
    .max(30)
    .default([]),
});

export const allInOnePlanSchema = z.object({
  title: z.string().min(1).max(80),
  bullets: z.array(z.string().min(3).max(400)).min(2).max(8),
});

export const allInOneResultSchema = z.object({
  intro: z.string().min(1).max(500),
  plan: allInOnePlanSchema,
  posts: z.array(allInOnePostSchema).length(2),
});

export type AllInOneResult = z.infer<typeof allInOneResultSchema>;
export type AllInOnePost = z.infer<typeof allInOnePostSchema>;

export const intakeResultSchema = z.object({
  status: z.enum(["ask", "execute"]),
  message: z.string().min(1).max(1200),
  brief: z.string().max(4000).optional(),
});

export type IntakeResult = z.infer<typeof intakeResultSchema>;
