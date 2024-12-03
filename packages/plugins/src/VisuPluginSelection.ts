import type { VisuPlugin } from '@visu/types'
import { LAYER, STAGE, WORKSPACE } from '@visu/types'
import Konva from 'konva'

export interface VisuPluginSelectionOptions {}

export class VisuPluginSelection implements VisuPlugin<'VisuSelection'> {
  name = 'VisuPluginSelection'

  private main: Konva.Layer

  isOpen = false

  selecting = false

  private startPosition = {
    x: 0,
    y: 0,
  }

  selectionRectangle = new Konva.Rect({
    name: 'selectionRectangle',
    fill: 'rgba(165, 180, 252, 0.1)',
    stroke: 'rgba(165, 180, 252, 0.3)',
    strokeWidth: 2,
    visible: false,
    listening: false,
  })

  constructor(private stage: Konva.Stage, _options: VisuPluginSelectionOptions = {}) {
    this.main = stage.findOne(`#${LAYER.MAIN}`)!
    this.main.add(this.selectionRectangle)
  }

  private _handleMousedown = this.handleMousedown.bind(this)
  private _handleMousemove = this.handleMousemove.bind(this)
  private _handleMouseup = this.handleMouseup.bind(this)

  open() {
    if (!this.isOpen) {
      this.isOpen = true
      this.stage.on('mousedown', this._handleMousedown)
    }
  }

  close() {
    if (this.isOpen) {
      this.isOpen = false
      this.stage.off('mousedown', this._handleMousedown)
      document.removeEventListener('mousemove', this._handleMousemove)
      document.removeEventListener('mouseup', this._handleMouseup)
    }
  }

  handleMousedown(e: any) {
    const id = e.target.id()

    // do nothing if we mousedown on any shape
    if (id === STAGE || id === WORKSPACE.CANVAS) {
      e.evt.preventDefault()

      if (this.main) {
        const { x, y } = this.main.position()
        this.startPosition.x = (e.evt.offsetX - x) / this.main.scaleX()
        this.startPosition.y = (e.evt.offsetY - y) / this.main.scaleX()

        this.selecting = true

        document.addEventListener('mousemove', this._handleMousemove)
        document.addEventListener('mouseup', this._handleMouseup)
      }
    }
  }

  handleMousemove(e: any) {
    if (!this.selecting) {
      return
    }

    const { left, top } = this.stage.container().getBoundingClientRect()

    const { x, y } = this.main.position()

    const x1 = this.startPosition.x
    const y1 = this.startPosition.y

    /**
     * Mousemove is Document listening.
     * Use `clientX / clientY`, prevent the mouse from leaving the canvas.
     */
    const x2 = (e.clientX - left - x) / this.main.scaleX()
    const y2 = (e.clientY - top - y) / this.main.scaleX()

    this.selectionRectangle.setAttrs({
      visible: true,
      x: Math.min(x1, x2),
      y: Math.min(y1, y2),
      width: Math.abs(x2 - x1),
      height: Math.abs(y2 - y1),
    })

    this.stage.container().style.cursor = 'default'

    e.preventDefault()
  }

  handleMouseup(e: any) {
    this.selecting = false

    if (!this.selectionRectangle.visible()) {
      return
    }

    e.preventDefault()

    this.selectionRectangle.visible(false)

    document.removeEventListener('mousemove', this._handleMousemove)
    document.removeEventListener('mouseup', this._handleMouseup)
  }
}
