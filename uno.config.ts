import { defineConfig } from "unocss";

import presetAttributify from "@unocss/preset-attributify";
import presetIcons from "@unocss/preset-icons";
import presetUno from "@unocss/preset-uno";
import transformerDirectives from "@unocss/transformer-directives";
import transformerVariantGroup from "@unocss/transformer-variant-group";

export default defineConfig({
  presets: [
    presetUno({
      dark: {
        dark: '[theme-mode="dark"]'
      }
    }), // 必须先引入这个，其他 preset 才能生效
    presetAttributify(),
    presetIcons({
      warn: true // 当找不到图标时发出警告
    })
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  content: {
    pipeline: {
      include: ["src/**/*.{ts,tsx}"]
    }
  },
  shortcuts: [
    ["flex-center", "flex justify-center items-center"],
    ["flex-between", "flex justify-between items-center"]
  ]
});
