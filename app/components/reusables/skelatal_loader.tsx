const SWEEP_KEYFRAMES = `
  @keyframes skel-sweep {
    0%   { background-position: -300% center; }
    100% { background-position:  300% center; }
  }
  @keyframes skel-in {
    from { opacity: 0; transform: translateY(5px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const SIZES = {
  sm: { avatar: 28, lineH: 9, subH: 7, gap: 8, pad: "0.65rem 0.9rem" },
  md: { avatar: 36, lineH: 12, subH: 9, gap: 10, pad: "1rem 1.25rem" },
  lg: { avatar: 46, lineH: 15, subH: 11, gap: 13, pad: "1.25rem 1.5rem" },
} as const;

type SkeletonSize = keyof typeof SIZES;
type SkeletonVariant = "card" | "row" | "stat";

interface SkeletonLoaderProps {
  count?: number;
  size?: SkeletonSize;
  variant?: SkeletonVariant;
  maxWidth?: string | number;
  className?: string;
}

// ── primitives ─────────────────────────────────────────────────────────────

const shimmer: React.CSSProperties = {
  background: `linear-gradient(
    100deg,
    var(--skel-base) 0%,
    var(--skel-base) 35%,
    var(--skel-shine) 50%,
    var(--skel-base) 65%,
    var(--skel-base) 100%
  )`,
  backgroundSize: "300% 100%",
  animationName: "skel-sweep",
  animationDuration: "2s",
  animationTimingFunction: "ease",
  animationIterationCount: "infinite",
};

function Bar({
  width = "100%",
  height,
  delay = 0,
  style,
}: {
  width?: string | number;
  height: number;
  delay?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        ...shimmer,
        width,
        height,
        borderRadius: 6,
        animationDelay: `${delay}s`,
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

function Circle({ size, delay = 0 }: { size: number; delay?: number }) {
  return (
    <div
      style={{
        ...shimmer,
        width: size,
        height: size,
        borderRadius: "50%",
        flexShrink: 0,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

// ── variants ───────────────────────────────────────────────────────────────

function CardSkeleton({
  s,
  d,
}: {
  s: (typeof SIZES)[SkeletonSize];
  d: number;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: s.gap }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: s.gap,
          marginBottom: s.gap * 0.4,
        }}
      >
        <Circle size={s.avatar} delay={d} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: Math.round(s.gap * 0.6),
            flex: 1,
          }}
        >
          <Bar width="62%" height={s.lineH} delay={d} />
          <Bar width="38%" height={s.subH} delay={d + 0.07} />
        </div>
        <Bar width={50} height={s.subH + 2} delay={d + 0.05} />
      </div>
      <div
        style={{
          height: "0.5px",
          background: "var(--grey-1, rgba(120,120,120,0.18))",
        }}
      />
      <Bar width="100%" height={s.subH} delay={d + 0.1} />
      <Bar width="78%" height={s.subH} delay={d + 0.15} />
      <Bar width="52%" height={s.subH} delay={d + 0.2} />
    </div>
  );
}

function RowSkeleton({ s, d }: { s: (typeof SIZES)[SkeletonSize]; d: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: s.gap }}>
      <Circle size={s.avatar} delay={d} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: Math.round(s.gap * 0.65),
          flex: 1,
        }}
      >
        <Bar width="55%" height={s.lineH} delay={d} />
        <Bar width="35%" height={s.subH} delay={d + 0.08} />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: Math.round(s.gap * 0.5),
        }}
      >
        <Bar width={60} height={s.lineH} delay={d + 0.06} />
        <Bar width={42} height={s.subH} delay={d + 0.12} />
      </div>
    </div>
  );
}

function StatSkeleton({
  s,
  d,
}: {
  s: (typeof SIZES)[SkeletonSize];
  d: number;
}) {
  const bigH = Math.round(s.lineH * 2.2);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: s.gap }}>
      <Bar width="42%" height={s.subH} delay={d} />
      <Bar width="55%" height={bigH} delay={d + 0.1} />
      <div
        style={{
          height: "0.5px",
          background: "var(--grey-1, rgba(120,120,120,0.18))",
        }}
      />
      <div style={{ display: "flex", gap: s.gap }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: Math.round(s.gap * 0.5),
          }}
        >
          <Bar width="70%" height={s.subH} delay={d + 0.15} />
          <Bar width="50%" height={s.subH} delay={d + 0.2} />
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: Math.round(s.gap * 0.5),
          }}
        >
          <Bar width="60%" height={s.subH} delay={d + 0.18} />
          <Bar width="40%" height={s.subH} delay={d + 0.23} />
        </div>
      </div>
    </div>
  );
}

// ── main component ──────────────────────────────────────────────────────────

const STAGGER = [0, 0.12, 0.22, 0.3, 0.36, 0.4];

const VARIANT_MAP = {
  card: CardSkeleton,
  row: RowSkeleton,
  stat: StatSkeleton,
};

export default function SkeletonLoader({
  count = 1,
  size = "md",
  variant = "card",
  maxWidth,
  className,
}: SkeletonLoaderProps) {
  const s = SIZES[size];
  const Item = VARIANT_MAP[variant];

  return (
    <>
      <style>{`
        :root {
          --skel-base:  rgba(128,128,128,0.12);
          --skel-shine: rgba(255,255,255,0.20);
        }
        @media (prefers-color-scheme: dark) {
          :root {
            --skel-base:  rgba(255,255,255,0.07);
            --skel-shine: rgba(255,255,255,0.04);
          }
        }
        ${SWEEP_KEYFRAMES}
      `}</style>

      <div
        className={className}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          maxWidth: maxWidth ?? "100%",
        }}
      >
        {Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            style={{
              background: "var(--background)",
              border: "1px solid var(--grey-1, rgba(120,120,120,0.18))",
              borderRadius: 12,
              padding: s.pad,
              animationName: "skel-in",
              animationDuration: "0.35s",
              animationTimingFunction: "ease",
              animationFillMode: "both",
              animationDelay: `${STAGGER[i] ?? 0.4}s`,
            }}
          >
            <Item s={s} d={STAGGER[i] ?? 0} />
          </div>
        ))}
      </div>
    </>
  );
}

// usage:
{
  /* <SkeletonLoader count={3} size="md" variant="row" /> */
}

// Single loan detail card loading
{
  /* <SkeletonLoader varia<div className="grid grid-cols-2 gap-3">
  <SkeletonLoader variant="stat" size="sm" />
  <SkeletonLoader variant="stat" size="sm" />
</div>nt="card" size="lg" /> */
}

// Dashboard stat blocks — 2 side by side
{
  /*  */
}
