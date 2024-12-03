import type { VisuPluginClass, VisuPlugins } from './types'
import { LAYER, STAGE } from '@visu/types'
import Konva from 'konva'
import { Workspace } from './wrokspace'

export class Visu {
  stage: Konva.Stage

  mainLayer: Konva.Layer

  staticLayer: Konva.Layer

  workspace: Konva.Group

  plugins: VisuPlugins<string> = new Map()

  constructor(container: string | HTMLDivElement) {
    const el = typeof container === 'string' ? document.querySelector(container) : container

    this.stage = new Konva.Stage({
      id: STAGE,
      container,
      width: el?.clientWidth,
      height: el?.clientHeight,
    })

    this.mainLayer = new Konva.Layer({
      id: LAYER.MAIN,
    })

    this.staticLayer = new Konva.Layer({
      id: LAYER.STATIC,
    })

    this.workspace = new Workspace()

    this.stage.add(this.mainLayer, this.staticLayer)
    this.mainLayer.add(this.workspace)
  }

  use<T>(Plugin: VisuPluginClass<T>, options?: T) {
    const plugin = new Plugin(this.stage, options || {} as T)
    const name = plugin.name

    if (!this.plugins.get(name)) {
      this.plugins.set(name, plugin)
      plugin.open()
    }

    return this
  }

  unuse(name: string) {
    const handler = this.plugins.get(name)

    if (handler) {
      handler.close()
      this.plugins.delete(name)
    }

    return this
  }

  destroy() {
    this.plugins.forEach(plugin => plugin.close())
    this.plugins.clear()
    this.stage.destroy()
  }
}
