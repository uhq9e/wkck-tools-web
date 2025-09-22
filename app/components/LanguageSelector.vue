<script lang="ts" setup>
const { locale, locales, setLocale } = useI18n();
</script>

<template>
  <Select
    :model-value="locale"
    @update:model-value="(v) => setLocale(v as typeof locale)"
  >
    <SelectTrigger class="w-40">
      <Icon name="lucide:languages" />
      <SelectValue :placeholder="$t('shared.language')" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>{{ $t("shared.language") }}</SelectLabel>
        <SelectItem
          v-for="locale in locales"
          :key="locale.code"
          :value="locale.code"
          >{{ $t(`shared.languageNames.${locale.code}`) }}</SelectItem
        >
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
