export interface LineElement {
  tool?: string
  points: number[]
  color?: string
  strkWidth: number
}

export enum DrawAction {
  Select = "select",
  Rectangle = "rectangle",
  Circle = "circle",
  Scribble = "freedraw",
  Arrow = "arrow",
}
