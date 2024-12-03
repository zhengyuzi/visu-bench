<script setup lang="ts">
import { TabsIndicator, TabsList, TabsRoot, TabsTrigger } from 'radix-vue'

interface ITabPaneProps {
  props: {
    name: string
  }
}

const slots = defineSlots<{
  default: () => ITabPaneProps[]
}>()

const tabs = computed(() => slots.default().map(item => item.props))
</script>

<template>
  <TabsRoot
    :default-value="tabs[0].name"
  >
    <TabsList>
      <TabsIndicator />
      <TabsTrigger
        v-for="tab in tabs"
        :key="tab.name"
        :value="tab.name"
        class="select-none"
      >
        {{ tab.name }}
      </TabsTrigger>
    </TabsList>
    <slot />
  </TabsRoot>
</template>
