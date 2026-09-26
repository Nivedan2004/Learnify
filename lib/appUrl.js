export function getAppUrl(path = "") {
  const base = (process.env.HOST_URL || "http://localhost:3000")
    .replace(/['"]/g, "")
    .replace(/\/$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}
