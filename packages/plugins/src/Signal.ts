import type { Shape, ShapeConfig } from 'konva/lib/Shape'
import type { Emitter } from 'mitt'
import mitt from 'mitt'

export interface VisuWorkspaceAdd {
  type: 'add'
  node: Shape<ShapeConfig>
}

export interface VisuWorkspaceRemove {
  type: 'remove'
  id: string
}

export interface VisuWorkspaceShow {
  type: 'show'
  id: string
}

export interface VisuWorkspaceHide {
  type: 'hide'
  id: string
}

export type VisuWorkspaceEvent = VisuWorkspaceAdd | VisuWorkspaceRemove | VisuWorkspaceShow | VisuWorkspaceHide

export interface VisuDragEvent {
  x: number
  y: number
}

export interface VisuResizeEvent {
  width: number
  height: number
}

export interface VisuZoomEvent {
  zoom: number
}

/* eslint-disable ts/consistent-type-definitions */
export type Events = {
  'visu-drag': VisuDragEvent
  'visu-resize': VisuResizeEvent
  'visu-zoom': VisuZoomEvent
  'visu-workspace': VisuWorkspaceEvent
}

export const signal: Emitter<Events> = mitt<Events>()
