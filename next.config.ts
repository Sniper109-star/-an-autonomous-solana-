import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["@triton-one/yellowstone-grpc", "jito-ts"],
};

export default nextConfig;
