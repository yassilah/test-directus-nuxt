import { randomBytes } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { addImports, addServerPlugin, addTemplate, addTypeTemplate, defineNuxtModule, resolveModule, updateRuntimeConfig } from '@nuxt/kit'
import { defu } from 'defu'
import { joinURL } from 'ufo'

export interface ModuleOptions {
   apiPath: string
   config: Record<string, unknown>
}

export default defineNuxtModule<ModuleOptions>({
   meta: {
      name: '@admus/nuxt-module',
      configKey: 'admus',
   },
   defaults: nuxt => ({
      apiPath: process.env.NUXT_DIRECTUS_PATH || 'directus',
      config: {
         PORT: process.env.PORT || 3001,
         DB_CLIENT: process.env.DB_CLIENT || 'sqlite3',
         DB_FILENAME: process.env.DB_FILENAME || joinURL(nuxt.options.buildDir, 'db.sqlite'),
         SECRET: process.env.SECRET || randomBytes(32).toString('base64'),
         ADMIN_TOKEN: process.env.ADMIN_TOKEN || 'admin-token',
         ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@example.com',
         ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'password',
      },
   }),
   async setup(options, nuxt) {
      nuxt.options.typescript.hoist.push('@directus/sdk')

      const { dst: configPath } = addTemplate({
         filename: 'admus/directus-config.json',
         write: true,
         getContents: () => JSON.stringify({
            ...options.config,
            SERVE_APP: false,
            PUBLIC_URL: 'http://localhost:3000',
         }),
      })

      addImports({
         name: 'useDirectus',
         from: fileURLToPath(import.meta.resolve('./runtime/useDirectus')),
      })

      nuxt.options.alias = defu(nuxt.options.alias, {
         '#directus/types': './directus/types.d.ts',
      })

      const { dst: typesPath } = addTypeTemplate({
         filename: 'directus/types.d.ts',
         getContents: () => `export type Schema = {}`,
      })

      addServerPlugin(fileURLToPath(import.meta.resolve('./runtime/plugin')))

      updateRuntimeConfig({
         admus: {
            configPath,
            cliPath: resolveModule('@directus/api/cli/run.js'),
            accessToken: options.config.ADMIN_TOKEN || '',
            typesPath,
         },
         public: {
            apiPath: options.apiPath,
            apiUrl: joinURL('http://localhost:3000', options.apiPath),
         },
      })
   },
})
