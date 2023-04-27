<script>
import { useChatStore } from '@/stores/ChatStore'
import { useViewSharedStore } from '@/stores/ViewSharedStore'
import { useControllerStore } from '@/stores/ControllerStore'
import { ref, nextTick, onMounted } from 'vue'
import Markdown from 'vue3-markdown-it'

export default {
    components: {
        Markdown
    },
    setup() {
        const chatStore = useChatStore()
        const viewSharedStore = useViewSharedStore()
        const controllerStore = useControllerStore()
        const chatMessages = ref(null)
        const chatInput = ref(null)

        const msgEntered = async (event) => {
            let msg = chatInput.value.value.trim()
            chatInput.value.value = ''

            if (msg.length > 0) {
                viewSharedStore.disableInput = true;
                await controllerStore.prompt(msg)
                await controllerStore.validate()
                await nextTick()
            }

            if (chatMessages.value) {
                chatMessages.value.scrollTop = chatMessages.value.scrollHeight
            }

            chatInput.value.focus()

            return
        }

        onMounted(() => {
            controllerStore.initChat()
        })

        return {
            chatStore,
            viewSharedStore,
            chatMessages,
            chatInput,
            msgEntered
        };
    }
}
</script>

<template>
    <div id="chat-wrapper">
        <div ref="chatMessages" id="chat-messages">
            <div v-for="entry in chatStore.visibleChat"
                :class="{ 'chat-line user-line': entry.role == 'user', 'chat-line assistant-line': entry.role == 'assistant' }">
                <Markdown :source="entry.content" />
            </div>
        </div>
        <div id="chat-input-container">
            <input type="text" id="chat-input" ref="chatInput" @keypress.enter="msgEntered"
                :disabled="viewSharedStore.disableInput" placeholder="Type your message..." autocomplete="off" />
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
