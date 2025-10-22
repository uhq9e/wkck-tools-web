<script lang="ts" setup>
const { localeCodes } = useI18n();
const route = useRoute();

const realPath = computed(() =>
  route.path.replace(new RegExp(`^\/(${localeCodes.value.join("|")})`), "")
);
</script>

<template>
  <div class="size-full flex flex-col">
    <div class="flex flex-wrap gap-3">
      <NuxtLinkLocale to="/" class="self-start">
        <Button size="icon" variant="ghost">
          <Icon name="uil:home" />
        </Button>
      </NuxtLinkLocale>
      <div>
        <p class="text-2xl font-bold mb-1">
          {{ $t(`pages.${realPath}.title`) }}
        </p>
        <p class="text-sm text-muted-foreground">
          {{ $t(`pages.${realPath}.description`) }}
        </p>
      </div>
      <LanguageSelector />
      <slot name="actions" />
    </div>
    <div class="grow flex flex-col justify-center items-center gap-4 py-8">
      <slot />
    </div>
  </div>
</template>
