// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"dev/index.mdx": () => import("../content/docs/dev/index.mdx?collection=docs"), "user/index.mdx": () => import("../content/docs/user/index.mdx?collection=docs"), }),
};
export default browserCollections;