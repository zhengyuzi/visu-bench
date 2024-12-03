import type { VisuPlugin } from '@visu/types'
import type Konva from 'konva'

export interface VisuPluginClass<T> {
  new (stage: Konva.Stage, options: T): VisuPlugin<T>
}

export interface VisuPlugins<TKey> {
  get: <T = TKey>(key: TKey) => (T extends TKey ? VisuPlugin<TKey> : T) | undefined
  set: <T = TKey>(key: TKey, handler: VisuPlugin<T>) => this
  delete: (key: string) => boolean
  clear: () => void
  forEach: <T = TKey>(callbackfn: (value: VisuPlugin<T>, key: TKey, map: this) => void, thisArg?: any) => void
}
