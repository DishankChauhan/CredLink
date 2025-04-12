"use client"

import React from "react"
import { LogoCarousel } from "./LogoCarousel"

// Simple SVG logo components
const BlockchainLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M21 9L12 3L3 9M21 9L12 15M21 9V15L12 21M3 9L12 15M3 9V15L12 21M12 15V9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const VerifyLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const CredentialLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const CertificateLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M16 16L19 19M13 17C10.7909 17 9 15.2091 9 13C9 10.7909 10.7909 9 13 9C15.2091 9 17 10.7909 17 13C17 15.2091 15.2091 17 13 17ZM7 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3H20C20.5523 3 21 3.44772 21 4V7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const ChainLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M13.5442 10.4558C14.8317 11.7433 14.8317 13.8142 13.5442 15.1017C12.2567 16.3892 10.1858 16.3892 8.8983 15.1017C7.61082 13.8142 7.61082 11.7433 8.8983 10.4558M13.5442 10.4558C12.2567 9.16828 10.1858 9.16828 8.8983 10.4558M13.5442 10.4558L17.6983 6.30165M8.8983 10.4558L4.74419 6.30165M17.6983 6.30165C18.9858 5.01417 18.9858 2.94329 17.6983 1.65581C16.4108 0.368322 14.34 0.368323 13.0525 1.65581C11.765 2.94329 11.765 5.01417 13.0525 6.30165C14.34 7.58914 16.4108 7.58914 17.6983 6.30165ZM4.74419 6.30165C3.45671 5.01417 3.45671 2.94329 4.74419 1.65581C6.03167 0.368322 8.10256 0.368323 9.39004 1.65581C10.6775 2.94329 10.6775 5.01417 9.39004 6.30165C8.10256 7.58914 6.03167 7.58914 4.74419 6.30165Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const TrustLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M9 12L11 14L15 10M7.83987 4.2948C9.14212 3.42378 10.6104 2.90386 12.1682 2.75879C13.726 2.61372 15.2903 2.84907 16.7252 3.44641C18.1602 4.04375 19.4117 4.98324 20.3644 6.18562C21.3171 7.38801 21.9366 8.81309 22.1693 10.3202C22.402 11.8272 22.2399 13.3673 21.6983 14.793C21.1567 16.2186 20.2562 17.481 19.0853 18.4493C17.9144 19.4176 16.5159 20.0562 15.0284 20.3083C13.5409 20.5605 12.011 20.4167 10.5925 19.8901C10.3002 19.7889 10.0342 19.6175 9.81548 19.3893C9.59673 19.1611 9.4308 18.8824 9.33086 18.5777C9.23092 18.2729 9.20009 17.9505 9.24145 17.6342C9.28281 17.3179 9.39515 17.0168 9.56895 16.7548C9.70056 16.5454 9.87391 16.3648 10.0785 16.224C10.2831 16.0831 10.515 15.9847 10.7608 15.9353C11.0066 15.8859 11.2597 15.8867 11.5052 15.9374C11.7507 15.9882 11.9819 16.0878 12.1854 16.2298L12.1942 16.2364C12.7342 16.6178 13.356 16.8464 14.0011 16.9037C14.6462 16.9611 15.2947 16.8454 15.8833 16.5672C16.4719 16.289 16.9803 15.8585 17.3602 15.3188C17.7401 14.779 17.9787 14.1483 18.0523 13.4878C18.126 12.8273 18.0324 12.1592 17.7803 11.5469C17.5283 10.9347 17.1259 10.3992 16.6113 9.98892C16.0967 9.57868 15.4843 9.30391 14.8371 9.18743C14.19 9.07094 13.5262 9.11634 12.9018 9.31935C12.7272 9.37098 12.5442 9.38932 12.3627 9.37342C12.1812 9.35751 12.0043 9.30758 11.8417 9.2264C11.6792 9.14522 11.5343 9.03429 11.4146 8.90674C11.2949 8.77919 11.2025 8.63021 11.1422 8.46758C11.082 8.30496 11.0556 8.13217 11.0641 7.95951C11.0727 7.78686 11.1162 7.61815 11.1923 7.46253C11.2683 7.3069 11.3757 7.16787 11.5077 7.05446C11.6397 6.94104 11.7933 6.8552 11.9582 6.80207C12.123 6.74894 12.2962 6.72961 12.4685 6.74506C13.1127 6.81057 13.7689 6.70782 14.3664 6.44692C14.9639 6.18601 15.4818 5.77517 15.8677 5.25635C16.2535 4.73754 16.495 4.13001 16.564 3.49055C16.6329 2.85109 16.5268 2.20581 16.2562 1.62096C16.1959 1.49967 16.1619 1.36691 16.1566 1.23106C16.1512 1.0952 16.1747 0.95982 16.2253 0.83343C16.2759 0.70704 16.3523 0.591893 16.4487 0.495244C16.545 0.398596 16.6592 0.322686 16.7839 0.2723"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// Logo data for the carousel
const logoData = [
  {
    id: 1,
    name: "Blockchain",
    img: BlockchainLogo,
  },
  {
    id: 2,
    name: "Verify",
    img: VerifyLogo,
  },
  {
    id: 3,
    name: "Credential",
    img: CredentialLogo,
  },
  {
    id: 4,
    name: "Certificate",
    img: CertificateLogo,
  },
  {
    id: 5,
    name: "Chain",
    img: ChainLogo,
  },
  {
    id: 6,
    name: "Trust",
    img: TrustLogo,
  },
]

export function CompanyLogos() {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <LogoCarousel logos={logoData} columnCount={3} />
    </div>
  )
} 