<script>
import { useObjectStateStore } from '@/stores/ObjectStateStore'
import Markdown from 'vue3-markdown-it';

export default {
    components: {
        Markdown
    },
    setup() {
        const objectStateStore = useObjectStateStore()

        return {
            objectStateStore
        }
    }
}
</script>

<template>
    <div id="object-state-wrapper" class="hljs">
        <Markdown :source="objectStateStore.currentObjectMarkdown" />
    </div>
</template>

<style scoped>
div#object-state-wrapper {
    background-color: white;
    height: 100%;
    width: 100%;
    border-radius: 5px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
}
</style>