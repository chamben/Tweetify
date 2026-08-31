const PALETTE = ['#f91880', '#1d9bf0', '#00ba7c', '#ffad1f', '#7856ff', '#f4212e'];

function colorForUsername(username: string): string {
  let hash = 0;
  for (let i = 0; i < username.length; i += 1) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export function Avatar({ username, size = 40 }: { username: string; size?: number }): JSX.Element {
  const initial = username.charAt(0).toUpperCase();
  return (
    <div
      className="avatar"
      style={{
        backgroundColor: colorForUsername(username),
        width: size,
        height: size,
        fontSize: size * 0.45,
      }}
      aria-hidden="true"
    >
      {initial}
    </div>
  );
}
