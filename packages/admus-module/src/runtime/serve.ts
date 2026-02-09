import { eventHandler, fromNodeMiddleware } from 'h3'
import { defineNitroPlugin, useRuntimeConfig } from 'nitropack/runtime'
import { joinURL, withLeadingSlash } from 'ufo'

let app: Awaited<ReturnType<typeof getDirectusApp>> | undefined

/**
 * Cached app instance.
 */

export default defineNitroPlugin(async (nitro) => {
   const { public: { apiPath } } = useRuntimeConfig()
   app ??= await getDirectusApp()

   nitro.router.add(withLeadingSlash(joinURL(apiPath, '**')), eventHandler((event) => {
      event.node.req.url = event.node.req.url?.replace(withLeadingSlash(apiPath), '')
      if (!event.node.req.url || !app) return
      return app(event)
   }))
})

/**
 * Returns the Directus API app wrapped as an H3 event handler. Initializes the app if it hasn't been created yet.
 */
async function getDirectusApp() {
   const { createApp } = await import('@directus/api')
   const { useEnv } = await import('@directus/env')
   const { config } = useRuntimeConfig().admus
   Object.assign(useEnv(), config)

   if (!import.meta.dev) {
      const { bootstrapDirectus } = await import('./bootstrap')
      await bootstrapDirectus()
   }

   return fromNodeMiddleware(await createApp())
}
