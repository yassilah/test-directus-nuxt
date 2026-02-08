<script setup lang="ts">
import { z } from 'zod'

const { login } = useAuth()

const state = reactive({
   email: '',
   password: '',
})

const schema = z.object({
   email: z.email(),
   password: z.string().min(6),
})

const errors = ref('')
const pending = ref(false)

async function onSubmit() {
   try {
      pending.value = true
      errors.value = ''
      await login(state)
      await navigateTo('/admin')
   }
   catch (e) {
      errors.value = String(e)
   }
   finally {
      pending.value = false
   }
}
</script>

<template>
   <UForm
      :state
      :schema
      @submit.prevent="onSubmit"
   >
      <UFormField
         label="Email"
         name="email"
      >
         <UInput
            v-model="state.email"
            type="email"
         />
      </UFormField>

      <UFormField
         label="Password"
         name="password"
      >
         <UInput
            v-model="state.password"
            type="password"
         />
      </UFormField>

      <UButton
         type="submit"
         block
         :loading="pending"
      >
         Sign in
      </UButton>
   </UForm>
</template>
