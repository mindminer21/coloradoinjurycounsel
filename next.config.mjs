import fs from "node:fs";

const redirectMap = JSON.parse(
  fs.readFileSync(new URL("./docs/redirect-map.json", import.meta.url), "utf8"),
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // TEMP NOINDEX: remove this headers() block when ready to index, then request indexing in GSC.
  async headers() {
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
  async redirects() {
    return redirectMap;
  },
};
export default nextConfig;
