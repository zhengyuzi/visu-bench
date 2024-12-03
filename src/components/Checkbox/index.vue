<script setup lang="ts">
import { CheckboxRoot } from 'radix-vue'

const checked = ref(true)
</script>

<template>
  <CheckboxRoot
    v-model:checked="checked"
    class="flex items-center justify-center outline-none"
  >
    <div
      class="flex items-center justify-center text-gray-500"
    >
      <slot v-if="checked" name="checked-icon" />
      <slot v-else name="unchecked-icon" />
    </div>
  </CheckboxRoot>
</template>
