import { randomBytes } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { useEnv } from '@directus/env'
import { addImports, addServerPlugin, addTypeTemplate, defineNuxtModule, updateRuntimeConfig } from '@nuxt/kit'
import defu from 'defu'
import { joinURL } from 'ufo'
import { copyDatabaseSeedsAfterBuild } from './helpers/seeds'
import { getTypesContent } from './helpers/types'
import { bootstrapDirectus } from './runtime/bootstrap'

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
         SERVE_APP: false,
      },
   }),
   async setup(options, nuxt) {
      if (nuxt.options.dev) {
         Object.assign(useEnv(), options.config)
         await bootstrapDirectus()
      }

      const { dst } = addTypeTemplate({
         filename: 'admus/types.d.ts',
         getContents: nuxt.options.dev ? getTypesContent : () => 'export type DirectusSchema = {}',
      })

      updateRuntimeConfig({
         admus: {
            config: options.config,
            accessToken: options.config.ADMIN_TOKEN || '',
         },
         public: {
            apiPath: options.apiPath,
            apiUrl: joinURL('http://localhost:3000', options.apiPath),
         },
      })

      addServerPlugin(fileURLToPath(import.meta.resolve('./runtime/serve')))

      addImports({
         name: 'useDirectus',
         from: fileURLToPath(import.meta.resolve('./runtime/useDirectus')),
      })

      nuxt.options.alias = defu(nuxt.options.alias, {
         '#admus/types': dst,
      })

      nuxt.options.typescript.hoist.push('@directus/sdk')

      copyDatabaseSeedsAfterBuild(nuxt)
   },
})
