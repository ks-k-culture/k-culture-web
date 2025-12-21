import { defineConfig } from 'orval';

export default defineConfig({
  petstore: {
    output: {
      mode: 'tags-split',
      target: 'src/petstore.ts',
      schemas: 'src/model',
      client: 'react-query',
      mock: true,
      override: {
        mutator: {
          path: './lib/fetcher.ts',
          name: 'customFetch',
        },
      },
    },
    input: {
      target: './docs/api/openapi.yaml',
    },
  },
});
