/**
 * The few icons the site uses, as inline SVG in currentColor: no icon pack,
 * no request, and they follow the colour of the text they sit in.
 */

export function WhatsAppIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} shrink-0`} fill="currentColor" aria-hidden>
      <path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.1-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5v-.5c-.1-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1.1 2.8 1.2 3c.2.2 2.1 3.2 5 4.5.7.3 1.2.5 1.7.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.2-.3-.3-.5-.4zM12 2a10 10 0 0 0-8.6 15L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
    </svg>
  );
}

export function PhoneIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} shrink-0`} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path
        d="M5 4h3l1.5 4-2 1.3a11 11 0 0 0 7.2 7.2l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 3 6.2 2 2 0 0 1 5 4z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={`${className} shrink-0`} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M3 8.5l3.2 3.2L13 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * A coupe drawn in one line: the ornament of the closing call to action. Set
 * large and faint behind the copy, it is the one picture that belongs to the
 * trade rather than to a stock library. `vector-effect` keeps the line hair-
 * thin at any size.
 */
export function CoupeMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 320" className={className} fill="none" stroke="currentColor" strokeWidth="1" aria-hidden>
      <g vectorEffect="non-scaling-stroke" strokeLinecap="round">
        <path d="M18 58h204" vectorEffect="non-scaling-stroke" />
        <path d="M18 58c6 46 46 72 102 72s96-26 102-72" vectorEffect="non-scaling-stroke" />
        <path d="M44 82c18 18 44 28 76 28" vectorEffect="non-scaling-stroke" />
        <path d="M120 130v134" vectorEffect="non-scaling-stroke" />
        <path d="M120 264c-30 0-56 8-62 18h124c-6-10-32-18-62-18z" vectorEffect="non-scaling-stroke" />
        <circle cx="168" cy="40" r="15" vectorEffect="non-scaling-stroke" />
        <path d="M168 25v30M153 40h30" vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  );
}
