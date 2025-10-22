export const siteHost = import.meta.client
  ? window.location.origin
  : process.env.NODE_ENV === "production"
    ? "https://tools.wakachika.love"
    : "http://localhost:2362";
