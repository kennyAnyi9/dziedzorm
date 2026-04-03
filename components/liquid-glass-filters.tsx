export function LiquidGlassFilters() {
  return (
    <svg className="absolute size-0" aria-hidden="true">
      <defs>
        <filter id="liquid-glass-container" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008"
            numOctaves="2"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="3" result="softNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softNoise"
            scale="77"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        <filter id="liquid-glass-btn" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur" />
          <feSpecularLighting
            in="blur"
            surfaceScale="2"
            specularConstant="0.6"
            specularExponent="30"
            result="specular"
          >
            <fePointLight x="0.5" y="0.3" z="0.7" />
          </feSpecularLighting>
          <feComposite
            in="SourceGraphic"
            in2="specular"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="0.15"
            k4="0"
          />
        </filter>
      </defs>
    </svg>
  );
}
