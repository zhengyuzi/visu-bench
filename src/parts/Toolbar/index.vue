<script setup lang="ts">
import type useVisu from '@/hooks/useVisu'
import { VisuPluginDrag, VisuPluginSelection } from '@visu/plugins'

const visu = inject<ReturnType<typeof useVisu>>('visu')

const currentIndex = ref(0)

const tools = [
  {
    name: '移动',
    iconName: 'i-mage-mouse-pointer',
    bindEvent: () => openSelection(),
    unBindEvent: () => closeSelection(),
  },
  {
    name: '拖动',
    iconName: 'i-clarity-cursor-hand-open-line',
    bindEvent: () => openDrag(),
    unBindEvent: () => closeDrag(),
  },
]

/**
 * Close the previous tool event and open the selected tool event
 * @param index
 */
function handleSelectTool(index: number) {
  // Ignore clicking the current tool
  if (currentIndex.value !== index) {
    const tool = tools[index]
    const lastTool = tools[currentIndex.value]

    lastTool.unBindEvent()
    tool.bindEvent()

    currentIndex.value = index
  }
}

function openDrag() {
  visu?.use(VisuPluginDrag)
}

function closeDrag() {
  visu?.unuse('VisuPluginDrag')
}

function openSelection() {
  visu?.use(VisuPluginSelection)
}

function closeSelection() {
  visu?.unuse('VisuPluginSelection')
}
</script>

<template>
  <div class="w-full h-full flex flex-col items-center space-y-2 py-2">
    <button
      v-for="(tool, index) in tools"
      :key="tool.name"
      class="relative cursor-pointer p-1 rounded active:(scale-90)"
      :class="
        index === currentIndex
          ? 'bg-indigo-500'
          : ''
      "
      :title="tool.name"
      @click="() => handleSelectTool(index)"
    >
      <i
        class="flex text-xl"
        :class="[tool.iconName, index === currentIndex ? 'text-gray-100' : 'text-gray-600']"
      />
    </button>
  </div>
</template>
