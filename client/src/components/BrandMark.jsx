import { useId } from 'react';

/**
 * «Күй анасы қоры» emblem: dombra, four pairs of rays, qoshqar-muyiz scrolls, double ring.
 * Drawn in currentColor, so the colour comes from CSS (gold-dark on parchment, gold at night).
 * Source of truth for the geometry; static copies live in /public/brand/*.svg.
 */
export function BrandMark({ className = 'brand-mark', title }) {
  const id = useId().replace(/:/g, '');
  const knockout = `ka-knockout-${id}`;
  const holes = `ka-holes-${id}`;

  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      role={title ? 'img' : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title && <title>{title}</title>}
      <defs>
        <mask id={knockout} maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200">
          <rect width="200" height="200" fill="#fff" />
          <path d="M100 110 C119 116 132 135 131 156 C130 174 117 186 100 189 C83 186 70 174 69 156 C68 135 81 116 100 110 Z" fill="#000" />
          <rect x="94" y="40" width="12" height="76" fill="#000" />
        </mask>
        <mask id={holes} maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200">
          <rect width="200" height="200" fill="#fff" />
          <circle cx="100" cy="25" r="2.2" fill="#000" />
          <circle cx="100" cy="33" r="2.2" fill="#000" />
        </mask>
      </defs>
      <circle cx="100" cy="100" r="96" strokeWidth="4.5" />
      <circle cx="100" cy="100" r="89" strokeWidth="1.4" />
      <g mask={`url(#${knockout})`} strokeWidth="5.2">
        <path d="M82 64 A22 106 0 0 0 104 170" />
        <path d="M118 64 A22 106 0 0 1 96 170" />
        <path d="M70 54 A40 116 0 0 0 110 170" />
        <path d="M130 54 A40 116 0 0 1 90 170" />
        <path d="M58 48 A58 122 0 0 0 116 170" />
        <path d="M142 48 A58 122 0 0 1 84 170" />
        <path d="M46 52 A76 118 0 0 0 122 170" />
        <path d="M154 52 A76 118 0 0 1 78 170" />
      </g>
      <g strokeWidth="4.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M46 112 C30 128 26 156 46 168 C58 175 70 164 64 155 C59 148 50 151 52 158" />
        <path d="M154 112 C170 128 174 156 154 168 C142 175 130 164 136 155 C141 148 150 151 148 158" />
      </g>
      <path
        d="M100 14 C107 21 108 33 102.6 43 L97.4 43 C92 33 93 21 100 14 Z"
        fill="currentColor"
        stroke="none"
        mask={`url(#${holes})`}
      />
      <path d="M98 43 V116 M102 43 V116" strokeWidth="2.2" />
      <path d="M97.5 56 H102.5 M97.5 66 H102.5 M97.5 76 H102.5 M97.5 86 H102.5 M97.5 96 H102.5" strokeWidth="1.6" />
      <path
        d="M100 114 C116 119 128 136 127 156 C126 172 115 183 100 186 C85 183 74 172 73 156 C72 136 84 119 100 114 Z"
        strokeWidth="4.4"
        strokeLinejoin="round"
      />
      <circle cx="100" cy="137" r="7.5" strokeWidth="2.6" />
      <path d="M100 130 V144" strokeWidth="2.2" strokeLinecap="round" />
      <path
        d="M100 160 V178 M100 166 C96 158 87 157 86 165 C85 171 92 172 93 167 M100 166 C104 158 113 157 114 165 C115 171 108 172 107 167"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
