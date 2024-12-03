<script setup lang="ts">
import {
  EditableArea,
  EditableInput,
  EditablePreview,
  EditableRoot,
} from 'radix-vue'

interface IProps {
  defaultText: string
}

const props = withDefaults(defineProps<IProps>(), {
  defaultText: '',
})

const emit = defineEmits(['submit'])

const modelValue = ref(props.defaultText)

function handleSubmit(value: string | undefined) {
  modelValue.value = value?.trim() || props.defaultText
  emit('submit', modelValue.value)
}

function updateModelValue(value: string) {
  modelValue.value = value
}
</script>

<template>
  <EditableRoot
    class="select-none cursor-text"
    activation-mode="dblclick"
    :default-value="defaultText"
    :model-value="modelValue"
    @submit="handleSubmit"
    @update:model-value="updateModelValue"
  >
    <EditableArea>
      <EditablePreview />
      <EditableInput class="w-full p-1 outline-none" />
    </EditableArea>
  </EditableRoot>
</template>
