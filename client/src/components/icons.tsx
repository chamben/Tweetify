interface IconProps {
  size?: number;
}

export function HeartIcon({ size = 18 }: IconProps): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 21s-6.7-4.35-9.3-8.2C1 10.1 1.5 6.5 4.6 5.1c2.2-1 4.7-.2 6 1.7l1.4 2 1.4-2c1.3-1.9 3.8-2.7 6-1.7 3.1 1.4 3.6 5 1.9 7.7C18.7 16.65 12 21 12 21z" />
    </svg>
  );
}

export function HeartFilledIcon({ size = 18 }: IconProps): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21s-6.7-4.35-9.3-8.2C1 10.1 1.5 6.5 4.6 5.1c2.2-1 4.7-.2 6 1.7l1.4 2 1.4-2c1.3-1.9 3.8-2.7 6-1.7 3.1 1.4 3.6 5 1.9 7.7C18.7 16.65 12 21 12 21z" />
    </svg>
  );
}

export function CommentIcon({ size = 18 }: IconProps): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

export function BackIcon({ size = 20 }: IconProps): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function EditIcon({ size = 16 }: IconProps): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20h9" strokeLinecap="round" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DeleteIcon({ size = 16 }: IconProps): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18" strokeLinecap="round" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6h12z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LogoIcon({ size = 32 }: IconProps): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Two overlapping speech bubbles representing conversation/community. */}
      <path
        d="M2 6.5C2 4.57 3.57 3 5.5 3h8C15.43 3 17 4.57 17 6.5v4c0 1.93-1.57 3.5-3.5 3.5H8.8l-3.9 2.9A.6.6 0 0 1 4 16.4V6.5z"
        fill="currentColor"
        opacity="0.4"
      />
      <path
        d="M7 11.5C7 9.57 8.57 8 10.5 8h7c1.93 0 3.5 1.57 3.5 3.5v4c0 1.93-1.57 3.5-3.5 3.5h-4.2l-3.9 2.9a.6.6 0 0 1-.96-.48V11.5z"
        fill="currentColor"
      />
    </svg>
  );
}


