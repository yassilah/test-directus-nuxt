import type { LocalLoginPayload } from '@directus/sdk'
import { useDirectus } from '#imports'
import { login as directusLogin, logout as directusLogout, readMe, registerUser } from '@directus/sdk'

export function useAuth() {
   /**
    * Composable to handle authentication with Directus
    */
   const directus = useDirectus()

   /**
    * The currently authenticated user
    */
   const userInstance = useAsyncData('user', () => {
      return directus.request(readMe())
   })

   /**
    * Login a user with email and password
    */
   async function login(data: LocalLoginPayload) {
      await directus.request(directusLogin(data, { mode: 'session' }))
      await userInstance.refresh()
   }

   /**
    * Logout the currently authenticated user
    */
   async function logout() {
      await directus.request(directusLogout({ mode: 'session' }))
   }

   /**
    * Register a new user
    */
   async function register(payload: LocalLoginPayload) {
      await directus.request(registerUser(payload.email, payload.password))
      await userInstance.refresh()
   }

   return customAsyncData(userInstance, {
      user: computed(() => userInstance.data.value || null),
      login,
      logout,
      register,
   })
}
