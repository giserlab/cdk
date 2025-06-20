import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import cesium from 'vite-plugin-cesium-build';
import { resolve } from 'path';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import obfuscatorPlugin from 'vite-plugin-javascript-obfuscator';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  server: {
    port: 8071,
  },
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      $: fileURLToPath(new URL('../packages', import.meta.url)),
    },
  },
  plugins: [
    vue(),
    cesium({ css: true }),
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), 'src/assets/icons/svg')],
      symbolId: '[name]',
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    obfuscatorPlugin({
      apply: 'build',
      options: {
        // 压缩代码
        compact: true,
        // 是否启用控制流扁平化(降低1.5倍的运行速度)
        controlFlowFlattening: true,
        // 应用概率;在较大的代码库中，建议降低此值，因为大量的控制流转换可能会增加代码的大小并降低代码的速度。
        controlFlowFlatteningThreshold: 0.7,
        // 随机的死代码块(增加了混淆代码的大小)
        deadCodeInjection: false,
        // 死代码块的影响概率
        deadCodeInjectionThreshold: 0.6,
        // 此选项几乎不可能使用开发者工具的控制台选项卡
        debugProtection: true,
        // 如果选中，则会在“控制台”选项卡上使用间隔强制调试模式，从而更难使用“开发人员工具”的其他功能。
        debugProtectionInterval: 1,
        // 通过用空函数替换它们来禁用console.log，console.info，console.error和console.warn。这使得调试器的使用更加困难。
        disableConsoleOutput: true,
        // 标识符的混淆方式 hexadecimal(十六进制) mangled(短标识符)
        identifierNamesGenerator: 'hexadecimal',
        log: true,
        // 是否启用全局变量和函数名称的混淆
        renameGlobals: true,
        // 通过固定和随机（在代码混淆时生成）的位置移动数组。这使得将删除的字符串的顺序与其原始位置相匹配变得更加困难。如果原始源代码不小，建议使用此选项，因为辅助函数可以引起注意。
        rotateStringArray: true,
        // 混淆后的代码,不能使用代码美化,同时需要配置 cpmpat:false;
        selfDefending: true,
        // 删除字符串文字并将它们放在一个特殊的数组中
        stringArray: false,
        stringArrayThreshold: 1,
        // 允许启用/禁用字符串转换为unicode转义序列。Unicode转义序列大大增加了代码大小，并且可以轻松地将字符串恢复为原始视图。建议仅对小型源代码启用此选项。
        transformObjectKeys: true,
        unicodeEscapeSequence: true,
      },
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use  "@/assets/styles/mixin.scss" as *;',
      },
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      // 静态资源分类打包
      output: {
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
      },
    },
  },
});
