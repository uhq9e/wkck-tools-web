<script lang="ts" setup>
const {
  title = "Title",
  description,
  image,
} = defineProps<{
  title?: string;
  description?: string;
  image?: string;
}>();
</script>

<template>
  <div
    class="relative bg-card rounded-md overflow-hidden border shadow-sm max-w-full transition-all hover:opacity-75 hover:border-primary"
  >
    <template v-if="image">
      <AspectRatio :ratio="16 / 9">
        <NuxtImg :src="image" class="bg-primary/5 size-full object-cover" />
      </AspectRatio>
      <Separator />
    </template>
    <div class="px-3 py-2">
      <div v-if="title" class="mb-1">{{ title }}</div>
      <div v-if="description" class="text-sm text-muted-foreground">
        {{ description }}
      </div>
    </div>
  </div>
</template>
