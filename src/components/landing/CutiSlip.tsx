import { brand, MONO } from './brand'

export function CutiSlip() {
  return (
    <div
      style={{
        position: 'relative',
        background: '#fff',
        border: `2px solid ${brand.ink}`,
        borderRadius: 10,
        boxShadow: `6px 6px 0 ${brand.ink}`,
        overflow: 'hidden',
      }}
    >
      {/* Perforation holes */}
      <div
        style={{
          position: 'absolute',
          left: -8,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 16,
          height: 16,
          background: brand.paper,
          borderRadius: '50%',
          border: `2px solid ${brand.ink}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: -8,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 16,
          height: 16,
          background: brand.paper,
          borderRadius: '50%',
          border: `2px solid ${brand.ink}`,
        }}
      />

      {/* Header */}
      <div
        style={{
          padding: '16px 22px',
          background: brand.orange,
          borderBottom: `2px solid ${brand.ink}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#fff',
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontFamily: MONO,
          }}
        >
          LEAVE SLIP · No. 00412
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, fontFamily: MONO }}>Wed · 22 Apr 2026</div>
      </div>

      {/* Body */}
      <div style={{ padding: '26px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: brand.ink,
              fontFamily: MONO,
            }}
          >
            APPLICANT
          </span>
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, color: brand.ink, letterSpacing: '-0.02em' }}>
          Nurul Aisyah binti Hakim
        </div>
        <div style={{ fontSize: 13, color: 'rgba(26,20,16,0.6)', marginTop: 2 }}>
          Senior Designer · Product Team
        </div>

        <div
          style={{
            marginTop: 22,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 20,
            padding: '18px 0',
            borderTop: `1.5px dashed ${brand.rule}`,
            borderBottom: `1.5px dashed ${brand.rule}`,
          }}
        >
          {(
            [
              ['Type', 'Hari Raya'],
              ['Dates', '8 – 12 May'],
              ['Length', '5 days'],
            ] as const
          ).map(([k, v]) => (
            <div key={k}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(26,20,16,0.5)',
                  fontFamily: MONO,
                }}
              >
                {k}
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: brand.ink, marginTop: 4 }}>
                {v}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 18 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(26,20,16,0.5)',
              fontFamily: MONO,
            }}
          >
            NOTE
          </div>
          <div style={{ fontSize: 14, color: brand.ink, marginTop: 4, fontStyle: 'italic' }}>
            "Balik kampung to Kuantan. Can't wait for Mak's rendang."
          </div>
        </div>

        <div
          style={{
            marginTop: 22,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(26,20,16,0.5)',
                fontFamily: MONO,
              }}
            >
              Manager
            </div>
            <div
              style={{
                marginTop: 6,
                fontFamily: 'Georgia, serif',
                fontSize: 22,
                fontStyle: 'italic',
                color: brand.ink,
                borderBottom: `1.5px solid ${brand.ink}`,
                paddingBottom: 2,
                width: 160,
              }}
            >
              Farid K.
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                border: `2.5px solid ${brand.orange}`,
                display: 'grid',
                placeItems: 'center',
                fontSize: 10,
                fontWeight: 800,
                color: brand.orange,
                textAlign: 'center',
                lineHeight: 1,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                transform: 'rotate(-6deg)',
              }}
            >
              OK
              <br />
              TAKE
              <br />
              CARE
            </div>
          </div>
        </div>
      </div>

      {/* Foot barcode */}
      <div
        style={{
          borderTop: `2px solid ${brand.ink}`,
          padding: '10px 22px',
          background: brand.paperDeep,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', gap: 2, alignItems: 'end', height: 22 }}>
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: [1, 1, 2, 1, 3, 2, 1, 2][i % 8],
                height: '100%',
                background: brand.ink,
                opacity: [1, 0.8, 1, 0.9, 1][i % 5],
              }}
            />
          ))}
        </div>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.1em',
            fontFamily: MONO,
            color: brand.ink,
          }}
        >
          C4C · 00412 · MYS
        </div>
      </div>
    </div>
  )
}
