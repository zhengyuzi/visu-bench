import type { VisuPlugin } from '@visu/types'
import type Konva from 'konva'
import { LAYER, WORKSPACE } from '@visu/types'
import { signal } from './Signal'

export interface VisuPluginResizeOptions {}

export class VisuPluginResize implements VisuPlugin<'VisuResize'> {
  name = 'VisuPluginResize'

  isOpen = false

  resizeObserver: ResizeObserver

  private main: Konva.Layer

  private canvas: Konva.Group

  constructor(private stage: Konva.Stage, _options: VisuPluginResizeOptions = {}) {
    this.main = this.stage.findOne(`#${LAYER.MAIN}`)!
    this.canvas = this.stage.findOne(`#${WORKSPACE.GROUP}`)!

    this.resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      this.stage.setSize({ width, height })
      this.viewportCenter(width, height)
      signal.emit('visu-resize', { width, height })
      this.stage.draw()
    })
  }

  open() {
    if (!this.isOpen) {
      this.isOpen = true
      this.resizeObserver.observe(this.stage.container())
    }
  }

  close() {
    if (this.isOpen) {
      this.isOpen = false
      this.resizeObserver.unobserve(this.stage.container())
    }
  }

  /**
   * workspace horizontal and vertical center
   */
  viewportCenter(width: number, height: number) {
    const position = {
      x: (width - this.canvas.width() * this.main.scaleX()) / 2,
      y: (height - this.canvas.height() * this.main.scaleY()) / 2,
    }
    this.canvas.setAbsolutePosition(position)
  }
}
