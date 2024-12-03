import type { VisuPlugin } from '@visu/types'
import type Konva from 'konva'

export interface VisuPluginContextmenuOptions {}

export class VisuPluginContextmenu implements VisuPlugin<'VisuContextmenu'> {
  name = 'VisuPluginContextmenu'

  isOpen = false

  constructor(private stage: Konva.Stage, _options: VisuPluginContextmenuOptions = {}) {}

  private _handleContextmenu = this.handleContextmenu.bind(this)

  handleContextmenu(e: any) {
    e.preventDefault()
  }

  open() {
    if (!this.isOpen) {
      this.isOpen = true
      this.stage.container().addEventListener('contextmenu', this._handleContextmenu)
    }
  }

  close() {
    if (this.isOpen) {
      this.isOpen = false
      this.stage.container().removeEventListener('contextmenu', this._handleContextmenu)
    }
  }
}
