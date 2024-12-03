import {
  defineConfig,
  presetIcons,
  presetUno,
  presetWind,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetWind(),
    presetIcons({
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
  transformers: [
    transformerVariantGroup(),
  ],
  rules: [
    [
      /^bg-black-white-(\d+)$/,
      ([, d]) => ({
        'background-image': 'conic-gradient(#dddddd 0 25%, #f8f8f8 25% 50%, #dddddd 50% 75%, #f8f8f8 75%)',
        'background-size': `${d}px ${d}px`,
      }),
    ],
  ],
})
