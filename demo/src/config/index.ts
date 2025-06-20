import { Config } from './types';
// @ts-ignore
let env: any = import.meta.env;

export const config: Config = {
  ionToken: env.VITE_ION_TOKEN,
  view: JSON.parse(env.VITE_VIEW),
};

export default config;
