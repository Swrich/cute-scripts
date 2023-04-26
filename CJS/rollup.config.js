// rollup.config.js
import fs from 'fs';
import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import del from 'rollup-plugin-delete';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';

const srcDir = './freenom';
const distDir = './dist';

// 获取src目录下的所有文件路径
const getFilePaths = (dir) => {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  const files = dirents.map((dirent) => {
    const res = path.resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFilePaths(res) : res;
  });
  return Array.prototype.concat(...files);
};

// 获取所有的输入文件
const inputFiles = getFilePaths(srcDir);

// 生成Rollup配置
const rollupConfigs = inputFiles.map((inputFile) => {
  const outputDir = path.join(distDir, path.dirname(path.relative(srcDir, inputFile)));
  const outputFileName = path.basename(inputFile, '.cjs');
  const parentDirName = path.basename(path.dirname(inputFile));
  const outputFilePath = path.join(outputDir, `${outputFileName}.min.cjs`);

  return {
    input: inputFile,
    output: {
      file: outputFilePath,
      format: 'cjs',
    },
    plugins: [
      del({ targets: `${distDir}/${parentDirName}` }),
      resolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs(),
      json(),
    ],
  };
});

export default rollupConfigs;
