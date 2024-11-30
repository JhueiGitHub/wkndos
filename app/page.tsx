"use client";

import { useState, useEffect, useCallback } from "react";

export default function Home() {
  const [isDockVisible, setIsDockVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });
  const [isInDockZone, setIsInDockZone] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const { clientX, clientY } = e;
    setMousePosition({ x: clientX, y: clientY });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    const dockZoneHeight = 150; // px from bottom of screen
    const isMovingDown = mousePosition.y > lastMousePosition.y;
    const isInZone = window.innerHeight - mousePosition.y <= dockZoneHeight;

    if (isInZone) {
      setIsInDockZone(true);
      if (
        isMovingDown ||
        mousePosition.x !== lastMousePosition.x ||
        mousePosition.y !== lastMousePosition.y
      ) {
        setIsDockVisible(true);
      }
    } else {
      setIsInDockZone(false);
      setIsDockVisible(false);
    }

    setLastMousePosition(mousePosition);

    // Hide dock after 1 second of no movement in the dock zone
    if (
      isInZone &&
      !isMovingDown &&
      mousePosition.x === lastMousePosition.x &&
      mousePosition.y === lastMousePosition.y
    ) {
      const timer = setTimeout(() => setIsDockVisible(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [mousePosition, lastMousePosition]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-200">
      <main className="h-full w-full relative">
        {/* Placeholder background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500"></div>

        {/* Dock */}
        <div
          className={`absolute left-1/2 bottom-2 transform -translate-x-1/2 bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-2 transition-all duration-300 ease-in-out ${
            isDockVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0"
          }`}
        >
          <div className="flex space-x-4">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="w-12 h-12 bg-gray-300 rounded-lg hover:scale-110 transition-transform duration-200 ease-in-out"
              ></div>
            ))}
          </div>
        </div>

        {/* Debug info */}
        <div className="absolute top-2 left-2 text-white text-sm">
          <p>
            Mouse position: {mousePosition.x}, {mousePosition.y}
          </p>
          <p>In dock zone: {isInDockZone ? "Yes" : "No"}</p>
          <p>Dock visible: {isDockVisible ? "Yes" : "No"}</p>
        </div>
      </main>
    </div>
  );
}
