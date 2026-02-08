import type { AsyncData } from '#app'

export function customAsyncData<O extends AsyncData<T, E>, T, E, U extends object>(instance: O, obj: U) {
   /**
    * Enhanced promise with helpers.
    */
   const newPromise = new Promise<Instance<T, E> & U>((resolve) => {
      instance.execute().then(() => {
         resolve(Object.assign({}, instance, obj))
      })
   })

   return Object.assign(newPromise, Object.assign(instance, obj))
}

type Instance<T, E> = AsyncData<T, E> extends Promise<infer U> ? U : never
