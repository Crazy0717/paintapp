"use client"
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react"
import { Stage, Layer, Line, Image as KonvaImage } from "react-konva"
import { Button } from "./ui/button"
import { debounce } from "debounce-throttling"
import { ImagePlus } from "lucide-react"

interface LineElement {
  tool?: string
  points: number[]
  color?: string
}
enum DrawAction {
  Select = "select",
  Rectangle = "rectangle",
  Circle = "circle",
  Scribble = "freedraw",
  Arrow = "arrow",
}
const size = 500

const DrawingCanvas = () => {
  const [lines, setLines] = useState<LineElement[]>([])
  const isDrawing = useRef(false)
  const [stageSize, setStageSize] = useState<{ width: number; height: number }>(
    {
      width: 1000,
      height: 1000,
    }
  )
  const [drawAction, setDrawAction] = useState<DrawAction>(DrawAction.Select)
  const isDraggable = drawAction === DrawAction.Select
  const stageRef = useRef<any>(null)

  const [color, setColor] = useState("#00000")
  const fileRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState<HTMLImageElement>()

  const handleMouseDown = (e: any) => {
    isDrawing.current = true
    const pos = e.target.getStage().getPointerPosition()
    setLines([...lines, { points: [pos.x, pos.y], color: color }])
  }
  const handleMouseMove = (e: any) => {
    if (!isDrawing.current) return
    const stage = e.target.getStage()
    const point = stage.getPointerPosition()
    let lastLine = lines[lines.length - 1]
    lastLine.points = lastLine.points.concat([point.x, point.y])
    setLines([...lines.slice(0, -1), lastLine])
  }
  const handleMouseUp = () => {
    isDrawing.current = false
  }

  const colorChangFunc = debounce((e: ChangeEvent) => {
    setColor(e.target.value)
  }, 300)

  const onExportClick = useCallback(() => {
    const dataUri = stageRef?.current?.toDataURL({ pixelRatio: 3 })
    downloadURI(dataUri, "image.png")
  }, [])
  const downloadURI = (uri: string | undefined, name: string) => {
    const link = document.createElement("a")
    link.download = name
    link.href = uri || ""
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  const onImportImageSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
        const imageUrl = URL.createObjectURL(e.target.files?.[0])
        const image = new Image(500 / 2, 500 / 2)
        image.src = imageUrl
        setImage(image)
      }
      e.target.files = null
    },
    []
  )

  useEffect(() => {
    const checkSize = () => {
      setStageSize({
        width: window.innerWidth - window.innerWidth * 0.01,
        height: window.innerHeight - window.innerHeight * 0.09,
      })
    }
    checkSize()
    window.addEventListener("resize", checkSize)
    return () => window.removeEventListener("resize", checkSize)
  }, [])
  return (
    <>
      <nav className="px-4 py-1 flex items-center gap-3">
        <input
          type="color"
          onChange={colorChangFunc}
          className="rounded-sm size-10 color-picker"
        />
        <input
          type="file"
          ref={fileRef}
          onChange={onImportImageSelect}
          accept="image/*"
          id="input:file"
          className="hidden"
        />
        <Button variant={"outline"} className="size-10">
          <label htmlFor="input:file" className="cursor-pointer">
            <ImagePlus className="size-5" />
          </label>
        </Button>
        <Button variant={"outline"} onClick={onExportClick}>
          Export
        </Button>
      </nav>

      <Stage
        width={stageSize.width}
        height={stageSize.height}
        className="border"
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        ref={stageRef}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.color}
              strokeWidth={5}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
            />
          ))}
          {image && (
            <KonvaImage
              image={image}
              x={0}
              y={0}
              height={size / 2}
              width={size / 2}
              draggable={isDraggable}
            />
          )}
        </Layer>
      </Stage>
    </>
  )
}

export default DrawingCanvas
