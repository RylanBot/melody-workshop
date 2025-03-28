import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup
} from "unocss";

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
    ["flex-start", "flex justify-start items-center"],
    ["flex-center", "flex justify-center items-center"],
    ["flex-between", "flex justify-between items-center"],
    ["flex-end", "flex justify-end items-center"]
  ]
});
