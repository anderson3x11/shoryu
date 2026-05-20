interface CountryFlagProps {
  countryCode: string
  size?: number
}

export function CountryFlag({ countryCode, size = 24 }: CountryFlagProps) {
  if (!countryCode) return null
  // Convert ISO country code to flag emoji
  const flag = countryCode
    .toUpperCase()
    .split('')
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join('')

  return (
    <span style={{ fontSize: size }} title={countryCode} aria-label={countryCode}>
      {flag}
    </span>
  )
}
