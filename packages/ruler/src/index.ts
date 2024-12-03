import type { Vector2d } from 'konva/lib/types'
import Konva from 'konva'

export interface IRuler {
  width: number
  height: number
  size?: number
  backgroundColor?: string
  lineColor?: string
  textColor?: string
  visible?: boolean
}

export interface RulerRenderOptions {
  position: Vector2d
  zoom: number
}

export interface RulerScaleOptions {
  length: number
  distance: number
  zoom: number
}

export class Ruler extends Konva.Group {
  /**
   * Ruler size
   * @default 24
   */
  rulerSize: number

  /**
   * Ruler background color
   * @default 'rgba(255, 255, 255, 0.8)'
   */
  backgroundColor: string

  /**
   * Ruler scale color
   * @default #cacaca
   */
  lineColor: string

  /**
   * Ruler scale text color
   * @default #888888
   */
  textColor: string

  scaleLevels = [100, 50, 25, 20, 15, 10, 5, 2, 1]

  private background: Konva.Line
  private lineH: Konva.Line
  private lineW: Konva.Line

  private cursor = ''

  private ruler = new Konva.Group()

  private scales = new Konva.Group()

  private guidelines = new Konva.Group()

  constructor(options: IRuler) {
    const {
      width,
      height,
      size = 24,
      backgroundColor = '#f9fafb',
      lineColor = '#cacaca',
      textColor = '#888888',
      visible = true,
    } = options

    super({
      name: 'ruler',
      visible,
    })

    this.rulerSize = size
    this.backgroundColor = backgroundColor
    this.lineColor = lineColor
    this.textColor = textColor

    this.background = new Konva.Line({
      points: [0, 0, 0, height, this.rulerSize, height, this.rulerSize, this.rulerSize, width, this.rulerSize, width, 0, 0, 0],
      closed: true,
      fill: this.backgroundColor,
      shadowBlur: 10,
      shadowColor: '#ddd',
    })

    this.lineH = new Konva.Line({
      points: [0, this.rulerSize, width, this.rulerSize],
      stroke: this.lineColor,
      strokeWidth: 1,
    })

    this.lineW = new Konva.Line({
      points: [this.rulerSize, 0, this.rulerSize, height],
      stroke: this.lineColor,
      strokeWidth: 1,
    })

    const unitBg = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.rulerSize - 1,
      height: this.rulerSize - 1,
      fill: this.backgroundColor,
    })

    const unit = new Konva.Text({
      x: this.rulerSize / 4,
      y: this.rulerSize / 4,
      text: 'px',
      fontSize: this.rulerSize / 2,
      fill: this.textColor,
    })

    this.ruler.add(this.guidelines, this.background, this.scales)
    this.add(this.ruler, unitBg, this.lineH, this.lineW, unit)

    this.bindEvent()
  }

  private _handleMouseenter = this.handleMouseenter.bind(this)
  private _handleMouseleave = this.handleMouseleave.bind(this)
  private _handleMousedown = this.handleMousedown.bind(this)
  private _handleMousemove = this.handleMousemove.bind(this)
  private _handleMouseup = this.handleMouseup.bind(this)

  bindEvent() {
    this.ruler.on('mouseenter', this._handleMouseenter)
    this.ruler.on('mouseleave', this._handleMouseleave)
    this.ruler.on('mousedown', this._handleMousedown)
  }

  unBindEvent() {
    this.ruler.off('mouseenter', this._handleMouseenter)
    this.ruler.off('mouseleave', this._handleMouseleave)
    this.ruler.off('mousedown', this._handleMousedown)
  }

  render({ position, zoom }: RulerRenderOptions) {
    if (!this.parent)
      return

    this.scales.removeChildren()

    const width = this.parent.width()
    const height = this.parent.height()

    this.background.setAttrs({
      points: [0, 0, 0, height, this.rulerSize, height, this.rulerSize, this.rulerSize, width, this.rulerSize, width, 0, 0, 0],
    })

    this.lineH.setAttrs({
      points: [0, this.rulerSize, width, this.rulerSize],
    })

    this.lineW.setAttrs({
      points: [this.rulerSize, 0, this.rulerSize, height],
    })

    const scaleH = this.createScale('HORIZONTAL', {
      length: width,
      distance: position.x,
      zoom,
    })

    const scaleW = this.createScale('VERTICAL', {
      length: height,
      distance: position.y,
      zoom,
    })

    this.scales.add(scaleH, scaleW)

    this.parent.draw()
  }

  private createScale(direction: 'HORIZONTAL' | 'VERTICAL', options: RulerScaleOptions) {
    const { length, distance, zoom } = options

    const group = new Konva.Group()

    const isHorizontal = direction === 'HORIZONTAL'

    let levelIndex = Math.floor(zoom / 0.5)

    levelIndex = Math.min(this.scaleLevels.length - 1, levelIndex)

    levelIndex = Math.max(0, levelIndex)

    const level = this.scaleLevels[levelIndex]

    for (let i = this.rulerSize; i < length; i += 0.1) {
      const lastScale = Math.floor(((i - 0.1) - distance) / zoom)
      const scale = Math.floor((i - distance) / zoom)

      if (lastScale === scale) {
        continue
      }

      const isMainScale = scale % (level * 10) === 0
      const isDownScale = scale % level === 0

      if (isMainScale) {
        const scaleLine = new Konva.Line({
          points: isHorizontal
            ? [i, this.rulerSize * 0.4, i, this.rulerSize]
            : [this.rulerSize * 0.4, i, this.rulerSize, i],
          stroke: this.lineColor,
          strokeWidth: 1,
        })

        const scaleText = new Konva.Text({
          x: isHorizontal ? i + this.rulerSize * 0.25 : this.rulerSize * 0.2,
          y: isHorizontal ? this.rulerSize * 0.2 : i - this.rulerSize * 0.25,
          text: `${scale}`,
          fontSize: this.rulerSize * 0.4,
          fill: this.textColor,
          rotation: isHorizontal ? 0 : -90,
        })

        group.add(scaleLine, scaleText)
      }
      else if (isDownScale) {
        const scaleLine = new Konva.Line({
          points: isHorizontal
            ? [i, this.rulerSize * 0.7, i, this.rulerSize]
            : [this.rulerSize * 0.7, i, this.rulerSize, i],
          stroke: this.lineColor,
          strokeWidth: 1,
        })

        group.add(scaleLine)
      }
    }

    return group
  }

  private handleMouseenter(e: any) {
    const { offsetX, offsetY } = e.evt
    const stage = this.getStage()!

    this.cursor = stage.container().style.cursor || ''

    if (offsetX < this.rulerSize && offsetY > this.rulerSize) {
      stage.container().style.cursor = 'e-resize'
    }
    else if (offsetX > this.rulerSize && offsetY < this.rulerSize) {
      stage.container().style.cursor = 's-resize'
    }
  }

  private handleMouseleave() {
    this.getStage()!.container().style.cursor = this.cursor
  }

  private handleMousedown() {
    this.ruler.off('mouseenter', this._handleMouseenter)
    this.ruler.off('mouseleave', this._handleMouseleave)
    document.addEventListener('mousemove', this._handleMousemove)
    document.addEventListener('mouseup', this._handleMouseup)
  }

  private handleMousemove() {
    //
  }

  private handleMouseup() {
    this.getStage()!.container().style.cursor = this.cursor
    document.removeEventListener('mousemove', this._handleMousemove)
    document.removeEventListener('mouseup', this._handleMouseup)
    this.ruler.on('mouseenter', this._handleMouseenter)
    this.ruler.on('mouseleave', this._handleMouseleave)
  }
}
