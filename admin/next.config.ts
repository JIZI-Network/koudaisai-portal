import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true
  },
  basePath: "/admin",
  trailingSlash: true,
};

export default nextConfig;
