import type { ServerResponse } from 'node:http'
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

      // Ensure headers are initialized for serverless environments
      patchResponseForServerless(event.node.res)

      return app(event)
   }))
})

/**
 * Patch ServerResponse to ensure headers work in serverless environments.
 * In AWS Lambda/Netlify Functions, the response object doesn't have headers properly initialized.
 */
function patchResponseForServerless(res: ServerResponse) {
   const ensureHeaders = (target: ServerResponse) => {
      // @ts-expect-error - accessing internal property
      if (!target._headers) {
         // @ts-expect-error - setting internal property
         target._headers = {}
      }
   }

   if (!res.getHeaders || typeof res.getHeaders !== 'function') {
      res.getHeaders = () => {
         ensureHeaders(res)
         // @ts-expect-error - accessing internal property
         return res._headers
      }
   }

   const originalGetHeader = res.getHeader?.bind(res)
   res.getHeader = function (name: string) {
      try {
         ensureHeaders(this)
         return originalGetHeader ? originalGetHeader(name) : undefined
      }
      catch {
         return undefined
      }
   }

   const originalSetHeader = res.setHeader?.bind(res)
   res.setHeader = function (name: string, value: number | string | readonly string[]) {
      try {
         ensureHeaders(this)
         // @ts-expect-error - accessing internal property
         this._headers[String(name).toLowerCase()] = value
         if (originalSetHeader) originalSetHeader(name, value)
         return this as ServerResponse
      }
      catch {
         return this as ServerResponse
      }
   }
}

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
