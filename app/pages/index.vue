<script lang="ts" setup>
import { siteHost } from "~/misc";

type ToolCardProps = {
  title?: string;
  description?: string;
  image?: string;
  path: string;
};

const toolList: ToolCardProps[] = [
  {
    title: $t("pages./logo-generator.title"),
    description: $t("pages./logo-generator.description"),
    image: `${siteHost}/tools/logo-generator.webp`,
    path: "/logo-generator",
  },
  {
    title: $t("pages./wkck-mannaka-birthday.title"),
    description: $t("pages./wkck-mannaka-birthday.description"),
    image: `${siteHost}/tools/wkck-mannaka-birthday.webp`,
    path: "/wkck-mannaka-birthday",
  },
];
</script>

<template>
  <div class="size-full flex flex-col">
    <div class="grow flex flex-col justify-center items-center gap-8 my-4">
      <div>
        <div class="text-5xl font-black">
          {{ $t("site.title") }}
        </div>
        <div class="text-sm text-muted-foreground">
          {{ $t("site.description") }}
        </div>
      </div>
      <LanguageSelector />
      <div class="flex flex-col items-center gap-4 max-w-full">
        <NuxtLinkLocale
          v-for="item in toolList"
          :key="item.title"
          :to="item.path"
          class="w-100 max-w-full"
        >
          <ToolCard
            :title="item.title"
            :description="item.description"
            :image="item.image"
          />
        </NuxtLinkLocale>
      </div>
    </div>
  </div>
</template>
