<script lang="ts" setup>
import { LogoGenerator } from "dearu-logo-generator";
import type {
  IHighlightRange,
  ILogoMeta,
} from "dearu-logo-generator/types/lib/types/shared";
import { clone, debounce } from "radash";
import { seriesInfo, type Series } from "~/commons/logo-generator";
import { siteHost } from "~/misc";

useSeoMeta({
  title: $t("pages./logo-generator.title"),
  description: $t("pages./logo-generator.description"),
  ogTitle: $t("pages./logo-generator.title"),
  ogDescription: $t("pages./logo-generator.description"),
  ogImage: `${siteHost}/tools/logo-generator.webp`,
  twitterCard: "summary",
});

const defaultSeries: Series = "yuyuyu";

const generatingEntities = reactive({
  firstLine: seriesInfo[defaultSeries].initials.firstLine,
  secondLine: seriesInfo[defaultSeries].initials.secondLine,
  isVertical: seriesInfo[defaultSeries].initials.vertical as boolean,
  isCentered: seriesInfo[defaultSeries].initials.center as boolean,
});

const hideBackground = ref(false);

const currentSeries = ref<Series>(defaultSeries);

const customizationMode = ref(false);
const customMeta = reactive(clone(seriesInfo[defaultSeries].meta));

const highlightedCells = ref<[line: number, index: number][]>([
  [1, 0],
  [1, 1],
]);

const highlights = computed(() => {
  const ranges: IHighlightRange[] = [];

  for (const [lineIndex, charIndex] of highlightedCells.value) {
    ranges.push({ line: lineIndex as 0 | 1, start: charIndex, end: charIndex });
  }

  return ranges;
});

let bgImageRendered = false;

const logoGeneratorInstance = new LogoGenerator(
  seriesInfo[currentSeries.value].meta
);

async function generateSVG(): Promise<SVGSVGElement> {
  const svgEl = await logoGeneratorInstance.generate(
    generatingEntities.firstLine,
    generatingEntities.secondLine,
    highlights.value,
    generatingEntities.isCentered
  );

  return svgEl;
}

const currentMeta = computed(() => {
  const meta = customizationMode.value
    ? customMeta
    : seriesInfo[currentSeries.value].meta;

  return {
    ...meta,
    backgroundImage: hideBackground.value ? "" : meta.backgroundImage,
  };
});

const onGenerate = debounce({ delay: 10 }, async () => {
  logoGeneratorInstance.setMeta(currentMeta.value);
  logoGeneratorInstance.setDirection(
    generatingEntities.isVertical ? "vertical" : "horizontal"
  );

  svgEl.value = await generateSVG();
});

const svgEl = ref(await generateSVG());
const svgStr = computed(() => svgEl.value.outerHTML);

async function svgToDataURL(svg: SVGSVGElement): Promise<string> {
  const img = new Image();
  img.src = `data:image/svg+xml;base64,${btoa(svg.outerHTML)}`;

  await img.decode();

  if (!bgImageRendered) {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  const canvas = document.createElement("canvas");
  canvas.width = svgEl.value.viewBox.baseVal.width;
  canvas.height = svgEl.value.viewBox.baseVal.height;

  const ctx = canvas.getContext("2d")!;

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  bgImageRendered = true;

  return canvas.toDataURL("image/png");
}

async function onSave() {
  const a = document.createElement("a");
  a.href = await svgToDataURL(svgEl.value);
  a.download = `${currentSeries.value}_${generatingEntities.firstLine}${
    generatingEntities.secondLine
  }_${new Date().getTime()}.png`;
  a.click();
}

function onSaveSvg() {
  const a = document.createElement("a");
  a.href = `data:image/svg+xml;base64,${btoa(svgStr.value)}`;
  a.download = `${currentSeries.value}_${generatingEntities.firstLine}${
    generatingEntities.secondLine
  }_${new Date().getTime()}.svg`;
  a.click();
}

function toggleHighlightHandler(event: MouseEvent) {
  let lineIndex: number | null = null;
  let charIndex: number | null = null;

  let target = event.target as HTMLElement | SVGElement;

  if (!(target as unknown as SVGElement).ownerSVGElement) return null;

  loop: while (target) {
    if (target.id && /[line|char]_\d/.test(target.id)) {
      const [kind, index] = target.id.split("_");
      switch (kind) {
        case "line":
          lineIndex = Number(index);
          break loop;

        case "char":
          charIndex = Number(index);
          break;

        default:
          break;
      }
    }

    if (!target.parentElement) break;
    target = target.parentElement as HTMLElement | SVGElement;
  }

  if (lineIndex !== null && charIndex !== null) {
    if (
      highlightedCells.value.some(
        ([line, char]) => line === lineIndex && char === charIndex
      )
    ) {
      highlightedCells.value = highlightedCells.value.filter(
        ([line, char]) => line !== lineIndex || char !== charIndex
      );
    } else {
      highlightedCells.value = [
        ...highlightedCells.value,
        [lineIndex, charIndex],
      ];
    }
  }
}

function onBackgroundImageChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    customMeta.backgroundImage = reader.result as string;
  };

  reader.readAsDataURL(file);
}

