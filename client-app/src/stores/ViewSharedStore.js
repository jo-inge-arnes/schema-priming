import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useViewSharedStore = defineStore('viewshared', () => {
    const disableInput = ref(true)

    return {disableInput}
});