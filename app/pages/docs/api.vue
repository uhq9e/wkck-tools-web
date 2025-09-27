<script lang="ts" setup>
import { SwaggerUIBundle } from "swagger-ui-dist";
import { apiSpec } from "../../../server/commons/openapi";

const swaggerDomNode = ref(null);

onMounted(() => {
  SwaggerUIBundle({
    domNode: swaggerDomNode.value,
    spec: apiSpec,
  });
});
</script>

<template>
  <div ref="swaggerDomNode"></div>
</template>

<style>
@import "swagger-ui-dist/swagger-ui.css";
</style>
