import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  i18n: {
    locales: ["en", "sq"],
    defaultLocale: "en",
  },
  webpack(config) {
    // Exclude svg from the default Next.js image loader
    const fileLoaderRule = config.module.rules.find(
      (rule: { test: { test: (arg0: string) => any } }) =>
        typeof rule === "object" &&
        rule?.test instanceof RegExp &&
        rule.test.test(".svg"),
    );

    if (fileLoaderRule && typeof fileLoaderRule !== "string") {
      fileLoaderRule.exclude = /\.svg$/;
    }

    // Add SVGR loader
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            icon: true,
            svgo: true,
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
