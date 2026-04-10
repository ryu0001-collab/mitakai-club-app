import { getFacultyRingColor } from "@/lib/facultyColors";

type Props = {
  avatarUrl: string | null;
  faculty: string | null;
  name?: string;
  initial?: string;
  size?: number;
  ringWidth?: number;
};

export default function FacultyRingAvatar({
  avatarUrl,
  faculty,
  name,
  initial,
  size = 56,
  ringWidth = 3,
}: Props) {
  const ringColor = getFacultyRingColor(faculty);
  const gap = 2; // 白い隙間(px)
  const outerSize = size + (ringWidth + gap) * 2;

  return (
    <div
      style={{
        width: outerSize,
        height: outerSize,
        borderRadius: "50%",
        backgroundColor: ringColor,
        padding: ringWidth,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          border: `${gap}px solid white`,
          overflow: "hidden",
          backgroundColor: "#dbeafe",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={name ?? ""}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span
            style={{
              color: "#2563eb",
              fontWeight: "bold",
              fontSize: size * 0.4,
            }}
          >
            {initial ?? (name ? name[0] : "?")}
          </span>
        )}
      </div>
    </div>
  );
}
