import type Konva from 'konva'

export declare class VisuPlugin<T> {
  constructor(stage: Konva.Stage, options?: T)
  name: string
  open: () => void
  close: () => void
}
