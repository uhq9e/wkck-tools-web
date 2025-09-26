import { yuyuyu, wasuyu, nowayu, kumeyu, uhimi } from "dearu-logo-generator";
import type { ILogoMeta } from "dearu-logo-generator/types/lib/types/shared";

export type SeriesInfo = {
  meta: ILogoMeta;
  initials: {
    firstLine: string;
    secondLine: string;
    vertical: boolean;
    center: boolean;
  };
};

export const seriesInfo = {
  yuyuyu: {
    meta: yuyuyu,
    initials: {
      firstLine: "結城友奈は",
      secondLine: "勇者である",
      vertical: false as boolean,
      center: false as boolean,
    },
  },
  wasuyu: {
    meta: wasuyu,
    initials: {
      firstLine: "鷲尾須美は",
      secondLine: "勇者である",
      vertical: false as boolean,
      center: false as boolean,
    },
  },
  nowayu: {
    meta: nowayu,
    initials: {
      firstLine: "乃木若葉は",
      secondLine: "勇者である",
      vertical: false as boolean,
      center: false as boolean,
    },
  },
  kumeyu: {
    meta: kumeyu,
    initials: {
      firstLine: "楠 芽吹は",
      secondLine: "勇者である",
      vertical: false as boolean,
      center: false as boolean,
    },
  },
  uhimi: {
    meta: uhimi,
    initials: {
      firstLine: "上里ひなたは",
      secondLine: "巫女である",
      vertical: false as boolean,
      center: true as boolean,
    },
  },
} satisfies Record<string, SeriesInfo>;

export type Series = keyof typeof seriesInfo;
