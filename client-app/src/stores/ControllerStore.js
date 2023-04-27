import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useChatStore } from '@/stores/ChatStore'
import { useViewSharedStore } from '@/stores/ViewSharedStore'
import { useObjectStateStore } from '@/stores/ObjectStateStore'
import { GptHttp } from '@/helpers/GptHttp';
import * as jsYaml from 'js-yaml';
import { BackendHttp } from '../helpers/BackendHttp'

export const useControllerStore = defineStore('controller', {
    state: () => {
        const apiKey = ref(import.meta.env.VITE_OPENAI_API_KEY)
        const orgId = ref(import.meta.env.VITE_OPENAI_ORG_ID)
        const temp = ref(parseFloat(import.meta.env.VITE_OPENAI_TEMP))
        const top_p = ref(parseFloat(import.meta.env.VITE_OPENAI_TOP_P))
        const version = ref(import.meta.env.VITE_OPENAI_MODEL_VERSION)
        const gptHttp = ref(new GptHttp(apiKey.value, orgId.value, version.value, temp.value, top_p.value))
        const backendHttp = ref(new BackendHttp(import.meta.env.VITE_BACKEND_BASE))

        return {
            gptHttp,
            backendHttp,
            apiKey,
            orgId,
            temp,
            top_p,
            version
        }
    },
    actions: {
        async validate() {
            const objectStateStore = useObjectStateStore()
            let that = this

            return this.backendHttp.validate(objectStateStore.currentObject).then(function (response) {
                if (!response.data.success) {
                    that.prompt(
                        `The YAML did not validate, either correct the mistake or roll back the update! Here is the error message:\n\n${response.data.msg}`)
                }
            }).catch(function (err) {
                console.error(err);
            });
        },
        async prompt(newPrompt) {
            const viewSharedState = useViewSharedStore()
            const chatStore = useChatStore()
            const objectStateStore = useObjectStateStore()

            viewSharedState.disableInput = true;

            let visibleNewPrompt = newPrompt
            
            if (visibleNewPrompt.startsWith('The YAML did not validate')) {
                visibleNewPrompt = '*(The assistant made a mistake)*'
            }

            chatStore.visibleChat.push({ role: 'user', content: visibleNewPrompt })

            // Here words that can bypass the rules could be removed
            // promptObj.content.replace(/please/ig, ' ')

            chatStore.rawChat.push({ role: 'user', content: newPrompt })

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

            return this.gptHttp.post(chatStore.rawChat).then(function (response) {
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
                        chatStore.completionErrorMessage =
                            `The YAML did not validate, either correct the mistake or roll back the update! Here is the error message:\n\n${err.message}`
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

            await this.backendHttp.schemaAndEmpty().then(function (response) {
                objectStateStore.schemaText = response.data.schema
                objectStateStore.currentObject = response.data.empty
            }).catch(function (err) {
                console.error(err);
            });

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