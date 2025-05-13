import path from 'node:path';
import {fileURLToPath} from 'node:url';

import * as Repack from '@callstack/repack';
import UnpluginTypia from '@ryoppippi/unplugin-typia/webpack';
import {ExpoModulesPlugin} from '@callstack/repack-plugin-expo-modules';
import {ReanimatedPlugin} from '@callstack/repack-plugin-reanimated';
import Dotenv from 'dotenv-webpack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Rspack configuration enhanced with Re.Pack defaults for React Native.
 *
 * Learn about Rspack configuration: https://rspack.dev/config/
 * Learn about Re.Pack configuration: https://re-pack.dev/docs/guides/configuration
 */

export default {
  context: __dirname,
  entry: './index.js',
  resolve: {
    ...Repack.getResolveOptions(),
    fallback: {
      crypto: false,
      '@modelcontextprotocol/sdk': false,
    },
  },
  module: {
    rules: [
      ...Repack.getJsTransformRules(),
      ...Repack.getAssetTransformRules(),
    ],
  },
  plugins: [
    new Dotenv({
      path: './.env',
    }),
    new Repack.RepackPlugin(),
    new ExpoModulesPlugin(),
    UnpluginTypia(),
    new ReanimatedPlugin(),
  ],
};
