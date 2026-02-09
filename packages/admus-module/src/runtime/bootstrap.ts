/**
 * Bootstrap. directus app.
 * This implementation is a bit hacky because of the way the bootstrap command works:
 * - It calls process.exit() on completion, which we need to override to prevent the Nuxt process from exiting.
 * - It also destroys the database connection, which we need to prevent to keep the app running.
 */
export async function bootstrapDirectus() {
   const { default: bootstrap } = await import('@directus/api/cli/commands/bootstrap/index')
   const { default: getDatabase } = await import('@directus/api/database/index')

   const db = getDatabase()
   const originalDestroy = db.client.destroy
   db.client.destroy = () => null as never

   const originalExit = process.exit
   process.exit = () => null as never

   try {
      await bootstrap({})
   }
   finally {
      process.exit = originalExit
      db.client.destroy = originalDestroy
   }
}
