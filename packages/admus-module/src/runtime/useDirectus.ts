import type { DirectusSchema } from '#admus/types'
import { useRequestHeaders, useRuntimeConfig } from '#app'
import { authentication, createDirectus, rest } from '@directus/sdk'

export function useDirectus() {
   const { apiUrl } = useRuntimeConfig().public
   const headers = useRequestHeaders()

   return createDirectus<DirectusSchema>(apiUrl, {
      globals: {
         fetch: $fetch.create({
            headers,
         }),
      },
   }).with(authentication('session')).with(rest())
}
