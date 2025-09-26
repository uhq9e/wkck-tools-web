import { z } from "zod";
import { LogoGenerator } from "dearu-logo-generator";
import type {
  IHighlightRange,
  ILogoMeta,
} from "dearu-logo-generator/types/lib/types/shared";
import sharp from "sharp";
import type { H3Event, EventHandlerRequest } from "h3";

import { seriesInfo } from "~/commons/logo-generator";

const series = ["yuyuyu", "wasuyu", "nowayu", "kumeyu", "uhimi"] as const;
const availableFormat = ["png", "svg"] as const;
type AvailableFormat = (typeof availableFormat)[number];

const hexColorRegex = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/;

const LogoGeneratorInputSchema = z.object({
  series: z.enum(series).default("yuyuyu"),
  text1: z.string().max(100).optional(),
  text2: z.string().max(100).optional(),
  vertical: z.coerce.boolean().optional(),
  centered: z.coerce.boolean().optional(),
  outlineColor: z.string().regex(hexColorRegex).optional(),
  backgroundBoxColor: z.string().regex(hexColorRegex).optional(),
  foregroundBoxColor: z.string().regex(hexColorRegex).optional(),
  textColor: z.string().regex(hexColorRegex).optional(),
  textHighlightColor: z.string().regex(hexColorRegex).optional(),
  offsetMainAxis: z.coerce.number().min(-1).max(1).default(0),
  offsetCrossAxis: z.coerce.number().min(-1).max(1).default(0),
  highlight: z
    .string()
    .regex(/^(?:\d+:\d+(?:-\d+)?)(?:,\d+:\d+(?:-\d+)?)*$/)
    .optional(),
  format: z.enum(availableFormat).default("png"),
});

export const logoGeneratorHandler =
  (config?: { specifiedFormat?: AvailableFormat }) =>
  async (event: H3Event<EventHandlerRequest>) => {
    const { specifiedFormat } = config ?? {};

    const input = await getValidatedQuery(event, (body) =>
      LogoGeneratorInputSchema.parse(body)
    );

    const highlightRanges: IHighlightRange[] = input.highlight
      ? input.highlight.split(",").reduce((acc, rangeStr) => {
          const [lineStr, posStr] = rangeStr.split(":");
          const line = parseInt(lineStr, 10);
          if (isNaN(line) || line < 0 || line > 1) return acc;

          const [start, end] = posStr.split("-").map((v) => parseInt(v, 10));

          if (isNaN(start) || isNaN(end) || start < 0 || end < 0 || start > end)
            return acc;

          acc.push({ line: line as 0 | 1, start, end });
          return acc;
        }, [] as IHighlightRange[])
      : [{ line: 1, start: 0, end: 1 }];

    const currentSeries = seriesInfo[input.series];

    const meta: ILogoMeta = {
      ...currentSeries.meta,
      outlineColor: input.outlineColor ?? currentSeries.meta.outlineColor,
      backgroundBoxColor:
        input.backgroundBoxColor ?? currentSeries.meta.backgroundBoxColor,
      foregroundBoxColor:
        input.foregroundBoxColor ?? currentSeries.meta.foregroundBoxColor,
      textColor: input.textColor ?? currentSeries.meta.textColor,
      textHighlightColor:
        input.textHighlightColor ?? currentSeries.meta.textHighlightColor,
      offsetMainAxis: input.offsetMainAxis ?? currentSeries.meta.offsetMainAxis,
      offsetCrossAxis:
        input.offsetCrossAxis ?? currentSeries.meta.offsetCrossAxis,
    };

    const generatorInstance = new LogoGenerator(
      meta,
      (input.vertical ?? currentSeries.initials.vertical)
        ? "vertical"
        : "horizontal"
    );

    const svgEl = await generatorInstance.generate(
      input.text1 ?? currentSeries.initials.firstLine,
      input.text2 ?? currentSeries.initials.secondLine,
      highlightRanges,
      input.centered ?? currentSeries.initials.center
    );

    if (specifiedFormat ?? input.format === "svg") {
      setResponseHeader(event, "Content-Type", "image/svg+xml");
      setResponseHeader(
        event,
        "Cache-Control",
        "public, max-age=31536000, immutable"
      );
      return svgEl.outerHTML;
    } else {
      const pngBuffer = await sharp(Buffer.from(svgEl.outerHTML))
        .png()
        .toBuffer();

      setResponseHeader(event, "Content-Type", "image/png");
      setResponseHeader(
        event,
        "Cache-Control",
        "public, max-age=31536000, immutable"
      );
      return pngBuffer;
    }
  };
