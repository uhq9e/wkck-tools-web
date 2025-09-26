<script lang="ts" setup>
const { locale, locales, setLocale } = useI18n();
const switchLocalePath = useSwitchLocalePath();
</script>

<template>
  <Select :model-value="locale">
    <SelectTrigger class="w-40">
      <Icon name="lucide:languages" />
      <SelectValue :placeholder="$t('shared.language')" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>{{ $t("shared.language") }}</SelectLabel>
        <NuxtLink
          v-for="locale in locales"
          :key="locale.code"
          :to="switchLocalePath(locale.code)"
        >
          <SelectItem :value="locale.code">{{ locale.name }}</SelectItem>
        </NuxtLink>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
