import { ref } from 'vue'
import { defineStore } from 'pinia'
import * as jsYaml from 'js-yaml';

export const useObjectStateStore = defineStore('objectstate', {
    state: () => {
        const schemaText = ref('')
        const currentObject = ref({})

        return {
            schemaText,
            currentObject
        }
    },
    getters: {
        currentObjectMarkdown: (state) => `\`\`\`yaml\n${jsYaml.dump(state.currentObject)}\n\`\`\``
    }
});