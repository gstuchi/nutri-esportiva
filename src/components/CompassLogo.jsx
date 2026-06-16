export default function CompassLogo({ size = 32 }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size}>
      <circle cx="60" cy="60" r="56" fill="rgba(255,255,255,0.15)" />
      <circle cx="60" cy="60" r="44" fill="rgba(255,255,255,0.1)" />
      <polygon points="60,10 66,52 60,60 54,52" fill="white" />
      <polygon points="60,110 66,68 60,60 54,68" fill="white" />
      <polygon points="110,60 68,54 60,60 68,66" fill="white" />
      <polygon points="10,60 52,54 60,60 52,66" fill="white" />
      <polygon points="97,23 66,55 60,60 65,53" fill="rgba(255,255,255,0.6)" />
      <polygon points="23,97 54,65 60,60 55,67" fill="rgba(255,255,255,0.6)" />
      <polygon points="23,23 55,55 60,60 53,55" fill="rgba(255,255,255,0.6)" />
      <polygon points="97,97 65,65 60,60 67,65" fill="rgba(255,255,255,0.6)" />
    </svg>
  )
}
