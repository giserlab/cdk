import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import { obfuscator } from 'rollup-obfuscator';
import dts from 'rollup-plugin-dts';

const require = createRequire(import.meta.url);
const pkg = process.env.TARGET;
const __dirname = fileURLToPath(new URL('.', import.meta.url));

const resolveDev = p => {
  return path.resolve(`${__dirname}/packages/${pkg}`, p);
};

const { buildOptions } = require(resolveDev('package.json'));
// 集中引入turf主包，打包异常，暂时分开引入
const globals = {
  Cesium: 'Cesium',
  cesium: 'Cesium',
  '@turf/turf': 'turf',
  '@turf/bbox': 'turf',
  '@turf/square-grid': 'turf',
  '@turf/helpers': 'turf',
  '@turf/buffer': 'turf',
  '@turf/point-grid': 'turf',
  '@turf/bezier-spline': 'turf',
  '@turf/invariant': 'turf',
};

const formatMap = {
  esm: {
    file: resolveDev(`dist/index.esm.js`),
    format: 'esm',
  },
  cjs: {
    file: resolveDev(`dist/index.cjs.js`),
    format: 'cjs',
  },
  iife: {
    name: 'cak',
    file: resolveDev(`dist/index.iife.js`),
    format: 'iife',
    sourcemap: true,
    globals,
  },
  umd: {
    name: 'cak',
    exports: 'named',
    file: resolveDev(`dist/index.main.js`),
    format: 'umd',
    sourcemap: true,
    globals,
  },
};

// const external = ['cesium', '@turf/turf', '@turf/bbox', '@turf/square-grid'];
// 通过正则匹配外部依赖
const externalDetect = id => /^@turf/.test(id) || /^cesium/.test(id);

const createConfig = output => {
  output.name = buildOptions.name;
  const format = output.format;

  const cfgs = [
    {
      input: resolveDev('src/index.ts'),
      output,
      external: externalDetect,
      plugins: [
        resolve(),
        typescript({
          tsconfigOverride: {
            tsconfig: path.resolve(__dirname, 'tsconfig.json'),
            useTsconfigDeclarationDir: true,
            tsconfigOverride: {
              compilerOptions: {
                target: 'ES6',
                module: 'ES6',
                sourceMap: false,
                declaration: true,
                declarationMap: false,
                forceConsistentCasingInFileNames: true,
              },
              include: ['src/**/*'],
            },
          },
        }),
        json(),
        nodeResolve(),
        obfuscator({
          options: {
            // 压缩代码
            compact: true,
            // 是否启用控制流扁平化(降低1.5倍的运行速度)
            controlFlowFlattening: true,
            // 应用概率;在较大的代码库中，建议降低此值，因为大量的控制流转换可能会增加代码的大小并降低代码的速度。
            controlFlowFlatteningThreshold: 1,
            // 随机的死代码块(增加了混淆代码的大小)
            deadCodeInjection: true,
            // 死代码块的影响概率
            deadCodeInjectionThreshold: 1,
            // 此选项几乎不可能使用开发者工具的控制台选项卡
            debugProtection: true,
            // 如果选中，则会在“控制台”选项卡上使用间隔强制调试模式，从而更难使用“开发人员工具”的其他功能。
            debugProtectionInterval: true,
            // 通过用空函数替换它们来禁用console.log，console.info，console.error和console.warn。这使得调试器的使用更加困难。
            disableConsoleOutput: true,
            // 标识符的混淆方式 hexadecimal(十六进制) mangled(短标识符)
            identifierNamesGenerator: 'hexadecimal',
            log: false,
            // 是否启用全局变量和函数名称的混淆
            renameGlobals: true,
            // 通过固定和随机（在代码混淆时生成）的位置移动数组。这使得将删除的字符串的顺序与其原始位置相匹配变得更加困难。如果原始源代码不小，建议使用此选项，因为辅助函数可以引起注意。
            rotateStringArray: true,
            // 混淆后的代码,不能使用代码美化,同时需要配置 cpmpat:true;
            selfDefending: true,
            // 删除字符串文字并将它们放在一个特殊的数组中
            stringArray: true,
            stringArrayEncoding: 'rc4',
            stringArrayThreshold: 1,
            // 允许启用/禁用字符串转换为unicode转义序列。Unicode转义序列大大增加了代码大小，并且可以轻松地将字符串恢复为原始视图。建议仅对小型源代码启用此选项。
            transformObjectKeys: true,
            unicodeEscapeSequence: false,
          },
        }),
      ],
    },
  ];
  // 如果是esm格式，添加声明文件
  if (format === 'esm') {
    cfgs.push({
      input: resolveDev('src/index.ts'),
      output: [{ file: resolveDev('dist/index.d.ts'), format: 'esm' }],
      context: 'window',
      external: externalDetect,
      plugins: [dts({ rollupTypes: true })],
    });
  }
  return cfgs;
};

const configs = buildOptions.formats.map(format => createConfig(formatMap[format]));

export default configs.flat();
