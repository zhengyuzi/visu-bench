import { VisuPluginContextmenu } from './VisuPluginContextmenu'
import { VisuPluginDrag } from './VisuPluginDrag'
import { VisuPluginResize } from './VisuPluginResize'
import { VisuPluginSelection } from './VisuPluginSelection'
import { VisuPluginWorkspace } from './VisuPluginWorkspace'
import { VisuPluginZoom } from './VisuPluginZoom'

// signal
export * from './Signal'

export interface VisuPlugins {
  VisuPluginContextmenu: VisuPluginContextmenu
  VisuPluginDrag: VisuPluginDrag
  VisuPluginResize: VisuPluginResize
  VisuPluginSelection: VisuPluginSelection
  VisuPluginWorkspace: VisuPluginWorkspace
  VisuPluginZoom: VisuPluginZoom
}

export {
  VisuPluginContextmenu,
  VisuPluginDrag,
  VisuPluginResize,
  VisuPluginSelection,
  VisuPluginWorkspace,
  VisuPluginZoom,
}
