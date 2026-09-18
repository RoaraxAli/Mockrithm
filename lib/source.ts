import { docs } from 'collections/server';
import { loader } from 'fumadocs-core/source';

export const source = loader({
  baseUrl: '/documentation',
  source: docs.toFumadocsSource(),
});
