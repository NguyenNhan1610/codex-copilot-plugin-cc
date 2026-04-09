import { useCallback, useRef, useState } from "react";

interface ResizeHandleProps {
  onResize: (delta: number) => void;
  onDoubleClick?: () => void;
}

export function ResizeHandle({ onResize, onDoubleClick }: ResizeHandleProps) {
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const startXRef = useRef(0);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      startXRef.current = e.clientX;
      setDragging(true);

      const handleMouseMove = (ev: MouseEvent) => {
        const delta = ev.clientX - startXRef.current;
        startXRef.current = ev.clientX;
        onResize(delta);
      };

      const handleMouseUp = () => {
        setDragging(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    [onResize]
  );

  const bg = dragging
    ? "var(--accent-blue)"
    : hovered
      ? "var(--resize-hover)"
      : "transparent";

  return (
    <div
      onMouseDown={handleMouseDown}
      onDoubleClick={onDoubleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 4,
        flexShrink: 0,
        cursor: "col-resize",
        background: bg,
        transition: "background 150ms ease",
        position: "relative",
        zIndex: 10,
      }}
    >
      {/* Wider hit area */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: -4,
          right: -4,
        }}
      />
    </div>
  );
}
