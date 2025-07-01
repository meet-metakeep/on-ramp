/**
 * @title Country Names Utility
 * @notice Provides country code to country name mapping for onramp functionality
 * @dev Used for country selection dropdown in the onramp interface
 * @author Meet - Coinbase Onramp Integration Demo
 */

/**
 * @dev Mapping of ISO country codes to human-readable country names
 * @notice Used for populating country selection dropdown
 */
export const countryNames: Record<string, string> = {
  // North America
  US: "United States",
  CA: "Canada",
  MX: "Mexico",

  // Europe
  GB: "United Kingdom",
  DE: "Germany",
  FR: "France",
  ES: "Spain",
  IT: "Italy",
  NL: "Netherlands",
  CH: "Switzerland",
  SE: "Sweden",
  NO: "Norway",
  DK: "Denmark",
  FI: "Finland",
  IE: "Ireland",
  AT: "Austria",
  BE: "Belgium",
  PT: "Portugal",
  GR: "Greece",
  PL: "Poland",
  CZ: "Czech Republic",
  SK: "Slovakia",
  HU: "Hungary",
  RO: "Romania",
  BG: "Bulgaria",
  HR: "Croatia",
  SI: "Slovenia",
  LT: "Lithuania",
  LV: "Latvia",
  EE: "Estonia",
  CY: "Cyprus",
  MT: "Malta",
  LU: "Luxembourg",
  IS: "Iceland",
  LI: "Liechtenstein",
  MC: "Monaco",

  // Asia Pacific
  AU: "Australia",
  NZ: "New Zealand",
  JP: "Japan",
  SG: "Singapore",
  HK: "Hong Kong",
  KR: "South Korea",
  TW: "Taiwan",
  TH: "Thailand",
  MY: "Malaysia",
  PH: "Philippines",
  ID: "Indonesia",
  VN: "Vietnam",
  IN: "India",
  CN: "China",

  // Middle East & Africa
  AE: "United Arab Emirates",
  SA: "Saudi Arabia",
  QA: "Qatar",
  BH: "Bahrain",
  KW: "Kuwait",
  OM: "Oman",
  IL: "Israel",
  ZA: "South Africa",
  EG: "Egypt",
  NG: "Nigeria",
  KE: "Kenya",

  // Latin America
  BR: "Brazil",
  AR: "Argentina",
  CL: "Chile",
  CO: "Colombia",
  PE: "Peru",
  UY: "Uruguay",
  CR: "Costa Rica",
  PA: "Panama",

  // Other regions
  TR: "Turkey",
  RU: "Russia",
  UA: "Ukraine",
  BY: "Belarus",
  KZ: "Kazakhstan",
};
