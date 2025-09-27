import { createDocument, ZodOpenApiOperationObject } from "zod-openapi";

import { LogoGeneratorInputSchema } from "./constants";

const logoGeneratorOperation: ZodOpenApiOperationObject = {
  operationId: "logoGenerator",
  summary: "Generate a Yuusha de Aru series logo",
  requestParams: {
    query: LogoGeneratorInputSchema,
  },
  responses: {
    200: {
      description: "Successful logo generation",
      content: {
        "image/png": {
          schema: {
            type: "string",
            format: "binary",
            description: "PNG image of the generated logo",
          },
        },
        "image/svg+xml": {
          schema: {
            type: "string",
            description: "SVG image of the generated logo",
          },
        },
      },
    },
  },
};

export const apiSpec = createDocument({
  openapi: "3.1.0",
  info: {
    title: "WKCK Tools API",
    version: "1.0.0",
    description: "API documentation for WKCK Tools",
  },
  components: {},
  servers: [
    {
      url: "https://tools.wakachika.love/api",
      description: "Production domain",
    },
    {
      url: "https://wkck-tools-web.vercel.app/api",
      description: "Vercel domain",
    },
    {
      url: "http://localhost:2362/api",
      description: "Local development",
    },
  ],
  security: [],
  paths: {
    "/logo-generator": {
      get: logoGeneratorOperation,
    },
  },
});
