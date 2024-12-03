import type { VisuPlugin } from '@visu/types'
import type { Shape, ShapeConfig } from 'konva/lib/Shape'
import type { VisuWorkspaceEvent } from './Signal'
import { WORKSPACE } from '@visu/types'
import Konva from 'konva'
import { nanoid } from 'nanoid'
import { signal } from './Signal'

export interface VisuPluginWorkspaceOptions {
  width?: number
  height?: number
  backgroundColor?: string
}

export class VisuPluginWorkspace implements VisuPlugin<'VisuWorkspace'> {
  name = 'VisuPluginWorkspace'

  isOpen = false

  workspace: Konva.Group

  canvas: Konva.Rect

  constructor(private stage: Konva.Stage, options: VisuPluginWorkspaceOptions = {}) {
    const {
      width = 800,
      height = 500,
      backgroundColor = '#ffffff',
    } = options

    this.workspace = this.stage.findOne(`#${WORKSPACE.GROUP}`)!

    this.canvas = new Konva.Rect({
      id: WORKSPACE.CANVAS,
      name: WORKSPACE.CANVAS,
      width,
      height,
      fill: backgroundColor,
    })

    this.workspace.setAttrs({
      width,
      height,
      clipWidth: width,
      clipHeight: height,
    })

    this.workspace.add(this.canvas)
  }

  private _handleVisuWorkspace = this.handleVisuWorkspace.bind(this)

  open() {
    if (!this.isOpen) {
      this.isOpen = true
      signal.on('visu-workspace', this._handleVisuWorkspace)
    }
  }

  close() {
    if (this.isOpen) {
      this.isOpen = false
      signal.off('visu-workspace', this._handleVisuWorkspace)
    }
  }

  get nodes() {
    return this.workspace.getChildren()
  }

  getNode(id: string) {
    const node = this.workspace.findOne(`#${id}`)
    return node
  }

  addNode(node: Shape<ShapeConfig>) {
    signal.emit('visu-workspace', {
      type: 'add',
      node,
    })
  }

  removeNode(id: string) {
    signal.emit('visu-workspace', {
      type: 'remove',
      id,
    })
  }

  hideNode(id: string) {
    signal.emit('visu-workspace', {
      type: 'hide',
      id,
    })
  }

  showNode(id: string) {
    signal.emit('visu-workspace', {
      type: 'show',
      id,
    })
  }

  handleVisuWorkspace(e: VisuWorkspaceEvent) {
    switch (e.type) {
      case 'add':
        e.node.setAttr('id', nanoid())
        this.workspace.add(e.node)
        break

      case 'remove':
        this.getNode(e.id)?.remove()
        break

      case 'show':
        this.getNode(e.id)?.show()
        break

      case 'hide':
        this.getNode(e.id)?.hide()
        break

      default:
        break
    }
  }
}
