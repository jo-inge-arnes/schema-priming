<script setup>
import { RouterLink, RouterView } from 'vue-router'
import ChatView from './components/ChatView.vue'
import ObjectView from './components/ObjectView.vue'
</script>

<template>
  <div id="panel-wrapper">
    <div id="left-panel" class="panel">
      <ObjectView />
    </div>
    <div id="right-panel" class="panel">
      <ChatView />
    </div>
  </div>
</template>

<style scoped>
  div#panel-wrapper {
    width: 100%;
    height: 100%;
  }

  div.panel {
    height: 100%;
    padding: 5px;
  }

  div#left-panel {
    float: left;
    width: 50%;
  }

  div#right-panel {
    float: right;
    width: 50%;
  }
</style>
