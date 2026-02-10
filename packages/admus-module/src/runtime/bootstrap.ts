import type { Nuxt } from 'nuxt/schema'

/**
 * Bootstrap. directus app.
 * This implementation is a bit hacky because of the way the bootstrap command works:
 * - It calls process.exit() on completion, which we need to override to prevent the Nuxt process from exiting.
 * - It also destroys the database connection, which we need to prevent to keep the app running.
 */
export async function bootstrapDirectus(nuxt: Nuxt) {
   const { default: bootstrap } = await import('@directus/api/cli/commands/bootstrap/index')
   const { default: getDatabase } = await import('@directus/api/database/index')

   const db = getDatabase()
   const originalDestroy = db.client.destroy.bind(db.client)
   const originalExit = process.exit.bind(process)

   db.client.destroy = () => null as never
   process.exit = () => null as never

   nuxt.hooks.hookOnce('close', () => {
      db.client.destroy()
   })

   try {
      await bootstrap({})
   }
   finally {
      db.client.destroy = originalDestroy
      process.exit = originalExit
   }
}
