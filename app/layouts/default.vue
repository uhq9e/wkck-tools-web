<script setup lang="ts">
import { siteHost } from "~/misc";

const head = useLocaleHead();

useSeoMeta({
  title: $t("site.title"),
  description: $t("site.description"),
  ogTitle: $t("site.title"),
  ogDescription: $t("site.description"),
  ogImage: `${siteHost}/og.webp`,
  twitterCard: "summary",
});
</script>

<template>
  <main class="p-4 relative overflow-y-auto">
    <Html :lang="head.htmlAttrs.lang">
      <Head>
        <template v-for="link in head.link" :key="link.key">
          <Link
            :id="link.key"
            :rel="link.rel"
            :href="link.href"
            :hreflang="link.hreflang"
          />
        </template>
        <template v-for="meta in head.meta" :key="meta.key">
          <Meta
            :id="meta.key"
            :property="meta.property"
            :content="meta.content"
          />
        </template>
      </Head>
      <Body>
        <slot />
      </Body>
    </Html>
  </main>
</template>

<style scoped>
main {
  width: 100vw;
  width: 100dvw;
  height: 100vh;
  height: 100dvh;
}
</style>
