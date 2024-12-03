<script setup lang="ts">
// import type useVisu from '@/hooks/useVisu'

// const visu = inject<ReturnType<typeof useVisu>>('visu')

const Layer = defineAsyncComponent(() => import('../Layer/index.vue'))
</script>

<template>
  <div class="w-full h-full p-4">
    <Tab>
      <TabPane name="图层">
        <Layer />
      </TabPane>
    </Tab>
  </div>
</template>
