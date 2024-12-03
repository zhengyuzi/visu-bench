import { WORKSPACE } from '@visu/types'
import Konva from 'konva'

export class Workspace extends Konva.Group {
  constructor() {
    super({
      id: WORKSPACE.GROUP,
      name: WORKSPACE.GROUP,
      clipX: 0,
      clipY: 0,
    })
  }
}
