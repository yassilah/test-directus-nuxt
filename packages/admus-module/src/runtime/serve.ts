import { defineEventHandler, fromNodeMiddleware } from 'h3'
import { useRuntimeConfig } from 'nitropack/runtime'
import { withLeadingSlash } from 'ufo'

let app: Awaited<ReturnType<typeof getDirectusApp>> | undefined
/**
 * Cached app instance.
 */
export default defineEventHandler(async (event) => {
   const { public: { apiPath } } = useRuntimeConfig()
   app ??= await getDirectusApp()

   event.node.req.url = event.node.req.url?.replace(withLeadingSlash(apiPath), '')
   if (!event.node.req.url || !app) return
   return app(event)
})

/**
 * Returns the Directus API app wrapped as an H3 event handler. Initializes the app if it hasn't been created yet.
 */
async function getDirectusApp() {
   const { createApp } = await import('@directus/api')
   const { useEnv } = await import('@directus/env')
   const { config } = useRuntimeConfig().admus
   Object.assign(useEnv(), config)

   return fromNodeMiddleware(await createApp())
}
