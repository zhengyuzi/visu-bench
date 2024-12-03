<script setup lang="ts">
import { TabsContent } from 'radix-vue'

interface IProps {
  name: string
}

withDefaults(defineProps<IProps>(), {
  name: '',
})
</script>

<template>
  <TabsContent :value="name">
    <slot />
  </TabsContent>
</template>
