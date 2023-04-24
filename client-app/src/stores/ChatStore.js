import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useChatStore = defineStore('chat', () => {
    const visibleChat = ref([{role: 'user', content: 'Hei'}, {role: 'assistant', content: 'Hadet'}])
    const rawChat = ref([])

    return {visibleChat, rawChat}
});