import { getSnapshot } from '@directus/api/utils/get-snapshot'
import { generateTypesFromSnapshot } from '@ikerin/directus-typegen'

/**
 * Fetches the OpenAPI spec from the Directus app, transforms it, and returns the generated TypeScript types as a string.
 */
export async function getTypesContent() {
   const snapshot = await getSnapshot()

   return generateTypesFromSnapshot(snapshot)
}
