<script setup lang="ts">
import type useVisu from '@/hooks/useVisu'
import { signal } from '@visu/plugins'

const visu = inject<ReturnType<typeof useVisu>>('visu')

const visuResize = visu?.getPlugin('VisuPluginResize')

const visuZoom = visu?.getPlugin('VisuPluginZoom')

const dataUrl = ref('')

onMounted(() => {
  handleGetThumbnail()

  signal.on('*', () => handleGetThumbnail())
})

function handleGetThumbnail() {
  dataUrl.value = visu?.getThumbnail() || ''
}

function handlePositionRestore() {
  const size = visu?.getStageSize()

  if (size) {
    const { width, height } = size
    visuResize?.viewportCenter(width, height)
    visuZoom?.autoZoom(width, height)
  }
}
</script>

<template>
  <div class="w-full absolute z-1001 bottom-4 pointer-events-none">
    <div class="flex justify-between items-end">
      <div class="ml-10">
        <button class="pointer-events-auto" @click="handlePositionRestore">
          还原
        </button>
      </div>
      <div class="mr-4 border-4 border-indigo-500 border-opacity-30 hover:(border-opacity-100)">
        <img
          class="max-w-15vw max-h-20vh select-none bg-black-white-10 pointer-events-auto"
          style="-webkit-user-drag: none;"
          :src="dataUrl"
          alt="thumbnail"
        >
      </div>
    </div>
  </div>
</template>
