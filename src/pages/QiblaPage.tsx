import { useLanguage } from '@/i18n/LanguageContext';
import { useQibla } from '@/hooks/useQibla';
import { Loader2, MapPin } from 'lucide-react';

const QiblaPage = () => {
  const { t } = useLanguage();
  const { qiblaAngle, compassHeading, rotation, loading, error, supported } = useQibla();

  const qibla = t.qibla;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
        <p className="text-muted-foreground">{qibla.loading}</p>
      </div>
    );
  }

  if (error === 'geo') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-6 text-center">
        <MapPin className="h-10 w-10 text-destructive" />
        <p className="text-foreground font-medium">{qibla.permissionNeeded}</p>
      </div>
    );
  }

  const needleRotation = rotation ?? qiblaAngle ?? 0;
  const showCompass = supported && compassHeading != null;

  return (
    <div className="px-4 pt-6 pb-24 flex flex-col items-center gap-6">
      <h1 className="text-xl font-bold text-foreground">{qibla.title}</h1>

      {/* Compass */}
      <div className="relative w-72 h-72">
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg">
          {/* Outer ring */}
          <circle cx="100" cy="100" r="95" fill="none" stroke="hsl(var(--border))" strokeWidth="2" />
          <circle cx="100" cy="100" r="90" fill="hsl(var(--card))" />

          {/* Tick marks */}
          {Array.from({ length: 36 }).map((_, i) => {
            const angle = i * 10;
            const isMajor = angle % 90 === 0;
            const r1 = isMajor ? 76 : 82;
            const r2 = 88;
            const rad = (angle - 90) * (Math.PI / 180);
            return (
              <line
                key={i}
                x1={100 + r1 * Math.cos(rad)}
                y1={100 + r1 * Math.sin(rad)}
                x2={100 + r2 * Math.cos(rad)}
                y2={100 + r2 * Math.sin(rad)}
                stroke={isMajor ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'}
                strokeWidth={isMajor ? 2 : 1}
              />
            );
          })}

          {/* Cardinal directions */}
          {[
            { label: qibla.north, angle: 0 },
            { label: qibla.east, angle: 90 },
            { label: qibla.south, angle: 180 },
            { label: qibla.west, angle: 270 },
          ].map(({ label, angle }) => {
            const rad = (angle - 90) * (Math.PI / 180);
            const r = 68;
            return (
              <text
                key={angle}
                x={100 + r * Math.cos(rad)}
                y={100 + r * Math.sin(rad)}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-foreground text-[10px] font-bold"
              >
                {label}
              </text>
            );
          })}

          {/* Qibla needle */}
          <g
            style={{
              transform: `rotate(${needleRotation}deg)`,
              transformOrigin: '100px 100px',
              transition: showCompass ? 'transform 0.3s ease-out' : 'none',
            }}
          >
            {/* Arrow */}
            <polygon
              points="100,22 94,50 106,50"
              fill="hsl(var(--accent))"
              stroke="hsl(var(--accent))"
              strokeWidth="1"
            />
            <line x1="100" y1="50" x2="100" y2="100" stroke="hsl(var(--accent))" strokeWidth="3" strokeLinecap="round" />
            {/* Kaaba icon circle */}
            <circle cx="100" cy="18" r="6" fill="hsl(var(--accent))" />
            <text x="100" y="19" textAnchor="middle" dominantBaseline="central" className="text-[8px] font-bold" fill="hsl(var(--accent-foreground))">
              🕋
            </text>
          </g>

          {/* Center dot */}
          <circle cx="100" cy="100" r="5" fill="hsl(var(--primary))" />
          <circle cx="100" cy="100" r="2" fill="hsl(var(--primary-foreground))" />
        </svg>
      </div>

      {/* Info */}
      <div className="text-center space-y-2">
        <p className="text-2xl font-bold text-accent">
          {qiblaAngle != null ? `${qiblaAngle.toFixed(1)}°` : '—'}
        </p>
        <p className="text-sm text-muted-foreground">{qibla.direction}</p>
        {!supported && (
          <p className="text-xs text-muted-foreground mt-4 bg-card p-3 rounded-xl border border-border/50">
            {qibla.notSupported}
          </p>
        )}
      </div>
    </div>
  );
};

export default QiblaPage;
