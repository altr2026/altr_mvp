import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'ALTR — Live IP × Brand · Cross-Border infrastructure for ASIA'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: '#08080D',
          padding: '72px',
          fontFamily: 'sans-serif',
          color: '#FFFFFF',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 16px',
            border: '1px solid rgba(65, 184, 136, 0.35)',
            background: 'rgba(29, 158, 117, 0.07)',
            borderRadius: '6px',
            alignSelf: 'flex-start',
            fontSize: '16px',
            color: '#41B888',
            textTransform: 'uppercase',
            letterSpacing: '0.22em',
            fontFamily: 'monospace',
          }}
        >
          <div
            style={{
              width: '9px',
              height: '9px',
              background: '#38E709',
              borderRadius: '1px',
            }}
          />
          Live IP × Brand · Cross-Border
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: '64px',
            fontSize: '88px',
            fontWeight: 700,
            letterSpacing: '-0.045em',
            color: '#FFFFFF',
            lineHeight: 1.04,
          }}
        >
          Turn sponsorship
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: '88px',
            fontWeight: 700,
            letterSpacing: '-0.045em',
            lineHeight: 1.04,
          }}
        >
          <span style={{ color: '#FFFFFF' }}>into</span>
          <span style={{ color: '#41B888', marginLeft: '24px' }}>
            revenue.
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: '36px',
            fontSize: '28px',
            color: '#9F9FA9',
            lineHeight: 1.4,
            maxWidth: '960px',
          }}
        >
          Live properties get funded. Brands get presence. That&apos;s ALTR.
        </div>

        <div style={{ flex: 1 }} />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '36px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                background: '#38E709',
                borderRadius: '4px',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div
                style={{
                  fontSize: '34px',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  letterSpacing: '-0.02em',
                  fontFamily: 'serif',
                }}
              >
                ALTR
              </div>
              <div
                style={{
                  fontSize: '14px',
                  color: '#5E5E68',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontFamily: 'monospace',
                }}
              >
                Sponsorship OS · ASIA
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '17px',
              color: '#5E5E68',
              fontFamily: 'monospace',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            demo.altr.haus
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
