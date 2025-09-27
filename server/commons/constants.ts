import { z } from "zod";
import { seriesNames } from "../../app/commons/logo-generator";

import "zod-openapi";

export const availableFormat = ["png", "svg"] as const;
export type AvailableFormat = (typeof availableFormat)[number];

const hexColorRegex = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/;
const booleanValueTransformer = z.transform((val: string) => {
  if (val === "true") return true;
  else return false;
});

export const LogoGeneratorInputSchema = z.object({
  series: z
    .enum(seriesNames)
    .default("yuyuyu")
    .meta({ description: "Series of logo to be generated", example: "yuyuyu" }),
  text1: z.string().max(100).optional().meta({
    description: "First line of text to be displayed on the logo",
    example: "結城友奈は",
  }),
  text2: z.string().max(100).optional().meta({
    description: "Second line of text to be displayed on the logo",
    example: "勇者である",
  }),
  vertical: z.string().pipe(booleanValueTransformer).optional().meta({
    description: "Whether to display the logo vertically",
    example: false,
  }),
  centered: z.string().pipe(booleanValueTransformer).optional().meta({
    description: "Whether to center the text",
    example: false,
  }),
  outlineColor: z.string().regex(hexColorRegex).optional().meta({
    description: "Color of the outline in hex format",
    example: "#ffffff",
  }),
  backgroundBoxColor: z.string().regex(hexColorRegex).optional().meta({
    description: "Color of the background box in hex format",
    example: "#67362e",
  }),
  foregroundBoxColor: z.string().regex(hexColorRegex).optional().meta({
    description: "Color of the foreground box in hex format",
    example: "#eed0d2",
  }),
  textColor: z.string().regex(hexColorRegex).optional().meta({
    description: "Color of the text in hex format",
    example: "#67362e",
  }),
  textHighlightColor: z.string().regex(hexColorRegex).optional().meta({
    description: "Color of the highlighted text in hex format",
    example: "#ffffff",
  }),
  offsetMainAxis: z.coerce.number().min(-1).max(1).default(0).meta({
    description:
      "Offset of the logo along the main axis (-1 to 1, where -1 is left/top and 1 is right/bottom)",
    example: 0,
  }),
  offsetCrossAxis: z.coerce.number().min(-1).max(1).default(0).meta({
    description:
      "Offset of the logo along the cross axis (-1 to 1, where -1 is left/top and 1 is right/bottom)",
    example: 0,
  }),
  highlight: z
    .string()
    .regex(/^(?:\d+:\d+(?:-\d+)?)(?:,\d+:\d+(?:-\d+)?)*$/)
    .optional()
    .meta({
      description:
        "Comma-separated list of highlight ranges in the format line:start-end (e.g., 0:0-2,1:1-3)",
      example: "1:0-1",
    }),
  format: z.enum(availableFormat).default("png").meta({
    description: "Format of the generated image",
    example: "png",
  }),
});
