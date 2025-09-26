import { logoGeneratorHandler } from "../commons/logo-generator-handler";

export default defineEventHandler(
  logoGeneratorHandler({ specifiedFormat: "svg" })
);
