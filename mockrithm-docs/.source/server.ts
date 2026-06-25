// @ts-nocheck
import * as __fd_glob_4 from "../content/docs/user/index.mdx?collection=docs"
import * as __fd_glob_3 from "../content/docs/dev/index.mdx?collection=docs"
import { default as __fd_glob_2 } from "../content/docs/user/meta.json?collection=docs"
import { default as __fd_glob_1 } from "../content/docs/dev/meta.json?collection=docs"
import { default as __fd_glob_0 } from "../content/docs/meta.json?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.docs("docs", "content/docs", {"meta.json": __fd_glob_0, "dev/meta.json": __fd_glob_1, "user/meta.json": __fd_glob_2, }, {"dev/index.mdx": __fd_glob_3, "user/index.mdx": __fd_glob_4, });