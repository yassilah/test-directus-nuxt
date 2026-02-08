<script setup lang="ts">
const router = useRouter()
const { user, register } = useAuth()

const state = reactive({
   first_name: '',
   last_name: '',
   email: '',
   password: '',
})

const error = ref('')

if (user.value) {
   await router.push('/admin')
}

async function onSubmit() {
   error.value = ''

   try {
      await register({
         email: state.email,
         password: state.password,
         first_name: state.first_name,
         last_name: state.last_name,
      })
      await router.push('/admin')
   }
   catch {
      error.value = 'Registration failed. Please try again.'
   }
}
</script>

<template>
   <UContainer class="py-16">
      <div class="mx-auto w-full max-w-md space-y-6">
         <div class="space-y-2 text-center">
            <h1 class="text-3xl font-semibold">
               Register
            </h1>
            <p class="text-muted">
               Create an account for this workspace.
            </p>
         </div>

         <UCard>
            <UAlert
               v-if="error"
               class="mb-4"
               color="error"
               variant="soft"
               :title="error"
            />

            <UForm
               :state="state"
               class="space-y-4"
               @submit.prevent="onSubmit"
            >
               <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <UFormGroup
                     label="First name"
                     name="first_name"
                  >
                     <UInput
                        v-model="state.first_name"
                        placeholder="Jane"
                     />
                  </UFormGroup>

                  <UFormGroup
                     label="Last name"
                     name="last_name"
                  >
                     <UInput
                        v-model="state.last_name"
                        placeholder="Doe"
                     />
                  </UFormGroup>
               </div>

               <UFormGroup
                  label="Email"
                  name="email"
               >
                  <UInput
                     v-model="state.email"
                     placeholder="you@example.com"
                     type="email"
                  />
               </UFormGroup>

               <UFormGroup
                  label="Password"
                  name="password"
               >
                  <UInput
                     v-model="state.password"
                     placeholder="••••••••"
                     type="password"
                  />
               </UFormGroup>

               <UButton
                  type="submit"
                  block
                  :loading="pending"
               >
                  Create account
               </UButton>
            </UForm>

            <div class="mt-6 text-center text-sm">
               <span class="text-muted">Already have an account?</span>
               <NuxtLink
                  class="ml-1 font-medium text-primary hover:underline"
                  to="/login"
               >
                  Sign in
               </NuxtLink>
            </div>
         </UCard>
      </div>
   </UContainer>
</template>
