import type { VisuPlugin } from '@visu/types'
import type Konva from 'konva'
import type { Node, NodeConfig } from 'konva/lib/Node'
import type { VisuResizeEvent } from './Signal'
import { LAYER, WORKSPACE } from '@visu/types'
import Decimal from 'decimal.js'
import { signal } from './Signal'

export interface VisuPluginZoomOptions {}

export class VisuPluginZoom implements VisuPlugin<'VisuZoom'> {
  name = 'VisuPluginZoom'

  isOpen = false

  private main: Konva.Layer

  private workspace: Node<NodeConfig>

  zoom = 1

  zoomRadio = 0.1

  zoomRange = [0.1, 20]

  constructor(private stage: Konva.Stage, _options: VisuPluginZoomOptions = {}) {
    this.main = stage.findOne(`#${LAYER.MAIN}`)!
    this.workspace = stage.findOne(`#${WORKSPACE.CANVAS}`)!
    this.zoom = this.main.scaleX()
  }

  private _handleWheel = this.handleWheel.bind(this)
  private _handleResize = this.handleResize.bind(this)

  open() {
    if (!this.isOpen) {
      this.isOpen = true
      this.stage.on('wheel', this._handleWheel)
      signal.on('visu-resize', this._handleResize)
    }
  }

  close() {
    if (this.isOpen) {
      this.isOpen = false
      this.stage.off('wheel', this._handleWheel)
      signal.off('visu-resize', this._handleResize)
    }
  }

  private handleResize({ width, height }: VisuResizeEvent) {
    this.autoZoom(width, height)
  }

  private handleWheel(e: any) {
    e.evt.deltaY < 0 ? this.zoomIn() : this.zoomOut()
  }

  viewportZoom(value: number) {
    if (value < this.zoomRange[0] || value > this.zoomRange[1]) {
      return
    }

    const center = {
      x: this.main.width() / 2,
      y: this.main.height() / 2,
    }

    const relatedTo = {
      x: (center.x - this.main.x()) / this.zoom,
      y: (center.y - this.main.y()) / this.zoom,
    }

    const scale = {
      x: value,
      y: value,
    }

    this.zoom = value

    this.main.scale(scale)

    this.main.position({
      x: center.x - relatedTo.x * value,
      y: center.y - relatedTo.y * value,
    })

    this.main.batchDraw()

    signal.emit('visu-zoom', { zoom: value })
  }

  zoomIn() {
    const zoom = Number(new Decimal(this.zoomRadio).plus(this.zoom))

    this.viewportZoom(zoom)
  }

  zoomOut() {
    const zoom = Number(new Decimal(-this.zoomRadio).plus(this.zoom))

    this.viewportZoom(zoom)
  }

  autoZoom(width: number, height: number) {
    for (
      let zoom = this.zoomRange[1];
      zoom >= this.zoomRange[0];
      zoom = Number(new Decimal(zoom).sub(this.zoomRadio))
    ) {
      const w = this.workspace.width() * zoom * 1.3
      const h = this.workspace.height() * zoom * 1.3

      if (w < width && h < height) {
        this.viewportZoom(zoom)
        break
      }
    }
  }
}