watch(
  [
    currentSeries,
    generatingEntities,
    hideBackground,
    highlights,
    customMeta,
    customizationMode,
    currentMeta,
  ],
  () => onGenerate()
);

watch(currentSeries, (newSelectedSeries, oldSelectedSeries) => {
  if (oldSelectedSeries !== newSelectedSeries) {
    const currentSeriesInfo = seriesInfo[newSelectedSeries];
    const oldSeriesInfo = seriesInfo[oldSelectedSeries];

    const oldFirstLine = generatingEntities.firstLine;
    const oldSecondLine = generatingEntities.secondLine;
    const oldIsVertical = generatingEntities.isVertical;
    const oldIsCenter = generatingEntities.isCentered;

    generatingEntities.firstLine = currentSeriesInfo.initials.firstLine;
    generatingEntities.secondLine = currentSeriesInfo.initials.secondLine;
    generatingEntities.isVertical = currentSeriesInfo.initials.vertical;
    generatingEntities.isCentered = currentSeriesInfo.initials.center;

    oldSeriesInfo.initials.firstLine = oldFirstLine;
    oldSeriesInfo.initials.secondLine = oldSecondLine;
    oldSeriesInfo.initials.vertical = oldIsVertical;
    oldSeriesInfo.initials.center = oldIsCenter;
  }

  Object.assign(
    customMeta,
    Object.keys(customMeta).reduce((acc, key) => {
      (acc as any)[key] = undefined;
      return acc;
    }, {} as ILogoMeta)
  );
  Object.assign(customMeta, clone(seriesInfo[currentSeries.value].meta));
});
</script>

