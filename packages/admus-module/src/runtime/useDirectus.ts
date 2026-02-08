import type { Schema } from '#directus/types'
import { useRequestHeaders, useRuntimeConfig } from '#app'
import { authentication, createDirectus, rest } from '@directus/sdk'

export function useDirectus() {
   const { apiUrl } = useRuntimeConfig().public
   const headers = useRequestHeaders()

   return createDirectus<Schema>(apiUrl, {
      globals: {
         fetch: $fetch.create({
            headers,
         }),
      },
   }).with(authentication('session')).with(rest())
}
