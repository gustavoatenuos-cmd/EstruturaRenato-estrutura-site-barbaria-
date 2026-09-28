import { useCallback, useRef, useState } from "react";
import { GripVertical } from "lucide-react";

type Props = {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt?: string;
  afterAlt?: string;
};

export function CompareSlider({
  beforeSrc,
  afterSrc,
  beforeAlt = "Antes da prótese capilar",
  afterAlt = "Depois da prótese capilar",
}: Props) {
  const [position, setPosition] = useState(50);
  const ref = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, next)));
  }, []);

  return (
    <div
      ref={ref}
      className="compare"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        updatePosition(e.clientX);
      }}
      onPointerMove={(e) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) updatePosition(e.clientX);
      }}
      role="slider"
      aria-label="Comparar antes e depois"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(position)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") setPosition((p) => Math.max(0, p - 5));
        if (e.key === "ArrowRight") setPosition((p) => Math.min(100, p + 5));
      }}
    >
      <img src={afterSrc} alt={afterAlt} className="compare-image" draggable={false} />
      <div className="compare-before" style={{ width: `${position}%` }}>
        <img src={beforeSrc} alt={beforeAlt} className="compare-image compare-before-image" draggable={false} />
      </div>

      <div className="compare-label compare-label-left">ANTES</div>
      <div className="compare-label compare-label-right">DEPOIS</div>

      <div className="compare-line" style={{ left: `${position}%` }}>
        <div className="compare-handle">
          <GripVertical size={20} />
        </div>
      </div>
    </div>
  );
}