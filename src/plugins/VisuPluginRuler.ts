import type { RulerRenderOptions } from '@visu/ruler'
import type { VisuPlugin } from '@visu/types'
import type Konva from 'konva'
import { signal } from '@visu/plugins'
import { Ruler } from '@visu/ruler'
import { LAYER, WORKSPACE } from '@visu/types'

export interface VisuPluginRulerOptions {
  size?: number
  backgroundColor?: string
  lineColor?: string
  textColor?: string
}

export class VisuPluginRuler implements VisuPlugin<'VisuRuler'> {
  name = 'VisuPluginRuler'

  private mainLayer: Konva.Layer

  private staticLayer: Konva.Layer

  private ruler: Ruler

  isOpen = false

  constructor(private stage: Konva.Stage, options: VisuPluginRulerOptions = {}) {
    const {
      size,
      backgroundColor,
      lineColor,
      textColor,
    } = options

    this.staticLayer = stage.findOne(`#${LAYER.STATIC}`)!
    this.mainLayer = stage.findOne(`#${LAYER.MAIN}`)!

    this.ruler = new Ruler({
      width: this.stage.width(),
      height: this.stage.height(),
      size,
      backgroundColor,
      lineColor,
      textColor,
    })

    this.staticLayer.add(this.ruler)
  }

  private _handleVisuResize = this.handleVisuResize.bind(this)
  private _handleVisuDrag = this.handleVisuDrag.bind(this)
  private _handleVisuZoom = this.handleVisuZoom.bind(this)

  get rulerRenderOptions(): RulerRenderOptions {
    const workspace = this.stage.findOne(`#${WORKSPACE.GROUP}`)

    return {
      zoom: this.mainLayer.scaleX(),
      position: workspace
        ? workspace.absolutePosition()
        : {
            x: 0,
            y: 0,
          },
    }
  }

  open() {
    if (!this.isOpen) {
      this.isOpen = true
      this.ruler.visible(true)
      signal.on('visu-resize', this._handleVisuResize)
      signal.on('visu-drag', this._handleVisuDrag)
      signal.on('visu-zoom', this._handleVisuZoom)
    }
  }

  close() {
    if (this.isOpen) {
      this.isOpen = false
      this.ruler.visible(false)
      signal.off('visu-resize', this._handleVisuResize)
      signal.off('visu-drag', this._handleVisuDrag)
      signal.off('visu-zoom', this._handleVisuZoom)
    }
  }

  handleVisuResize() {
    this.ruler.render(this.rulerRenderOptions)
  }

  handleVisuDrag() {
    this.ruler.render(this.rulerRenderOptions)
  }

  handleVisuZoom() {
    this.ruler.render(this.rulerRenderOptions)
  }
}
