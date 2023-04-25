import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useChatStore } from '@/stores/ChatStore'
import { useViewSharedStore } from '@/stores/ViewSharedStore'
import { useObjectStateStore } from '@/stores/ObjectStateStore'
import { GptHttp } from '@/helpers/GptHttp';
import * as jsYaml from 'js-yaml';

export const useControllerStore = defineStore('controller', {
    state: () => {
        const apiKey = ref(import.meta.env.VITE_OPENAI_API_KEY)
        const orgId = ref(import.meta.env.VITE_OPENAI_ORG_ID)
        const temp = ref(0.05)
        // const version = ref('gpt-3.5-turbo')
        const version = ref('gpt-4')
        const gptHttp = ref(new GptHttp(apiKey.value, orgId.value, version.value, temp.value))

        return {
            gptHttp,
            apiKey,
            orgId,
            temp,
            version
        }
    },
    actions: {
        async prompt(newPrompt) {
            const viewSharedState = useViewSharedStore()
            const chatStore = useChatStore()
            const objectStateStore = useObjectStateStore()

            viewSharedState.disableInput = true;

            let promptObj = { role: 'user', content: newPrompt }
            chatStore.visibleChat.push(promptObj)

            // Here words that can bypass the rules could be removed
            // promptObj.content.replace(/please/ig, ' ')

            chatStore.rawChat.push(promptObj)

            // If the total length of the conversation array is longer than 7, then
            // keep the only the second message and the last five messages. This is to
            // reduce the number of tokens in the ChatGPT request. There is no reason why
            // older messages should be included in the request in our use case. The
            // first message is a system message that will be updated, so we remove that.
            if (chatStore.rawChat.length > 7) {
                let systemMessageText = chatStore.getSystemMessageText(
                    objectStateStore.schemaText,
                    objectStateStore.currentObject
                );
                let systemMessageObj = { role: 'system', content: systemMessageText }
                let truncatedConversation = [systemMessageObj];
                truncatedConversation = truncatedConversation.concat(
                    chatStore.rawChat.slice(1, 2));
                truncatedConversation = truncatedConversation.concat(
                    chatStore.rawChat.slice(-5));
                let originalLen = chatStore.rawChat.length
                Array.prototype.push.apply(chatStore.rawChat, truncatedConversation);
                chatStore.rawChat.splice(0, originalLen);
            }

            this.gptHttp.post(chatStore.rawChat).then(function (response) {
                let completion = response.data.choices[0].message.content;
                let newAssistEntry = {
                    role: 'assistant',
                    content: completion
                };

                const yamlRegex = /\s*?```\n(.*?)\s*?\n```/ms;
                let yamlMatches = completion.match(yamlRegex);

                if (Array.isArray(yamlMatches) && yamlMatches.length > 1) {
                    try {
                        objectStateStore.currentObject = jsYaml.load(yamlMatches[1]);
                    } catch (err) {
                        console.error(err);
                        console.error(completion);
                        console.error(yamlMatches[1]);
                        throw err;
                    }
                }

                chatStore.rawChat.push(newAssistEntry);

                let newAssistEntryVisible = {
                    role: 'assistant',
                    content: newAssistEntry.content
                        .replace(/[\.\!][,"'a-zA-Z0-9\s]+?:\s*?(?=```)/ms, '.')
                        .replace(yamlRegex, '')
                };
                chatStore.visibleChat.push(newAssistEntryVisible);
            }).catch(function (err) {
                console.error(err);
            }).finally(function () {
                viewSharedState.disableInput = false;
            });
        },
        async initChat() {
            const viewSharedState = useViewSharedStore()
            const chatStore = useChatStore()
            const objectStateStore = useObjectStateStore()

            let systemMessageText = chatStore.getSystemMessageText(
                objectStateStore.schemaText,
                objectStateStore.currentObject
            );

            chatStore.rawChat.push({ role: 'system', content: systemMessageText })

            this.gptHttp.post(chatStore.rawChat).then(function (response) {
                let completion = response.data.choices[0].message.content;
                let newAssistEntry = {
                    role: 'assistant',
                    content: completion
                };

                const yamlRegex = /\s*?```\n(.*?)\s*?\n```/ms;
                chatStore.rawChat.push(newAssistEntry);

                let newAssistEntryVisible = {
                    role: 'assistant',
                    content: newAssistEntry.content
                        .replace(/[\.\!][,"'a-zA-Z0-9\s]+?:\s*?(?=```)/ms, '.')
                        .replace(yamlRegex, '')
                };
                chatStore.visibleChat.push(newAssistEntryVisible);
            }).catch(function (err) {
                console.error(err);
            }).finally(function () {
                viewSharedState.disableInput = false;
            });
        }
    }
});