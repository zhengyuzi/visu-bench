<script setup lang="ts">
import type useVisu from '@/hooks/useVisu'
import Konva from 'konva'

const visu = inject<ReturnType<typeof useVisu>>('visu')

function drop(e: any) {
  dragover(e)
  const files = e.dataTransfer.files as FileList

  if (files?.length) {
    // console.log(files)
    for (const file of files) {
      const url = URL.createObjectURL(file)
      loadImage(url)
    }
  }
}

function dragover(e: any) {
  e.preventDefault()
  e.stopPropagation()
}

function loadImage(url: string) {
  const visuWorkspace = visu?.getPlugin('VisuPluginWorkspace')
  const size = visu?.getCanvasSize()

  const image = new Image()

  image.onload = function () {
    const { width, height } = handleImageSize(image.width, image.height, size?.width || 0, size?.height || 0)

    const config = {
      image,
      x: 0,
      y: 0,
      width,
      height,
    }

    const node = new Konva.Image(config)

    visuWorkspace?.addNode(node)
  }

  image.src = url
}

function handleImageSize(imgW: number, imgH: number, canvasW: number, canvasH: number) {
  const imgAspectRatio = imgW / imgH
  const canvasAspectRatio = canvasW / canvasH

  if (imgAspectRatio > canvasAspectRatio) {
    const scale = canvasW / imgW
    return {
      width: canvasW,
      height: imgH * scale,
    }
  }
  else {
    const scale = canvasH / imgH
    return {
      width: imgW * scale,
      height: canvasH,
    }
  }
}
</script>

<template>
  <div class="w-full h-full" @dragover="dragover" @drop="drop">
    <slot />
  </div>
</template>
