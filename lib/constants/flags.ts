// Country (English name as returned by Buckler's home_name) → ISO 3166-1 alpha-2 code.
// The flag emoji is generated from the code, so adding a country is a one-line entry.
const NAME_TO_ISO2: Record<string, string> = {
  Afghanistan: 'AF', Albania: 'AL', Algeria: 'DZ', Andorra: 'AD', Angola: 'AO',
  Argentina: 'AR', Armenia: 'AM', Australia: 'AU', Austria: 'AT', Azerbaijan: 'AZ',
  Bahrain: 'BH', Bangladesh: 'BD', Belarus: 'BY', Belgium: 'BE', Bolivia: 'BO',
  'Bosnia and Herzegovina': 'BA', Brazil: 'BR', Bulgaria: 'BG', Cambodia: 'KH', Canada: 'CA',
  Chile: 'CL', China: 'CN', Colombia: 'CO', 'Costa Rica': 'CR', Croatia: 'HR',
  Cyprus: 'CY', 'Czech Republic': 'CZ', Czechia: 'CZ', Denmark: 'DK', 'Dominican Republic': 'DO',
  Ecuador: 'EC', Egypt: 'EG', 'El Salvador': 'SV', Estonia: 'EE', Finland: 'FI',
  France: 'FR', Georgia: 'GE', Germany: 'DE', Greece: 'GR', Guatemala: 'GT',
  Honduras: 'HN', 'Hong Kong': 'HK', Hungary: 'HU', Iceland: 'IS', India: 'IN',
  Indonesia: 'ID', Iran: 'IR', Iraq: 'IQ', Ireland: 'IE', Israel: 'IL',
  Italy: 'IT', Jamaica: 'JM', Japan: 'JP', Jordan: 'JO', Kazakhstan: 'KZ',
  Kenya: 'KE', Kuwait: 'KW', Latvia: 'LV', Lebanon: 'LB', Liechtenstein: 'LI',
  Lithuania: 'LT', Luxembourg: 'LU', Macau: 'MO', Malaysia: 'MY', Malta: 'MT',
  Mexico: 'MX', Moldova: 'MD', Monaco: 'MC', Mongolia: 'MN', Montenegro: 'ME',
  Morocco: 'MA', Nepal: 'NP', Netherlands: 'NL', 'New Zealand': 'NZ', Nicaragua: 'NI',
  Nigeria: 'NG', 'North Macedonia': 'MK', Norway: 'NO', Oman: 'OM', Pakistan: 'PK',
  Panama: 'PA', Paraguay: 'PY', Peru: 'PE', Philippines: 'PH', Poland: 'PL',
  Portugal: 'PT', 'Puerto Rico': 'PR', Qatar: 'QA', Romania: 'RO', Russia: 'RU',
  'Saudi Arabia': 'SA', Serbia: 'RS', Singapore: 'SG', Slovakia: 'SK', Slovenia: 'SI',
  'South Africa': 'ZA', 'South Korea': 'KR', Spain: 'ES', 'Sri Lanka': 'LK', Sweden: 'SE',
  Switzerland: 'CH', Taiwan: 'TW', Thailand: 'TH', Tunisia: 'TN', Turkey: 'TR',
  'Türkiye': 'TR', Ukraine: 'UA', 'United Arab Emirates': 'AE', 'United Kingdom': 'GB',
  'United States': 'US', Uruguay: 'UY', Uzbekistan: 'UZ', Venezuela: 'VE', Vietnam: 'VN',
}

// ISO2 → regional-indicator emoji (e.g. 'FR' → 🇫🇷).
function iso2ToEmoji(iso2: string): string {
  return iso2.toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)))
}

export function countryFlag(name: string | null | undefined): string {
  if (!name) return ''
  const iso = NAME_TO_ISO2[name.trim()]
  return iso ? iso2ToEmoji(iso) : ''
}
