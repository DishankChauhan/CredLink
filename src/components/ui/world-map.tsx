"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import DottedMap from "dotted-map";
import Image from "next/image";

interface MapProps {
  dots?: Array<{
    start: { lat: number; lng: number; label?: string };
    end: { lat: number; lng: number; label?: string };
  }>;
  lineColor?: string;
}

export function WorldMap({
  dots = [],
  lineColor = "#16b1ff",
}: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Create a map with appropriate dot density
  const map = new DottedMap({ 
    height: 70, // Balanced height to show the entire world properly
    grid: "diagonal"
  });

  // Create a crisp, clean map with smaller dots
  const svgMap = map.getSVG({
    radius: 0.35, // Increased dot size for better visibility
    color: "#00000030", // Darker dots with higher opacity
    shape: "circle",
    backgroundColor: "transparent", // Transparent background
  });

  const projectPoint = (lat: number, lng: number) => {
    const x = (lng + 180) * (1000 / 360);
    const y = (90 - lat) * (500 / 180);
    return { x, y };
  };

  const createCurvedPath = (
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) => {
    // Calculate control points for a nice smooth curve
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Adjust curvature based on distance
    const curvature = Math.min(0.4, Math.max(0.2, distance / 1000));
    
    // Calculate control point
    const mx = start.x + dx * 0.5;
    const my = start.y + dy * 0.5;
    
    // Calculate perpendicular offset
    const nx = -dy;
    const ny = dx;
    
    // Normalize and apply curvature
    const norm = Math.sqrt(nx * nx + ny * ny);
    const cx = mx + (nx / norm) * distance * curvature;
    const cy = my + (ny / norm) * distance * curvature;
    
    return `M ${start.x} ${start.y} Q ${cx} ${cy} ${end.x} ${end.y}`;
  };

  return (
    <div className="w-full h-full absolute inset-0 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
          className="w-full h-full object-contain pointer-events-none select-none"
          alt="world map"
          fill
          priority
          quality={100}
          draggable={false}
        />
        <svg
          ref={svgRef}
          viewBox="0 0 1000 500"
          className="w-full h-full absolute inset-0 pointer-events-none select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          {dots.map((dot, i) => {
            const startPoint = projectPoint(dot.start.lat, dot.start.lng);
            const endPoint = projectPoint(dot.end.lat, dot.end.lng);
            return (
              <g key={`path-group-${i}`}>
                <motion.path
                  d={createCurvedPath(startPoint, endPoint)}
                  fill="none"
                  stroke={lineColor}
                  strokeWidth="1.5"
                  opacity="0.8"
                  initial={{
                    pathLength: 0,
                  }}
                  animate={{
                    pathLength: 1,
                  }}
                  transition={{
                    duration: 1.5,
                    delay: 0.3 * i,
                    ease: "easeOut",
                  }}
                  key={`start-upper-${i}`}
                ></motion.path>
              </g>
            );
          })}

          {dots.map((dot, i) => (
            <g key={`points-group-${i}`}>
              <g key={`start-${i}`}>
                <circle
                  cx={projectPoint(dot.start.lat, dot.start.lng).x}
                  cy={projectPoint(dot.start.lat, dot.start.lng).y}
                  r="2.5"
                  fill={lineColor}
                  opacity="0.9"
                />
                <circle
                  cx={projectPoint(dot.start.lat, dot.start.lng).x}
                  cy={projectPoint(dot.start.lat, dot.start.lng).y}
                  r="2.5"
                  fill={lineColor}
                  opacity="0.5"
                >
                  <animate
                    attributeName="r"
                    from="2.5"
                    to="7"
                    dur="1.8s"
                    begin="0s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.5"
                    to="0"
                    dur="1.8s"
                    begin="0s"
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
              <g key={`end-${i}`}>
                <circle
                  cx={projectPoint(dot.end.lat, dot.end.lng).x}
                  cy={projectPoint(dot.end.lat, dot.end.lng).y}
                  r="2.5"
                  fill={lineColor}
                  opacity="0.9"
                />
                <circle
                  cx={projectPoint(dot.end.lat, dot.end.lng).x}
                  cy={projectPoint(dot.end.lat, dot.end.lng).y}
                  r="2.5"
                  fill={lineColor}
                  opacity="0.5"
                >
                  <animate
                    attributeName="r"
                    from="2.5"
                    to="7"
                    dur="1.8s"
                    begin="0s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.5"
                    to="0"
                    dur="1.8s"
                    begin="0s"
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
