import type { VisuPlugin } from '@visu/types'
import type Konva from 'konva'
import { LAYER } from '@visu/types'
import { signal } from './Signal'

export interface VisuPluginDragOptions {}

export class VisuPluginDrag implements VisuPlugin<'VisuDrag'> {
  name = 'VisuPluginDrag'

  private main: Konva.Layer

  isOpen = false

  isDrag = false

  drag = {
    x: 0,
    y: 0,
  }

  constructor(private stage: Konva.Stage, _options: VisuPluginDragOptions = {}) {
    this.main = stage.findOne(`#${LAYER.MAIN}`)!
  }

  private _handleMousedown = this.handleMousedown.bind(this)
  private _handleMousemove = this.handleMousemove.bind(this)
  private _handleMouseup = this.handleMouseup.bind(this)

  open() {
    if (!this.isOpen) {
      this.isOpen = true
      this.stage.container().style.cursor = 'grab'
      this.stage.on('mousedown', this._handleMousedown)
    }
  }

  close() {
    if (this.isOpen) {
      this.stage.container().style.cursor = 'default'
      this.isOpen = false
      this.stage.off('mousedown', this._handleMousedown)
      document.removeEventListener('mousemove', this._handleMousemove)
      document.removeEventListener('mouseup', this._handleMouseup)
    }
  }

  private handleMousedown(e: any) {
    if (this.stage.container().style.cursor === 'grab') {
      this.stage.container().style.cursor = 'grabbing'
    }

    this.isDrag = true
    this.drag.x = e.evt.clientX
    this.drag.y = e.evt.clientY

    document.addEventListener('mousemove', this._handleMousemove)
    document.addEventListener('mouseup', this._handleMouseup)

    e.evt.preventDefault()
  }

  private handleMousemove(e: any) {
    if (this.isDrag) {
      const { x, y } = this.main.position()

      this.stage.container().style.cursor = 'grabbing'

      this.main.position({
        x: x + e.clientX - this.drag.x,
        y: y + e.clientY - this.drag.y,
      })

      this.drag.x = e.clientX
      this.drag.y = e.clientY

      this.main.draw()

      signal.emit('visu-drag', {
        x: e.movementX,
        y: e.movementY,
      })
    }
  }

  private handleMouseup() {
    this.isDrag = false

    if (this.isOpen) {
      this.main.getStage().container().style.cursor = 'grab'
    }

    document.removeEventListener('mousemove', this._handleMousemove)
    document.removeEventListener('mouseup', this._handleMouseup)
  }
}