<template>
  <div class="size-full flex flex-col">
    <div class="flex flex-wrap gap-3">
      <p class="text-2xl font-bold">{{ $t("pages./logo-generator.title") }}</p>
      <LanguageSelector />
    </div>
    <div class="grow flex flex-col justify-center items-center gap-4 my-4">
      <div class="text-xs text-stone-400">
        {{ $t("pages./logo-generator.highlightHint") }}
      </div>
      <div
        :class="[
          'flex justify-center items-center w-full',
          generatingEntities.isVertical
            ? '*:h-[65vh]'
            : '*:h-[300px] sm:*:h-[405px]',
        ]"
        v-html="svgStr"
        @click="toggleHighlightHandler"
      ></div>
      <div class="flex flex-col items-center gap-3">
        <div class="flex flex-col gap-1.5 w-full">
          <Label for="select_series">{{
            $t("pages./logo-generator.series")
          }}</Label>
          <Select v-model="currentSeries" :disabled="customizationMode">
            <SelectTrigger id="select_series" class="w-full">
              <SelectValue
                :placeholder="$t('pages./logo-generator.selectSeries')"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{{
                  $t("pages./logo-generator.series")
                }}</SelectLabel>
                <SelectItem
                  v-for="name in Object.keys(seriesInfo)"
                  :key="name"
                  :value="name"
                  >{{
                    $t(`pages./logo-generator.seriesNames.${name}`)
                  }}</SelectItem
                >
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div class="flex flex-col items-end gap-3 w-full sm:flex-row">
          <div class="flex flex-col gap-1.5 grow w-full sm:w-auto">
            <Label for="firstline">{{
              $t("pages./logo-generator.firstLine")
            }}</Label>
            <Input
              v-model="generatingEntities.firstLine"
              id="firstline"
              type="text"
              :placeholder="$t('pages./logo-generator.firstLine')"
            />
          </div>
          <div class="flex flex-col gap-1.5 grow w-full sm:w-auto">
            <Label for="secondline">{{
              $t("pages./logo-generator.secondLine")
            }}</Label>
            <Input
              v-model="generatingEntities.secondLine"
              id="secondline"
              type="text"
              :placeholder="$t('pages./logo-generator.secondLine')"
            />
          </div>
          <div class="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <Popover>
                  <PopoverTrigger as-child>
                    <TooltipTrigger as-child>
                      <Button variant="outline" size="icon">
                        <Icon name="uil:setting" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{{ $t("shared.options") }}</p>
                    </TooltipContent>
                  </PopoverTrigger>
                  <PopoverContent class="flex flex-col gap-3">
                    <div class="flex items-center gap-2">
                      <Switch
                        v-model="generatingEntities.isVertical"
                        id="vertical"
                      />
                      <Label for="vertical">{{
                        $t("pages./logo-generator.vertical")
                      }}</Label>
                    </div>
                    <div class="flex items-center gap-2">
                      <Switch
                        v-model="generatingEntities.isCentered"
                        id="center"
                      />
                      <Label for="center">{{
                        $t("pages./logo-generator.center")
                      }}</Label>
                    </div>
                    <div class="flex items-center gap-2">
                      <Switch v-model="hideBackground" id="hide_background" />
                      <Label for="hide_background">{{
                        $t("pages./logo-generator.hideBackground")
                      }}</Label>
                    </div>
                    <div class="flex items-center gap-2">
                      <Switch
                        v-model="customizationMode"
                        id="customization_mode"
                      />
                      <Label for="customization_mode">{{
                        $t("pages./logo-generator.customizationMode")
                      }}</Label>
                    </div>
                  </PopoverContent>
                </Popover>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger as-child>
                  <Button @click="onSave" variant="outline" size="icon">
                    <Icon name="uil:image-download"></Icon>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{{ $t("pages./logo-generator.saveImage") }}</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger as-child>
                  <Button @click="onSaveSvg" variant="outline" size="icon">
                    <Icon name="uil:file-download-alt"></Icon>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {{ $t("pages./logo-generator.saveImageSVG") }}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div
          v-if="customizationMode"
          class="bg-card rounded-md border shadow-xs p-3 mb-12"
        >
          <div class="font-bold mb-3">
            {{ $t("pages./logo-generator.customizationMode") }}
          </div>
          <div
            v-if="customMeta"
            class="grid grid-cols-2 gap-2 w-full *:flex *:flex-col *:gap-1.5"
          >
            <div>
              <Label for="background_image">
                {{ $t("pages./logo-generator.backgroundImage") }}
              </Label>
              <input
                type="file"
                id="background_image"
                accept="image/*"
                @change="onBackgroundImageChange"
              />
            </div>
            <div>
              <Label for="outline_color">{{
                $t("pages./logo-generator.outlineColor")
              }}</Label>
              <input
                v-model="customMeta.outlineColor"
                type="color"
                id="outline_color"
              />
            </div>
            <div>
              <Label for="background_box_color">{{
                $t("pages./logo-generator.backgroundBoxColor")
              }}</Label>
              <input
                v-model="customMeta.backgroundBoxColor"
                type="color"
                id="background_box_color"
              />
            </div>
            <div>
              <Label for="foreground_box_color">{{
                $t("pages./logo-generator.foregroundBoxColor")
              }}</Label>
              <input
                v-model="customMeta.foregroundBoxColor"
                type="color"
                id="foreground_box_color"
              />
            </div>
            <div>
              <Label for="text_color">{{
                $t("pages./logo-generator.textColor")
              }}</Label>
              <input
                v-model="customMeta.textColor"
                type="color"
                id="text_color"
              />
            </div>
            <div>
              <Label for="text_highlight_color">{{
                $t("pages./logo-generator.textHighlightColor")
              }}</Label>
              <input
                v-model="customMeta.textHighlightColor"
                type="color"
                id="text_highlight_color"
              />
            </div>
            <div>
              <Label for="offset_main_axis">{{
                $t("pages./logo-generator.offsetMainAxis")
              }}</Label>
              <Slider
                :model-value="[customMeta.offsetMainAxis ?? 0]"
                @update:model-value="(v) => (customMeta.offsetMainAxis = v![0])"
                :min="-1"
                :max="1"
                :step="0.01"
              />
            </div>
            <div>
              <Label for="offset_cross_axis">{{
                $t("pages./logo-generator.offsetCrossAxis")
              }}</Label>
              <Slider
                :model-value="[customMeta.offsetCrossAxis ?? 0]"
                @update:model-value="
                  (v) => (customMeta.offsetCrossAxis = v![0])
                "
                :min="-1"
                :max="1"
                :step="0.01"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
svg g[id^="char_"] {
  cursor: pointer;
}
</style>
