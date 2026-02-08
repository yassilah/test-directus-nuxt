<script setup lang="ts">
definePageMeta({
   middleware: ['auth'],
})

const { user, logout, pending } = useAuth()
</script>

<template>
   <UContainer class="py-10">
      <div class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
         <div class="space-y-1">
            <h1 class="text-3xl font-semibold">
               Admin Dashboard
            </h1>
            <p class="text-muted">
               Signed in as <span class="font-medium">{{ user?.email }}</span>
            </p>
         </div>

         <UButton
            color="neutral"
            variant="soft"
            :loading="pending"
            @click="logout"
         >
            Logout
         </UButton>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
         <UCard>
            <template #header>
               <h2 class="text-lg font-semibold">
                  Collections
               </h2>
            </template>
            <p class="text-muted">
               Browse and manage your content models.
            </p>
         </UCard>

         <UCard>
            <template #header>
               <h2 class="text-lg font-semibold">
                  Users & Roles
               </h2>
            </template>
            <p class="text-muted">
               Invite users and configure permissions.
            </p>
         </UCard>

         <UCard>
            <template #header>
               <h2 class="text-lg font-semibold">
                  Flows
               </h2>
            </template>
            <p class="text-muted">
               Automate processes with triggers and operations.
            </p>
         </UCard>
      </div>

      <UCard class="mt-6">
         <template #header>
            <h2 class="text-lg font-semibold">
               Quick actions
            </h2>
         </template>

         <div class="flex flex-wrap gap-2">
            <UButton
               to="/"
               variant="soft"
               color="neutral"
            >
               Home
            </UButton>
            <UButton
               to="/directus"
               variant="ghost"
               color="neutral"
            >
               Directus (raw)
            </UButton>
         </div>
      </UCard>
   </UContainer>
</template>
