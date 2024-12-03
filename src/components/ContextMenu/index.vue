<script setup lang="ts">
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuPortal,
  ContextMenuRoot,
  ContextMenuSeparator,
  // ContextMenuSub,
  // ContextMenuSubContent,
  // ContextMenuSubTrigger,
  ContextMenuTrigger,
} from 'radix-vue'
</script>

<template>
  <ContextMenuRoot>
    <ContextMenuTrigger>
      <slot />
    </ContextMenuTrigger>
    <ContextMenuPortal>
      <ContextMenuContent
        class="min-w-[200px] z-30 bg-white outline-none rounded-md p-2 shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]"
      >
        <ContextMenuItem
          class="select-none leading-none text-xs text-gray-800 rounded p-2 hover:(bg-indigo-500 text-gray-100)"
        >
          重命名
        </ContextMenuItem>
        <ContextMenuSeparator class="h-[1px] border-t my-1" />
        <ContextMenuItem
          class="select-none leading-none text-xs text-gray-800 rounded p-2 hover:(bg-indigo-500 text-gray-100)"
        >
          成组
        </ContextMenuItem>
        <!-- <ContextMenuItem>…</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger>Sub menu</ContextMenuSubTrigger>
          <ContextMenuPortal>
            <ContextMenuSubContent>
              <ContextMenuItem>Sub menu item</ContextMenuItem>
              <ContextMenuItem>Sub menu item</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuPortal>
        </ContextMenuSub>
        <ContextMenuSeparator /> -->
      </ContextMenuContent>
    </ContextMenuPortal>
  </ContextMenuRoot>
</template>
