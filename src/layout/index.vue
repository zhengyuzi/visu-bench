<script setup lang="ts">
import { homepage } from '../../package.json'
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <div class="h-64px border-b-2 flex justify-between items-center px-4">
      <div class="flex items-center space-x-4 select-none">
        <span class="font-serif text-indigo-500 font-bold text-2xl">Visu Bench</span>
      </div>
      <div>
        <a
          target="_blank"
          :href="homepage"
          class="cursor-pointer"
        >
          <i class="i-mdi-github text-3xl" />
        </a>
      </div>
    </div>
    <div class="relative w-full h-[calc(100%-64px)] flex">
      <div class="w-50px h-full border-r-2">
        <slot name="toolbar" />
      </div>
      <div class="relative w-[calc(100%-350px)] h-full bg-stone-100">
        <slot name="canvas" />
      </div>
      <div class="relative w-300px border-l-2">
        <slot name="aside" />
      </div>
    </div>
  </div>
</template>
