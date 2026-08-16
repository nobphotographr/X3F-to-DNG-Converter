import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/x3f-to-dng",
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
