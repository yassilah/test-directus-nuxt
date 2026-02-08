import { exec } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { promisify } from 'node:util'
import { eventHandler, fromNodeMiddleware } from 'h3'
import { defineNitroPlugin, useNitroApp, useRuntimeConfig } from 'nitropack/runtime'
import { joinURL } from 'ufo'

export default defineNitroPlugin(() => {
   initialize()
})

/**
 * Initializes the Directus API and sets up the Nitro route to handle API requests
 */
async function initialize() {
   const nitro = useNitroApp()
   const { admus: { configPath, cliPath, accessToken, typesPath }, public: { apiPath, apiUrl } } = useRuntimeConfig()

   process.env.CONFIG_PATH = configPath

   console.log('CONFIG', readFileSync(configPath, 'utf-8'))

   const execPromise = promisify(exec)
   await execPromise(`node ${cliPath} bootstrap`)
   const { createApp } = await import('@directus/api')
   const app = await createApp()
   const handler = fromNodeMiddleware(app)

   nitro.router.add(`/${apiPath}/**`, eventHandler((event) => {
      if (!event.node.req.url) return
      event.node.req.url = event.node.req.url.replace(`/${apiPath}`, '') || '/'
      return handler(event)
   }))

   if (import.meta.dev) {
      await waitForDirectus(apiUrl)

      const { generateDirectusTypes } = await import('directus-sdk-typegen')
      await generateDirectusTypes({
         directusUrl: apiUrl,
         outputPath: typesPath,
         directusToken: accessToken,
      })
   }
}

async function waitForDirectus(url: string, retries = 10, delay = 3000): Promise<void> {
   for (let i = 0; i < retries; i++) {
      const response = await fetch(joinURL(url, 'server/health'))
      if (response.ok) return
      await new Promise(resolve => setTimeout(resolve, delay))
   }
   throw new Error('Directus did not become available within the expected time.')
}
