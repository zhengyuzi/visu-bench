import type { VisuPluginClass } from '@visu/core'
import type { VisuPlugins } from '@visu/plugins'
import { VisuPluginRuler } from '@/plugins/VisuPluginRuler'
import { Visu } from '@visu/core'
import {
  VisuPluginContextmenu,
  VisuPluginResize,
  VisuPluginSelection,
  VisuPluginWorkspace,
  VisuPluginZoom,
} from '@visu/plugins'
import { tryOnScopeDispose, unrefElement } from '@vueuse/core'

export interface UseVisuOptions {

}

export default function useVisu(
  target: MaybeRefOrGetter<HTMLDivElement | null | undefined>,
//   options: UseVisuOptions = {},
) {
  let visu: Visu | undefined

  watch(
    () => unrefElement(target),
    el => visu = createVisu(el),
  )

  tryOnScopeDispose(() => cleanup())

  function createVisu(el: HTMLDivElement | null | undefined) {
    if (!el)
      return

    if (visu)
      cleanup()

    return new Visu(el)
      .use(VisuPluginWorkspace, {
        width: 800,
        height: 500,
      })
      .use(VisuPluginResize)
      .use(VisuPluginContextmenu)
      .use(VisuPluginSelection)
      .use(VisuPluginZoom)
      .use(VisuPluginRuler)
  }

  function cleanup() {
    visu?.destroy()
  }

  function use<T>(plugin: VisuPluginClass<T>, options?: T) {
    return visu?.use(plugin, options)
  }

  function unuse(pluginName: keyof VisuPlugins) {
    visu?.unuse(pluginName)
  }

  function getPlugin<T extends keyof VisuPlugins>(pluginName: T) {
    return visu?.plugins.get<VisuPlugins[T]>(pluginName)
  }

  function getStageSize() {
    return visu?.stage.size()
  }

  function getCanvasSize() {
    return visu?.workspace.size()
  }

  function getCanvasPosition() {
    return visu?.workspace.getAbsolutePosition()
  }

  function toJson() {
    return visu?.workspace.toJSON()
  }

  function getThumbnail() {
    return visu?.mainLayer.toDataURL({
      x: 0,
      y: 0,
      width: visu?.stage.width(),
      height: visu?.stage.height(),
    })
  }

  onUnmounted(() => {
    cleanup()
  })

  return {
    use,
    unuse,
    getPlugin,
    getStageSize,
    getCanvasSize,
    getCanvasPosition,
    toJson,
    getThumbnail,
  }
}
