import type { Nuxt } from 'nuxt/schema'
import { cpSync } from 'node:fs'
import { resolve } from 'node:path'
import { resolveModule } from '@nuxt/kit'
import defu from 'defu'
import { joinURL } from 'ufo'

/**
 * Copy the Directus database seeds to the Nitro output directory after the build is complete.
 */
export function copyDatabaseSeedsAfterBuild(nuxt: Nuxt) {
   // nuxt.hook('nitro:config', (config) => {
   //    config.externals = defu(config.externals, {
   //       traceInclude: [resolveModule('@rollup/rollup-linux-x64-gnu')],
   //    })
   // })

   // nuxt.hook('nitro:init', (nitro) => {
   //    nitro.hooks.hook('compiled', () => {
   //       cpSync(
   //          resolve(resolveModule('@directus/api'), '../database/seeds'),
   //          joinURL(nitro.options.output.serverDir, 'node_modules/@directus/api/dist/database/seeds'),
   //          { recursive: true },
   //       )
   //    })
   // })
}
