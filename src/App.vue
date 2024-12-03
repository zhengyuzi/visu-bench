<script setup lang="ts">
import useVisu from './hooks/useVisu'
import Layout from './layout/index.vue'
import Canvas from './parts/Canvas/index.vue'

const Toolbar = defineAsyncComponent(() => import('./parts/Toolbar/index.vue'))
const Aside = defineAsyncComponent(() => import('./parts/Aside/index.vue'))
const CanvasBar = defineAsyncComponent(() => import('./parts/CanvasBar/index.vue'))

const stageEl = ref<HTMLDivElement>()

const visu = useVisu(stageEl)

provide('visu', visu)
</script>

<template>
  <div class="w-screen h-screen overflow-hidden">
    <Layout>
      <template #canvas>
        <CanvasBar />
        <Canvas>
          <div ref="stageEl" class="w-full h-full" />
        </Canvas>
      </template>
      <template #toolbar>
        <Toolbar />
      </template>
      <template #aside>
        <Aside />
      </template>
    </Layout>
  </div>
</template>
