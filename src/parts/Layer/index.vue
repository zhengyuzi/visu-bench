<script setup lang="ts">
import type useVisu from '@/hooks/useVisu'
import type { VisuWorkspaceEvent } from '@visu/plugins'
import type { Group } from 'konva/lib/Group'
import type { Shape, ShapeConfig } from 'konva/lib/Shape'
import { signal } from '@visu/plugins'
import { WORKSPACE } from '@visu/types'

interface INodes {
  id: string
  name: string
  index: number
  dataUrl: string
}

const nodes = ref<INodes[]>([])

const visu = inject<ReturnType<typeof useVisu>>('visu')

const visuWorkspace = visu?.getPlugin('VisuPluginWorkspace')

const visuZoom = visu?.getPlugin('VisuPluginZoom')

const nameIndex = ref(1)

onMounted(() => {
  const children = visuWorkspace?.nodes || []
  nodes.value = children.map(node => handleNode(node)).sort((a, b) => b.index - a.index)
  signal.on('visu-workspace', handleVisuWorkspace)
})

function handleVisuWorkspace(e: VisuWorkspaceEvent) {
  if (e.type === 'add') {
    const node = handleNode(e.node)
    nodes.value.unshift(node)
  }
}

function handleNode(node: Group | Shape<ShapeConfig>) {
  const size = visu?.getCanvasSize()
  const position = visu?.getCanvasPosition()

  return {
    id: node.id(),
    name: handleRename(node.id(), node.name()),
    index: node.zIndex(),
    dataUrl: node.toDataURL({
      x: position?.x,
      y: position?.y,
      width: (size?.width || 0) * (visuZoom?.zoom || 1),
      height: (size?.height || 0) * (visuZoom?.zoom || 1),
    }),
  }
}

/**
 * Rename the node
 */
function handleRename(id: string, name?: string) {
  const nodeAttr = nodes.value.find(n => n.id === id)
  const node = visuWorkspace?.getNode(id)

  let rename = name

  if (!rename) {
    rename = `未命名${nameIndex.value}`
    nameIndex.value += 1
  }
  else if (rename === WORKSPACE.CANVAS) {
    rename = '画布'
  }

  nodeAttr && (nodeAttr.name = rename)
  node?.setAttr('name', rename)

  return rename
}

/**
 * Hide node
 * @param id
 */
function handleNodeHide(id: string) {
  visuWorkspace?.hideNode(id)
}

/**
 * Show node
 * @param id
 */
function handleNodeShow(id: string) {
  visuWorkspace?.showNode(id)
}
</script>

<template>
  <div class="flex flex-col space-y-2 py-2">
    <div
      v-for="node in nodes"
      :key="node.id"
      class="flex items-center space-x-4 bg-gray-100 p-2 rounded-sm cursor-pointer"
    >
      <Checkbox>
        <template #checked-icon>
          <i
            class="i-lucide-eye"
            @click="() => handleNodeHide(node.id)"
          />
        </template>
        <template #unchecked-icon>
          <i
            class="i-lucide-eye-off"
            @click="() => handleNodeShow(node.id)"
          />
        </template>
      </Checkbox>
      <img
        class="w-60px select-none bg-black-white-10"
        style="-webkit-user-drag: none;"
        :src="node.dataUrl"
        :alt="node.name"
      >
      <Editable
        class="text-xs break-all line-clamp-1"
        :default-text="node.name"
        :placeholder="node.name"
        @submit="(name) => handleRename(node.id, name)"
      />
    </div>
  </div>
</template>
