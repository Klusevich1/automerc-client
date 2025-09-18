import MiniCssExtractPlugin from "mini-css-extract-plugin";
import type { NextConfig } from "next";
import { Configuration } from "webpack";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|png|webp|woff2|woff|ttf|css|js)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
      {
        source: "/_next/image",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Content-Disposition",
            value: "inline",
          },
        ],
      },
    ];
  },

  webpack: (config: Configuration, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      console.log("Optimizing assets for production");
      if (config.output) {
        config.output.filename = "static/js/[name].[contenthash].js";
        config.output.chunkFilename = "static/js/[name].[contenthash].js";
      }

      config.plugins = config.plugins?.map((plugin) => {
        if (plugin instanceof MiniCssExtractPlugin) {
          return new MiniCssExtractPlugin({
            filename: "static/css/[name].[contenthash].css",
            chunkFilename: "static/css/[name].[contenthash].css",
          });
        }
        return plugin;
      });

      if (config.module) {
        config.module.rules?.push({
          test: /\.(png|jpg|jpeg|gif|svg|webp|eot|ttf|woff|woff2)$/i,
          type: "asset/resource",
          generator: {
            filename: "static/media/[name].[contenthash][ext]",
          },
        });
      }
    }
    return config;
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.filesmonster.ru", pathname: "/**" },
      { protocol: "https", hostname: "automerc.by", pathname: "/**" },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/api/v1/static/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "3001",
        pathname: "/api/v1/static/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/static/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "3001",
        pathname: "/static/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/api/v1/static/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        pathname: "/api/v1/static/**",
      },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  compress: true,

  productionBrowserSourceMaps: false,
  reactStrictMode: true,
};

export default nextConfig;
