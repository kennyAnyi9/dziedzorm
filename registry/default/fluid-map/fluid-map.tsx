"use client";

import * as React from "react";
import { createMap } from "svg-dotted-map";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Marker {
  lat: number;
  lng: number;
  size?: number;
  pulse?: boolean;
}

type MapMarker<M extends Marker> = Omit<M, "lat" | "lng"> & {
  x: number;
  y: number;
};

export interface FluidMapProps<
  M extends Marker = Marker,
> extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  mapSamples?: number;
  markers?: M[];
  dotColor?: string;
  markerColor?: string;
  dotRadius?: number;
  stagger?: boolean;
  pulse?: boolean;
  /** Enable swirl physics on mouse interaction */
  fluid?: boolean;
  /** Radius of the influence area around the cursor (in SVG units) */
  fluidRadius?: number;
  /** Strength of the swirl force */
  fluidStrength?: number;
  renderMarkerOverlay?: (args: {
    marker: MapMarker<M>;
    index: number;
    x: number;
    y: number;
    r: number;
  }) => React.ReactNode;
}

export function FluidMap<M extends Marker = Marker>({
  width = 150,
  height = 75,
  mapSamples = 5000,
  markers = [],
  dotColor = "currentColor",
  markerColor = "#FF6900",
  dotRadius = 0.2,
  stagger = true,
  pulse = false,
  fluid = true,
  fluidRadius = 20,
  fluidStrength = 0.4,
  renderMarkerOverlay,
  className,
  style,
  ...svgProps
}: FluidMapProps<M>) {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const dotsGroupRef = React.useRef<SVGGElement>(null);

  const { points, processedMarkers, xStep, yToRowIndex } = React.useMemo(() => {
    const { points: pts, addMarkers } = createMap({ width, height, mapSamples });
    const pm = addMarkers(markers);

    const sorted = [...pts].sort((a, b) => a.y - b.y || a.x - b.x);
    const rowMap = new Map<number, number>();
    let step = 0;
    let prevY = Number.NaN;
    let prevXInRow = Number.NaN;

    for (const p of sorted) {
      if (p.y !== prevY) {
        prevY = p.y;
        prevXInRow = Number.NaN;
        if (!rowMap.has(p.y)) rowMap.set(p.y, rowMap.size);
      }
      if (!Number.isNaN(prevXInRow)) {
        const delta = p.x - prevXInRow;
        if (delta > 0) step = step === 0 ? delta : Math.min(step, delta);
      }
      prevXInRow = p.x;
    }

    return { points: pts, processedMarkers: pm, xStep: step || 1, yToRowIndex: rowMap };
  }, [width, height, mapSamples, markers]);

  React.useEffect(() => {
    if (!fluid) return;
    const svg = svgRef.current;
    const dotsGroup = dotsGroupRef.current;
    if (!svg || !dotsGroup) return;

    const dots = dotsGroup.children;
    const count = dots.length;

    const dx = new Float32Array(count);
    const dy = new Float32Array(count);
    const vx = new Float32Array(count);
    const vy = new Float32Array(count);
    const ox = new Float32Array(count);
    const oy = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const el = dots[i] as SVGCircleElement;
      ox[i] = parseFloat(el.getAttribute("data-ox") || "0");
      oy[i] = parseFloat(el.getAttribute("data-oy") || "0");
    }

    const mouse = { x: 0, y: 0, active: false, wasActive: false };
    const activeSet = new Set<number>();

    const SPRING = 0.05;
    const DAMPING = 0.78;
    const SNAP = 0.002;
    const LEAVE_DAMPING = 0.92;
    const R = fluidRadius;
    const R2 = R * R;
    const STRENGTH = fluidStrength;

    function screenToSVG(clientX: number, clientY: number) {
      const ctm = svg!.getScreenCTM();
      if (!ctm) return null;
      const inv = ctm.inverse();
      return {
        x: inv.a * clientX + inv.c * clientY + inv.e,
        y: inv.b * clientX + inv.d * clientY + inv.f,
      };
    }

    function onPointerMove(e: PointerEvent) {
      const rect = svg!.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        const pos = screenToSVG(e.clientX, e.clientY);
        if (pos) {
          mouse.x = pos.x;
          mouse.y = pos.y;
          mouse.active = true;
        }
      } else {
        mouse.active = false;
      }
    }

    function onPointerLeave() {
      mouse.wasActive = mouse.active;
      mouse.active = false;
    }

    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerleave", onPointerLeave);

    let rafId: number;

    function animate() {
      if (mouse.active) {
        const scanR2 = R * 1.5 * (R * 1.5);
        for (let i = 0; i < count; i++) {
          const distX = ox[i] - mouse.x;
          const distY = oy[i] - mouse.y;
          if (distX * distX + distY * distY < scanR2) activeSet.add(i);
        }
      }

      const toRemove: number[] = [];

      for (const i of activeSet) {
        if (mouse.active) {
          const curX = ox[i] + dx[i];
          const curY = oy[i] + dy[i];
          const distX = curX - mouse.x;
          const distY = curY - mouse.y;
          const dist2 = distX * distX + distY * distY;

          if (dist2 < R2 && dist2 > 0.0001) {
            const dist = Math.sqrt(dist2);
            const t = 1 - dist / R;
            const force = STRENGTH * t * t;

            // Repulsive force pushing dots away from cursor
            vx[i] += (distX / dist) * force;
            vy[i] += (distY / dist) * force;
          }
        }

        vx[i] += -SPRING * dx[i];
        vy[i] += -SPRING * dy[i];
        const currentDamping = mouse.active ? DAMPING : LEAVE_DAMPING;
        vx[i] *= currentDamping;
        vy[i] *= currentDamping;
        dx[i] += vx[i];
        dy[i] += vy[i];

        const disp = Math.sqrt(dx[i] * dx[i] + dy[i] * dy[i]);

        if (disp < SNAP && Math.abs(vx[i]) < SNAP && Math.abs(vy[i]) < SNAP) {
          dx[i] = dy[i] = vx[i] = vy[i] = 0;
          const el = dots[i] as SVGCircleElement;
          el.setAttribute("cx", String(ox[i]));
          el.setAttribute("cy", String(oy[i]));
          toRemove.push(i);
        } else {
          const el = dots[i] as SVGCircleElement;
          el.setAttribute("cx", String(ox[i] + dx[i]));
          el.setAttribute("cy", String(oy[i] + dy[i]));
        }
      }

      for (const i of toRemove) activeSet.delete(i);

      rafId = requestAnimationFrame(animate);
    }

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      for (let i = 0; i < count; i++) {
        const el = dots[i] as SVGCircleElement;
        el.setAttribute("cx", String(ox[i]));
        el.setAttribute("cy", String(oy[i]));
      }
    };
  }, [fluid, fluidRadius, fluidStrength, dotColor, dotRadius]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("text-gray-500 dark:text-gray-500", className)}
      style={{ width: "100%", height: "100%", ...style }}
      {...svgProps}
    >
      <defs>
        <filter
          id="fluid-map-marker-glow"
          x="-200%"
          y="-200%"
          width="500%"
          height="500%"
        >
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
          const rowIndex = yToRowIndex.get(point.y) ?? 0;
          const offsetX = stagger && rowIndex % 2 === 1 ? xStep / 2 : 0;
          const cx = point.x + offsetX;
          const cy = point.y;
          return (
            <circle
              key={`${point.x}-${point.y}-${index}`}
              cx={cx}
              cy={cy}
              r={dotRadius}
              fill={dotColor}
              data-ox={cx}
              data-oy={cy}
            />
          );
        })}
      </g>

      {processedMarkers.map((marker, index) => {
        const rowIndex = yToRowIndex.get(marker.y) ?? 0;
        const offsetX = stagger && rowIndex % 2 === 1 ? xStep / 2 : 0;
        const x = marker.x + offsetX;
        const y = marker.y;
        const r = marker.size ?? dotRadius;
        const shouldPulse = pulse
          ? marker.pulse !== false
          : marker.pulse === true;
        const pulseTo = r * 2.8;

        return (
          <g
            key={`${marker.x}-${marker.y}-${index}`}
            filter="url(#fluid-map-marker-glow)"
          >
            <circle cx={x} cy={y} r={r} fill={markerColor} />
            {shouldPulse && (
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
            )}
            {renderMarkerOverlay?.({
              marker: { ...marker, x, y },
              index,
              x,
              y,
              r,
            })}
          </g>
        );
      })}
    </svg>
  );
}

export default FluidMap;
