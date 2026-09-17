import React from 'react';

interface YuktiLogoProps {
  className?: string;
  size?: number | string;
  variant?: 'color' | 'white' | 'dark';
}

export const YuktiLogo: React.FC<YuktiLogoProps> = ({
  className = '',
  size = 32,
  variant = 'color',
}) => {
  const cyanStroke = variant === 'white' ? '#7dd3fc' : '#00C2FF';
  const navyStroke = variant === 'white' ? '#ffffff' : variant === 'dark' ? '#ffffff' : '#0B2038';
  const starFill = variant === 'white' ? '#7dd3fc' : '#00C2FF';
  const buttonFill = variant === 'white' ? '#ffffff' : variant === 'dark' ? '#ffffff' : '#0B2038';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 1000"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Cyan Planetary Orbit System */}
      {/* Outer Orbit Circle */}
      <circle
        cx="500"
        cy="520"
        r="330"
        stroke={cyanStroke}
        strokeWidth="20"
        strokeLinecap="round"
      />

      {/* Top 4-Point Sparkle Star */}
      <path
        d="M 500 135
           Q 500 185 525 185
           Q 500 185 500 235
           Q 500 185 475 185
           Q 500 185 500 135 Z"
        fill={starFill}
        stroke={starFill}
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Inclined Planetary Orbit Ellipse */}
      <g transform="rotate(-30 500 520)">
        <ellipse
          cx="500"
          cy="520"
          rx="410"
          ry="138"
          stroke={cyanStroke}
          strokeWidth="20"
          strokeLinecap="round"
        />
      </g>

      {/* Deep Midnight Navy Academic Emblem */}
      <g stroke={navyStroke} strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Mortarboard Diamond Top */}
        <polygon
          points="500,260 670,340 500,420 330,340"
          strokeWidth="22"
        />

        {/* Cap Skull Base Arch */}
        <path
          d="M 412 378
             C 412 425, 588 425, 588 378"
          strokeWidth="20"
        />

        {/* Mortarboard Button */}
        <circle cx="500" cy="340" r="10" fill={buttonFill} stroke="none" />

        {/* Cap Tassel Cord */}
        <path
          d="M 500 340
             C 460 350, 422 374, 420 420
             L 420 445"
          strokeWidth="12"
        />
        {/* Cap Tassel Bell & Fringe */}
        <polygon
          points="412,445 428,445 432,500 408,500"
          fill={buttonFill}
          strokeWidth="6"
        />

        {/* Open Book */}
        {/* Center Spine Line */}
        <line
          x1="500"
          y1="490"
          x2="500"
          y2="640"
          strokeWidth="18"
        />

        {/* Inner Left Page */}
        <path
          d="M 500 490
             C 468 450, 412 450, 384 474
             L 384 620
             C 412 600, 468 600, 500 640"
          strokeWidth="20"
        />

        {/* Inner Right Page */}
        <path
          d="M 500 490
             C 532 450, 588 450, 616 474
             L 616 620
             C 588 600, 532 600, 500 640"
          strokeWidth="20"
        />

        {/* Outer Left Page / Cover Border */}
        <path
          d="M 360 460
             L 360 642
             C 396 622, 460 622, 500 664"
          strokeWidth="20"
        />

        {/* Outer Right Page / Cover Border */}
        <path
          d="M 640 460
             L 640 642
             C 604 622, 540 622, 500 664"
          strokeWidth="20"
        />

        {/* Bottom Page Layering Crease */}
        <path
          d="M 436 632
             C 464 620, 488 628, 500 648
             C 512 628, 536 620, 564 632"
          strokeWidth="16"
        />
      </g>
    </svg>
  );
};
