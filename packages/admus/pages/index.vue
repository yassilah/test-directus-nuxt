<script setup lang="ts">
import { readItems } from '@directus/sdk'

const { user, logout } = useAuth()
</script>

<template>
   <UContainer class="py-12">
      <div class="mb-8 flex items-center justify-between gap-4">
         <div>
            <h1 class="text-3xl font-semibold">
               Admus
            </h1>
            <p class="text-(--ui-text-muted)">
               Custom Directus admin, powered by Nuxt.
            </p>
         </div>

         <div class="flex items-center gap-2">
            <UButton
               v-if="user"
               to="/admin"
            >
               Open admin
            </UButton>
            <UButton
               v-else
               to="/login"
               color="primary"
            >
               Login
            </UButton>
            <UButton
               v-if="user"
               color="neutral"
               variant="soft"
               @click="logout"
            >
               Logout
            </UButton>
         </div>
      </div>

      <UCard>
         <template #header>
            <div class="flex items-center justify-between">
               <div class="space-y-1">
                  <p class="text-sm text-(--ui-text-muted)">
                     Session
                  </p>
                  <h2 class="text-xl font-semibold">
                     Current user
                  </h2>
               </div>
            </div>
         </template>

         <div
            v-if="user"
            class="space-y-2"
         >
            <p>
               <span class="text-muted">Email:</span>
               <span class="font-medium">{{ user?.email }}</span>
            </p>
            <p>
               <span class="text-muted">ID:</span>
               <span class="font-mono text-sm">{{ user?.id }}</span>
            </p>
         </div>

         <div
            v-else
            class="text-muted"
         >
            Not authenticated.
         </div>
      </UCard>
   </UContainer>
</template>
