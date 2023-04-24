<script>
import { ref } from 'vue'
import { useChatStore } from '@/stores/ChatStore'

export default {
    setup() {
        const chatStore = useChatStore()

        return {
            chatStore
        }
    },
    mounted() {

    }
}
</script>

<template>
    <div id="chat-wrapper">
        <div id="chat-messages">
            <div v-for="entry in chatStore.visibleChat" :class="{ 'chat-line user-line': entry.role == 'user', 'chat-line assistant-line': entry.role == 'assistant' }">
                {{ entry.content }}
            </div>
        </div>
        <div id="chat-input-container">
            <input type="text" id="chat-input"/>
        </div>
    </div>
</template>

<style scoped>
    #chat-wrapper {
        display: flex;
        flex-flow: column;
        height: 100%;
    }

    div#chat-messages {
        overflow-y: scroll;
        height: 100%;
        width: 100%;
        background-color: rgba(255, 255, 255, 0.4);
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        border-radius: 5px;
    }

    div.chat-line {
        width: auto;
        padding: 5px;
        margin: 5px;
        border-radius: 5px;
    }

    div.assistant-line {
        background-color: hsla(160, 50%, 85%, 1);
    }

    div.user-line {
        background-color: hsla(0, 0%, 90%, 1);
    }

    div#chat-input-container {
        height: auto;
        padding-top: 5px;
    }

    input#chat-input {
        height: 2rem;
        width: 100%;
        border-radius: 5px;
    }
</style>