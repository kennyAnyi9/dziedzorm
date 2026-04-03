"use client"

import * as React from "react"
import { createMap } from "svg-dotted-map"

import { cn } from "@/lib/utils"

export interface Marker {
  lat: number
  lng: number
  size?: number
  pulse?: boolean
}

/** addMarkers returns markers with lat/lng removed; only x, y and other props (e.g. size) remain */
type MapMarker<M extends Marker> = Omit<M, "lat" | "lng"> & {
  x: number
  y: number
}

export interface DottedMapProps<
  M extends Marker = Marker,
> extends React.SVGProps<SVGSVGElement> {
  width?: number
  height?: number
  mapSamples?: number
  markers?: M[]
  dotColor?: string
  markerColor?: string
  dotRadius?: number
  stagger?: boolean
  pulse?: boolean
  repel?: boolean
  repelRadius?: number
  repelStrength?: number
  renderMarkerOverlay?: (args: {
    marker: MapMarker<M>
    index: number
    x: number
    y: number
    r: number
  }) => React.ReactNode
}

export function DottedMap<M extends Marker = Marker>({
  width = 150,
  height = 75,
  mapSamples = 5000,
  markers = [],
  dotColor = "currentColor",
  markerColor = "#FF6900",
  dotRadius = 0.2,
  stagger = true,
  pulse = false,
  repel = true,
  repelRadius = 8,
  repelStrength = 0.4,
  renderMarkerOverlay,
  className,
  style,
  ...svgProps
}: DottedMapProps<M>) {
  const svgRef = React.useRef<SVGSVGElement>(null)
  const dotsGroupRef = React.useRef<SVGGElement>(null)

  const { points, addMarkers } = createMap({
    width,
    height,
    mapSamples,
  })
  const processedMarkers = addMarkers(markers)

  // Compute stagger helpers in a single, simple pass
  const { xStep, yToRowIndex } = React.useMemo(() => {
    const sorted = [...points].sort((a, b) => a.y - b.y || a.x - b.x)
    const rowMap = new Map<number, number>()
    let step = 0
    let prevY = Number.NaN
    let prevXInRow = Number.NaN

    for (const p of sorted) {
      if (p.y !== prevY) {
        prevY = p.y
        prevXInRow = Number.NaN
        if (!rowMap.has(p.y)) rowMap.set(p.y, rowMap.size)
      }
      if (!Number.isNaN(prevXInRow)) {
        const delta = p.x - prevXInRow
        if (delta > 0) step = step === 0 ? delta : Math.min(step, delta)
      }
      prevXInRow = p.x
    }

    return { xStep: step || 1, yToRowIndex: rowMap }
  }, [points])

  // Magnetic repulsion effect
  React.useEffect(() => {
    if (!repel) return
    const svg = svgRef.current
    const dotsGroup = dotsGroupRef.current
    if (!svg || !dotsGroup) return

    const dots = dotsGroup.children
    const count = dots.length

    // Typed arrays for performance
    const dx = new Float32Array(count)
    const dy = new Float32Array(count)
    const vx = new Float32Array(count)
    const vy = new Float32Array(count)
    const ox = new Float32Array(count)
    const oy = new Float32Array(count)

    // Cache original positions from data attributes
    for (let i = 0; i < count; i++) {
      const el = dots[i] as SVGCircleElement
      ox[i] = parseFloat(el.getAttribute("data-ox") || "0")
      oy[i] = parseFloat(el.getAttribute("data-oy") || "0")
    }

    const mouse = { x: 0, y: 0, vx: 0, vy: 0, active: false }
    const activeSet = new Set<number>()

    const SPRING = 0.05
    const DAMPING = 0.78
    const SNAP = 0.002
    const R = repelRadius
    const R2 = R * R
    const STRENGTH = repelStrength

    function screenToSVG(clientX: number, clientY: number) {
      const ctm = svg!.getScreenCTM()
      if (!ctm) return null
      const inv = ctm.inverse()
      return {
        x: inv.a * clientX + inv.c * clientY + inv.e,
        y: inv.b * clientX + inv.d * clientY + inv.f,
      }
    }

    function onPointerMove(e: PointerEvent) {
      const rect = svg!.getBoundingClientRect()
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        const pos = screenToSVG(e.clientX, e.clientY)
        if (pos) {
          mouse.vx = pos.x - mouse.x
          mouse.vy = pos.y - mouse.y
          mouse.x = pos.x
          mouse.y = pos.y
          mouse.active = true
        }
      } else {
        mouse.active = false
        mouse.vx = 0
        mouse.vy = 0
      }
    }

    function onPointerLeave() {
      mouse.active = false
      mouse.vx = 0
      mouse.vy = 0
    }

    document.addEventListener("pointermove", onPointerMove)
    document.addEventListener("pointerleave", onPointerLeave)

    let rafId: number

    function animate() {
      // Add dots near mouse to active set
      if (mouse.active) {
        const scanR2 = (R * 1.5) * (R * 1.5)
        for (let i = 0; i < count; i++) {
          const distX = ox[i] - mouse.x
          const distY = oy[i] - mouse.y
          const dist2 = distX * distX + distY * distY
          if (dist2 < scanR2) {
            activeSet.add(i)
          }
        }
      }

      // Update only active dots
      const toRemove: number[] = []

      for (const i of activeSet) {
        if (mouse.active) {
          const curX = ox[i] + dx[i]
          const curY = oy[i] + dy[i]
          const distX = curX - mouse.x
          const distY = curY - mouse.y
          const dist2 = distX * distX + distY * distY

          if (dist2 < R2 && dist2 > 0.0001) {
            const dist = Math.sqrt(dist2)
            const t = 1 - dist / R
            const force = STRENGTH * t * t

            // Clockwise tangential: rotate (distX, distY) by 90° CW → (distY, -distX)
            vx[i] += (distY / dist) * force
            vy[i] += (-distX / dist) * force

            // Small radial push so dots don't collapse onto cursor
            vx[i] += (distX / dist) * force * 0.25
            vy[i] += (distY / dist) * force * 0.25
          }
        }

        // Spring back + damping
        vx[i] += -SPRING * dx[i]
        vy[i] += -SPRING * dy[i]
        vx[i] *= DAMPING
        vy[i] *= DAMPING

        // Integrate
        dx[i] += vx[i]
        dy[i] += vy[i]

        const disp = Math.sqrt(dx[i] * dx[i] + dy[i] * dy[i])

        // Snap to rest
        if (
          disp < SNAP &&
          Math.abs(vx[i]) < SNAP &&
          Math.abs(vy[i]) < SNAP
        ) {
          dx[i] = 0
          dy[i] = 0
          vx[i] = 0
          vy[i] = 0
          const el = dots[i] as SVGCircleElement
          el.setAttribute("cx", String(ox[i]))
          el.setAttribute("cy", String(oy[i]))
          toRemove.push(i)
        } else {
          const el = dots[i] as SVGCircleElement
          el.setAttribute("cx", String(ox[i] + dx[i]))
          el.setAttribute("cy", String(oy[i] + dy[i]))
        }
      }

      for (const i of toRemove) {
        activeSet.delete(i)
      }

      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener("pointermove", onPointerMove)
      document.removeEventListener("pointerleave", onPointerLeave)
      // Reset all dots
      for (let i = 0; i < count; i++) {
        const el = dots[i] as SVGCircleElement
        el.setAttribute("cx", String(ox[i]))
        el.setAttribute("cy", String(oy[i]))
      }
    }
  }, [repel, repelRadius, repelStrength, dotColor, dotRadius])

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("text-gray-500 dark:text-gray-500", className)}
      style={{ width: "100%", height: "100%", ...style }}
      {...svgProps}
    >
      <defs>
        <filter id="marker-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g ref={dotsGroupRef}>
        {points.map((point, index) => {
          const rowIndex = yToRowIndex.get(point.y) ?? 0
          const offsetX = stagger && rowIndex % 2 === 1 ? xStep / 2 : 0
          const cx = point.x + offsetX
          const cy = point.y
          return (
            <circle
              cx={cx}
              cy={cy}
              r={dotRadius}
              fill={dotColor}
              data-ox={cx}
              data-oy={cy}
              key={`${point.x}-${point.y}-${index}`}
            />
          )
        })}
      </g>

      {processedMarkers.map((marker, index) => {
        const rowIndex = yToRowIndex.get(marker.y) ?? 0
        const offsetX = stagger && rowIndex % 2 === 1 ? xStep / 2 : 0

        const x = marker.x + offsetX
        const y = marker.y
        const r = marker.size ?? dotRadius
        const shouldPulse = pulse
          ? marker.pulse !== false
          : marker.pulse === true
        const pulseTo = r * 2.8

        return (
          <g key={`${marker.x}-${marker.y}-${index}`} filter="url(#marker-glow)">
            <circle cx={x} cy={y} r={r} fill={markerColor} />

            {shouldPulse ? (
              <g pointerEvents="none">
                <circle
                  cx={x}
                  cy={y}
                  r={r}
                  fill="none"
                  stroke={markerColor}
                  strokeOpacity={1}
                  strokeWidth={0.35}
                >
                  <animate
                    attributeName="r"
                    values={`${r};${pulseTo}`}
                    dur="1.4s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="1;0"
                    dur="1.4s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle
                  cx={x}
                  cy={y}
                  r={r}
                  fill="none"
                  stroke={markerColor}
                  strokeOpacity={0.9}
                  strokeWidth={0.3}
                >
                  <animate
                    attributeName="r"
                    values={`${r};${pulseTo}`}
                    dur="1.4s"
                    begin="0.7s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.9;0"
                    dur="1.4s"
                    begin="0.7s"
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            ) : null}

            {renderMarkerOverlay?.({
              marker: { ...marker, x, y },
              index,
              x,
              y,
              r,
            })}
          </g>
        )
      })}
    </svg>
  )
}
