import { Link } from 'react-router-dom'
import { brand, SANS, SERIF, MONO } from '@/components/landing/brand'
import { Stamp } from '@/components/landing/Stamp'
import { CutiSlip } from '@/components/landing/CutiSlip'

// Click4Cuti — "Leave Stories" landing page
// Editorial / magazine / paper-stamp aesthetic per design_handoff_landing_a.
//
// Sizes from the prototype use clamp() so the design degrades cleanly on
// mobile (README spec: hero h1 56–64 / 124px, finale h2 80 / 160px,
// section padding 64–24 / 110–56 px).

const SECTION_PADDING_Y = 'clamp(64px, 9vw, 120px)'
const SECTION_PADDING_X = 'clamp(24px, 5vw, 56px)'

export default function HomePage() {
  return (
    <div
      style={{
        background: brand.paper,
        fontFamily: SANS,
        color: brand.ink,
        minHeight: '100vh',
      }}
    >
      <a href="#main" className="c4c-skip-link">Skip to main content</a>
      <Nav />
      <main id="main">
        <Hero />
        <BalikKampung />
        <Steps />
        <Quote />
        <Features />
        <Finale />
      </main>
      <Footer />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Nav
// ─────────────────────────────────────────────────────────────
function Nav() {
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `18px ${SECTION_PADDING_X}`,
        borderBottom: `1.5px solid ${brand.ink}`,
        // Translucent paper with backdrop blur — keeps the nav legible
        // when scrolled over the orange Quote and dark Balik Kampung sections.
        background: 'rgba(250, 246, 242, 0.85)',
        backdropFilter: 'saturate(180%) blur(10px)',
        WebkitBackdropFilter: 'saturate(180%) blur(10px)',
        gap: 16,
      }}
    >
      <Link to="/" className="c4c-focusable" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
        <img src="/logo-navbar.svg" alt="Click4Cuti" style={{ height: 36, width: 'auto' }} />
      </Link>
      <div className="hidden md:flex items-center gap-8">
        {(['Product', 'For HR', 'Stories', 'Pricing'] as const).map((l) => (
          <a
            key={l}
            href="#"
            className="c4c-nav-link"
            style={{ fontSize: 14, fontWeight: 600, color: brand.ink, textDecoration: 'none' }}
          >
            {l}
          </a>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Link
          to="/login"
          className="c4c-nav-link hidden md:inline-flex"
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: brand.ink,
            textDecoration: 'none',
            padding: '8px 14px',
          }}
        >
          Log In
        </Link>
        <Link
          to="/admin/login"
          className="c4c-nav-link hidden md:inline-flex"
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'rgba(26,20,16,0.5)',
            textDecoration: 'none',
            padding: '8px 12px',
          }}
        >
          Admin
        </Link>
        <Link
          to="/login"
          className="c4c-focusable"
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: '#fff',
            textDecoration: 'none',
            background: brand.ink,
            padding: '10px 18px',
            borderRadius: 6,
            border: `2px solid ${brand.ink}`,
            boxShadow: `2px 2px 0 ${brand.orange}`,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          Book a Demo <span>→</span>
        </Link>
      </div>
    </nav>
  )
}

// ─────────────────────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      style={{
        position: 'relative',
        padding: `${SECTION_PADDING_Y} ${SECTION_PADDING_X} clamp(56px, 8vw, 96px)`,
        background: brand.paper,
        overflow: 'hidden',
        borderBottom: `1.5px solid ${brand.ink}`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: brand.ink,
          marginBottom: 32,
          fontFamily: MONO,
          flexWrap: 'wrap',
        }}
      >
        <span>ISSUE 04</span>
        <span style={{ width: 20, height: 1, background: brand.ink }} />
        <span style={{ color: brand.orange }}>
          <span className="c4c-pulse" aria-hidden="true">●</span>{' '}ON LEAVE
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 lg:gap-14 items-start">
        <div>
          <div style={{ marginBottom: 24, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <Stamp size="md" rotate={-3}>Leave Stories</Stamp>
            <Stamp size="md" color={brand.ink} textColor="#fff" rotate={2}>SEA Edition</Stamp>
          </div>

          <h1
            style={{
              fontSize: 'clamp(56px, 9vw, 124px)',
              lineHeight: 0.92,
              fontWeight: 800,
              letterSpacing: '-0.04em',
              color: brand.ink,
              margin: 0,
              fontFamily: SANS,
            }}
          >
            Time off that<br />
            <em
              style={{
                fontStyle: 'italic',
                fontWeight: 500,
                color: brand.orange,
                fontFamily: SERIF,
              }}
            >
              actually
            </em>
            <br />
            <em
              style={{
                fontStyle: 'italic',
                fontWeight: 500,
                color: brand.orange,
                fontFamily: SERIF,
              }}
            >
              feels
            </em>{' '}
            like time off.
          </h1>

          <p
            style={{
              marginTop: 32,
              maxWidth: 520,
              fontSize: 18,
              lineHeight: 1.55,
              color: brand.ink,
              fontWeight: 400,
            }}
          >
            Click4Cuti handles leave applications, approvals, and balances for teams across Southeast Asia —
            from Hari Raya back home, to Deepavali with family, to Gawai at the longhouse.
            So when your people say <em>cuti</em>, they actually get to be on leave.
          </p>

          <div style={{ marginTop: 36, display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/login"
              className="c4c-cta-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                background: brand.orange,
                color: '#fff',
                padding: '16px 26px',
                borderRadius: 8,
                border: `2px solid ${brand.ink}`,
                boxShadow: `4px 4px 0 ${brand.ink}`,
                fontSize: 16,
                fontWeight: 800,
                textDecoration: 'none',
                letterSpacing: '0.02em',
              }}
            >
              Book a Free Demo <span>→</span>
            </Link>
            <a
              href="#story"
              className="c4c-focusable"
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: brand.ink,
                textDecoration: 'underline',
                textDecorationThickness: 2,
                textUnderlineOffset: 4,
              }}
            >
              Read the customer story
            </a>
          </div>
        </div>

        {/* Right: cuti slip */}
        <div style={{ position: 'relative', paddingTop: 48 }}>
          <CutiSlip />
          <div style={{ position: 'absolute', top: 0, right: -12, zIndex: 3 }}>
            <Stamp size="lg" rotate={8}>Approved</Stamp>
          </div>
          <div style={{ position: 'absolute', bottom: 30, left: -20, zIndex: 3 }}>
            <Stamp size="md" rotate={-6} color={brand.ink} textColor={brand.orange}>12 days left</Stamp>
          </div>
        </div>
      </div>

      {/* Marquee band — festival names; one copy is real content for SRs,
          the duplicate is purely for the seamless visual loop. */}
      <div
        role="region"
        aria-label="Festivals supported by Click4Cuti"
        style={{
          marginTop: 'clamp(48px, 6vw, 72px)',
          padding: '14px 0',
          background: brand.orange,
          color: '#fff',
          border: `2px solid ${brand.ink}`,
          overflow: 'hidden',
          fontFamily: MONO,
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        <div
          className="c4c-marquee-track"
          style={{ display: 'flex', gap: 40, width: 'max-content' }}
        >
          {[...Array(2)].map((_, dup) => (
            <div
              key={dup}
              style={{ display: 'flex', gap: 40, paddingRight: 40 }}
              aria-hidden={dup === 1 ? 'true' : undefined}
            >
              {(
                [
                  'HARI RAYA',
                  'DEEPAVALI',
                  'WESAK',
                  'GAWAI',
                  'NYEPI',
                  'THAIPUSAM',
                  'LEBARAN',
                  'MERDEKA DAY',
                  'CHUSEOK',
                ] as const
              ).map((t) => (
                <span key={`${dup}-${t}`} style={{ whiteSpace: 'nowrap' }}>
                  {t} ·
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// §01 Balik Kampung Guarantee
// ─────────────────────────────────────────────────────────────
function BalikKampung() {
  const cards = [
    { festival: 'Hari Raya', date: '10 – 11 May', days: '5 days', emoji: '◐', rot: -4, top: 0, left: 20 },
    { festival: 'Deepavali', date: '10 Nov', days: '1 day', emoji: '◈', rot: 3, top: 80, left: 140 },
    { festival: 'Gawai Dayak', date: '1 – 2 Jun', days: '2 days', emoji: '❋', rot: -2, top: 160, left: 60 },
    { festival: 'Chinese New Year', date: '16 – 17 Feb', days: '3 days', emoji: '✺', rot: 5, top: 240, left: 180 },
  ] as const

  return (
    <section
      style={{
        padding: `${SECTION_PADDING_Y} ${SECTION_PADDING_X}`,
        background: brand.ink,
        color: brand.paper,
        borderBottom: `1.5px solid ${brand.ink}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-center">
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: brand.orange,
              marginBottom: 20,
              fontFamily: MONO,
            }}
          >
            § 01 · Jaminan Balik Kampung
          </div>
          <h2
            style={{
              fontSize: 'clamp(40px, 6vw, 76px)',
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: '-0.03em',
              margin: 0,
            }}
          >
            Kerana tiada siapa patut{' '}
            <em
              style={{
                fontStyle: 'italic',
                fontWeight: 500,
                fontFamily: SERIF,
                color: brand.orange,
              }}
            >
              approve
            </em>{' '}
            festival leave a week in advance.
          </h2>
          <p
            style={{
              marginTop: 28,
              fontSize: 18,
              lineHeight: 1.6,
              maxWidth: 480,
              color: 'rgba(250,246,242,0.78)',
            }}
          >
            Festival leave requests get recognised automatically — spotted early, laid out
            in the team calendar, and approved within 24 hours. No more Friday-night panic emails.
          </p>
          <div style={{ marginTop: 36, display: 'flex', gap: 'clamp(20px, 4vw, 48px)', flexWrap: 'wrap' }}>
            {(
              [
                ['24h', 'avg. approval time'],
                ['98%', 'festival leave approved'],
                ['0', 'panic emails'],
              ] as const
            ).map(([k, v]) => (
              <div key={v}>
                <div
                  style={{
                    fontSize: 'clamp(32px, 4vw, 44px)',
                    fontWeight: 800,
                    color: brand.orange,
                    letterSpacing: '-0.03em',
                  }}
                >
                  {k}
                </div>
                <div style={{ fontSize: 13, color: 'rgba(250,246,242,0.6)', marginTop: 4, maxWidth: 120 }}>
                  {v}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Festival cards: stack on mobile (no overlap), absolute-positioned
            collage on lg+ (matches the prototype). README spec. */}
        <div className="c4c-festival-grid">
          {cards.map((f, i) => (
            <div
              key={f.festival}
              className="c4c-festival-card"
              style={{
                // CSS variables consumed by the @media rule in index.css
                ['--ft' as string]: `${f.top}px`,
                ['--fl' as string]: `${f.left}px`,
                ['--fr' as string]: `${f.rot}deg`,
                background: i === 1 ? brand.orange : brand.paper,
                color: i === 1 ? '#fff' : brand.ink,
                padding: '20px 24px',
                width: 'clamp(220px, 24vw, 280px)',
                border: `2px solid ${i === 1 ? '#fff' : brand.ink}`,
                borderRadius: 10,
                boxShadow: `5px 5px 0 ${brand.orange}`,
                zIndex: 4 - i,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 28 }}>{f.emoji}</span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    background: i === 1 ? '#fff' : brand.orange,
                    color: i === 1 ? brand.orange : '#fff',
                    padding: '3px 8px',
                    borderRadius: 3,
                    textTransform: 'uppercase',
                  }}
                >
                  Approved
                </span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 10 }}>
                {f.festival}
              </div>
              <div style={{ fontSize: 13, opacity: 0.7, marginTop: 2, fontFamily: MONO }}>
                {f.date} · {f.days}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// §02 Steps
// ─────────────────────────────────────────────────────────────
function Steps() {
  const steps = [
    {
      n: '01',
      title: 'Apply in 30 seconds',
      body: 'A short form. Pick dates, leave type, reason — done. No more three-paragraph formal memos.',
      accent: 'The employee',
    },
    {
      n: '02',
      title: 'Managers see the full picture',
      body: "Who's on leave, who's covering, team workload — all on one screen. Approve or discuss.",
      accent: 'The manager',
    },
    {
      n: '03',
      title: 'Balances update themselves',
      body: 'No spreadsheets. No manual math. Everyone sees their leave balance in real time.',
      accent: 'The HR team',
    },
  ] as const

  return (
    <section
      style={{
        padding: `${SECTION_PADDING_Y} ${SECTION_PADDING_X}`,
        background: brand.paper,
        borderBottom: `1.5px solid ${brand.ink}`,
      }}
    >
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-12 lg:mb-16">
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: brand.orange,
              marginBottom: 20,
              fontFamily: MONO,
            }}
          >
            § 02 · Bagaimana ia berfungsi
          </div>
          <h2
            style={{
              fontSize: 'clamp(40px, 6vw, 72px)',
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: '-0.03em',
              margin: 0,
              color: brand.ink,
              maxWidth: 800,
            }}
          >
            Tiga langkah.{' '}
            <em style={{ fontStyle: 'italic', fontWeight: 500, fontFamily: SERIF, color: brand.orange }}>
              Zero
            </em>{' '}
            drama.
          </h2>
        </div>
        <div style={{ fontSize: 15, color: 'rgba(26,20,16,0.6)', maxWidth: 280 }}>
          From application to approval to balance updates — every step built for teams that don't like waiting.
        </div>
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-3"
        style={{
          gap: 0,
          borderTop: `2px solid ${brand.ink}`,
          borderLeft: `2px solid ${brand.ink}`,
        }}
      >
        {steps.map((s, i) => (
          <div
            key={s.n}
            style={{
              padding: '36px 32px',
              borderRight: `2px solid ${brand.ink}`,
              borderBottom: `2px solid ${brand.ink}`,
              background: i === 1 ? brand.orangeTint : '#fff',
              minHeight: 340,
              position: 'relative',
            }}
          >
            <div
              style={{
                fontSize: 'clamp(72px, 8vw, 96px)',
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: '-0.05em',
                color: i === 1 ? brand.orange : brand.ink,
                fontFamily: SERIF,
                fontStyle: 'italic',
              }}
            >
              {s.n}
            </div>
            <div
              style={{
                marginTop: 10,
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: brand.orange,
                fontFamily: MONO,
              }}
            >
              [ {s.accent} ]
            </div>
            <h3
              style={{
                marginTop: 14,
                fontSize: 26,
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: brand.ink,
                lineHeight: 1.1,
              }}
            >
              {s.title}
            </h3>
            <p style={{ marginTop: 14, fontSize: 15, lineHeight: 1.55, color: 'rgba(26,20,16,0.72)' }}>
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// §03 Customer story
// ─────────────────────────────────────────────────────────────
function Quote() {
  return (
    <section
      id="story"
      className="c4c-section-anchor"
      style={{
        padding: `${SECTION_PADDING_Y} ${SECTION_PADDING_X}`,
        background: brand.orange,
        color: '#fff',
        borderBottom: `1.5px solid ${brand.ink}`,
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            marginBottom: 28,
            fontFamily: MONO,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span>§ 03 · Customer Story</span>
          <span style={{ flex: 1, height: 1, background: '#fff', opacity: 0.5 }} />
          <span>No. 08</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.2fr] gap-10 lg:gap-14 items-center">
          <div>
            <div
              style={{
                width: '100%',
                aspectRatio: '3/4',
                background: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.12) 0 8px, transparent 8px 16px)',
                border: '2px solid #000',
                borderRadius: 6,
                display: 'grid',
                placeItems: 'center',
                fontFamily: MONO,
                fontSize: 12,
                color: 'rgba(0,0,0,0.55)',
                position: 'relative',
              }}
            >
              [ foto: HR Head ]
              <div style={{ position: 'absolute', bottom: -14, right: -14 }}>
                <Stamp size="sm" color="#fff" textColor={brand.ink} rotate={-4}>
                  PELANGGAN
                </Stamp>
              </div>
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 'clamp(28px, 4vw, 48px)',
                lineHeight: 1.1,
                fontWeight: 500,
                fontFamily: SERIF,
                fontStyle: 'italic',
                letterSpacing: '-0.02em',
              }}
            >
              <span
                style={{
                  fontSize: 'clamp(80px, 10vw, 120px)',
                  lineHeight: 0.5,
                  marginRight: 8,
                  verticalAlign: '-0.3em',
                  fontWeight: 800,
                }}
              >
                "
              </span>
              Ramadan used to be the most stressful month for my HR team. Now? Every Hari Raya leave is mapped out 3 weeks ahead.
              We even had{' '}
              <em
                style={{
                  textDecoration: 'underline',
                  textDecorationThickness: 3,
                  textUnderlineOffset: 6,
                }}
              >
                five new hires
              </em>{' '}
              in the Jakarta team — I hadn't met them in person yet, but their leave was already approved.
            </div>
            <div style={{ marginTop: 36, display: 'flex', alignItems: 'center', gap: 20 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.01em' }}>Shafiqah Ibrahim</div>
                <div style={{ fontSize: 14, color: brand.ink, marginTop: 4, fontWeight: 500 }}>
                  Head of People Ops · Warung Digital (120 staff · 3 countries)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// §04 Features
// ─────────────────────────────────────────────────────────────
function Features() {
  const features = [
    { span: 'lg:col-span-4', title: 'Team calendar', body: "See who's in, who's out, who's on half-day — in one view. Filter by department, region, or company.", tag: 'Headline', orange: true },
    { span: 'lg:col-span-2', title: 'Local leave policies', body: 'Ready-made templates for MY, ID, SG, PH, VN. Public, festival, and maternity leave matched to local statute.', tag: 'Compliance', orange: false },
    { span: 'lg:col-span-2', title: 'Multi-company', body: 'For HR agencies managing many clients. One login, clear hierarchy.', tag: 'Agencies', orange: false },
    { span: 'lg:col-span-2', title: 'WhatsApp approvals', body: 'Managers can approve without opening a laptop. Yes/no buttons straight to the phone.', tag: 'Mobile', orange: false },
    { span: 'lg:col-span-2', title: 'Payroll export', body: 'CSV ready for SQL, Xero, Talenox, BrioHR — or plain Excel.', tag: 'Integrations', orange: false },
    { span: 'lg:col-span-3', title: 'Reports & trends', body: 'Leave patterns by month, department, location. Spot burnout before it arrives.', tag: 'Insight', orange: false },
    { span: 'lg:col-span-3', title: 'Warning letters & docs', body: 'When needed, all in one place — with a full audit trail.', tag: 'Records', orange: false },
  ] as const

  return (
    <section
      id="features-anchor"
      className="c4c-section-anchor"
      style={{
        padding: `${SECTION_PADDING_Y} ${SECTION_PADDING_X}`,
        background: brand.paper,
        borderBottom: `1.5px solid ${brand.ink}`,
      }}
    >
      <div style={{ marginBottom: 'clamp(40px, 5vw, 56px)' }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: brand.orange,
            marginBottom: 20,
            fontFamily: MONO,
          }}
        >
          § 04 · Senarai Lengkap
        </div>
        <h2
          style={{
            fontSize: 'clamp(40px, 6vw, 72px)',
            fontWeight: 800,
            lineHeight: 0.95,
            letterSpacing: '-0.03em',
            margin: 0,
            color: brand.ink,
            maxWidth: 900,
          }}
        >
          Semua yang HR{' '}
          <em style={{ fontStyle: 'italic', fontWeight: 500, fontFamily: SERIF, color: brand.orange }}>
            perlu
          </em>
          . Tiada yang{' '}
          <em style={{ fontStyle: 'italic', fontWeight: 500, fontFamily: SERIF, color: brand.orange }}>
            tak perlu
          </em>
          .
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5">
        {features.map((f) => (
          <div
            key={f.title}
            className={f.span}
            style={{
              background: f.orange ? brand.orange : '#fff',
              color: f.orange ? '#fff' : brand.ink,
              padding: '28px 30px',
              border: `2px solid ${brand.ink}`,
              borderRadius: 8,
              minHeight: f.orange ? 240 : 180,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: f.orange ? `5px 5px 0 ${brand.ink}` : 'none',
              position: 'relative',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: f.orange ? 'rgba(255,255,255,0.8)' : brand.orange,
                  fontFamily: MONO,
                }}
              >
                [ {f.tag} ]
              </div>
              <h3
                style={{
                  marginTop: 12,
                  fontSize: f.orange ? 34 : 22,
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  marginTop: 10,
                  fontSize: f.orange ? 16 : 14,
                  lineHeight: 1.55,
                  color: f.orange ? 'rgba(255,255,255,0.88)' : 'rgba(26,20,16,0.7)',
                }}
              >
                {f.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// §05 Finale CTA
// ─────────────────────────────────────────────────────────────
function Finale() {
  return (
    <section
      style={{
        padding: `${SECTION_PADDING_Y} ${SECTION_PADDING_X}`,
        background: brand.paperDeep,
        borderBottom: `1.5px solid ${brand.ink}`,
        textAlign: 'center',
        position: 'relative',
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: brand.orange,
          marginBottom: 20,
          fontFamily: MONO,
        }}
      >
        § 05 · Start Now
      </div>
      <h2
        style={{
          fontSize: 'clamp(72px, 12vw, 160px)',
          fontWeight: 900,
          lineHeight: 0.88,
          letterSpacing: '-0.05em',
          color: brand.ink,
          margin: 0,
        }}
      >
        Selamat<br />
        <em
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 500,
            color: brand.orange,
          }}
        >
          on leave.
        </em>
      </h2>
      <p
        style={{
          marginTop: 28,
          fontSize: 18,
          color: 'rgba(26,20,16,0.7)',
          maxWidth: 520,
          margin: '28px auto 0',
        }}
      >
        14 days free. No credit card. Setup takes 20 minutes — our team walks your HR through it personally.
      </p>
      <div style={{ marginTop: 40, display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link
          to="/login"
          className="c4c-cta-primary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            background: brand.orange,
            color: '#fff',
            padding: '20px 32px',
            borderRadius: 8,
            border: `2px solid ${brand.ink}`,
            boxShadow: `5px 5px 0 ${brand.ink}`,
            fontSize: 17,
            fontWeight: 800,
            textDecoration: 'none',
          }}
        >
          Start Free Trial →
        </Link>
        <a
          href="#"
          className="c4c-cta-secondary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            background: '#fff',
            color: brand.ink,
            padding: '20px 32px',
            borderRadius: 8,
            border: `2px solid ${brand.ink}`,
            fontSize: 17,
            fontWeight: 800,
            textDecoration: 'none',
          }}
        >
          Talk to Sales
        </a>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────────────────────
function Footer() {
  const PHONE = '+60 11-5941 1510'
  const PHONE_TEL = '+60115941510' // dialer format
  const EMAIL = 'clickonesystem@gmail.com'

  const linkGroups = [
    {
      heading: 'Product',
      items: [
        ['Features', '#features-anchor'],
        ['Customer Story', '#story'],
      ],
    },
    {
      heading: 'Company',
      items: [
        ['Privacy', '#'],
        ['Terms', '#'],
      ],
    },
    {
      heading: 'Get in Touch',
      items: [
        ['Email', `mailto:${EMAIL}`],
        ['WhatsApp', `https://wa.me/${PHONE_TEL.replace(/[^0-9]/g, '')}`],
      ],
    },
  ] as const

  return (
    <footer
      style={{
        padding: `56px ${SECTION_PADDING_X} 40px`,
        background: brand.ink,
        color: brand.paper,
      }}
    >
      <div className="grid grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 md:gap-12">
        <div className="col-span-2 md:col-span-1">
          <div
            style={{
              fontSize: 36,
              fontWeight: 900,
              letterSpacing: '-0.03em',
              color: brand.orange,
              fontFamily: SANS,
              lineHeight: 1,
            }}
          >
            Click4Cuti
          </div>
          <div
            style={{
              fontSize: 13,
              marginTop: 12,
              opacity: 0.7,
              maxWidth: 320,
              lineHeight: 1.6,
            }}
          >
            Built in Southeast Asia, for Southeast Asia. With love, and teh tarik.
          </div>

          {/* Registered entity */}
          <div style={{ marginTop: 24, maxWidth: 320 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: brand.orange,
                fontFamily: MONO,
                marginBottom: 8,
              }}
            >
              Registered Entity
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.5 }}>
              CLICK ONE SYSTEM ENTERPRISE
            </div>
            <div
              style={{
                fontSize: 11,
                fontFamily: MONO,
                opacity: 0.65,
                marginTop: 4,
                letterSpacing: '0.04em',
              }}
            >
              SSM 202603109714 (003845611-X)
            </div>
            <address
              style={{
                fontSize: 12,
                lineHeight: 1.6,
                opacity: 0.75,
                marginTop: 10,
                fontStyle: 'normal',
              }}
            >
              C-7-10, Centum @ Oasis Corporate Park,<br />
              No 2, Jalan PJU 1A/2, Ara Damansara,<br />
              47301 Petaling Jaya, Selangor.
            </address>
          </div>

          {/* Direct contact */}
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
            <a
              href={`mailto:${EMAIL}`}
              className="c4c-focusable"
              style={{ color: brand.paper, textDecoration: 'none', opacity: 0.9 }}
            >
              ✉  {EMAIL}
            </a>
            <a
              href={`tel:${PHONE_TEL}`}
              className="c4c-focusable"
              style={{ color: brand.paper, textDecoration: 'none', opacity: 0.9, fontFamily: MONO }}
            >
              ☏  {PHONE}
            </a>
          </div>
        </div>

        {linkGroups.map((g) => (
          <div key={g.heading}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: brand.orange,
                marginBottom: 14,
                fontFamily: MONO,
              }}
            >
              {g.heading}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {g.items.map(([label, href]) => {
                const external = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')
                return (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noreferrer' : undefined}
                    className="c4c-focusable"
                    style={{
                      fontSize: 14,
                      color: brand.paper,
                      textDecoration: 'none',
                      opacity: 0.85,
                    }}
                  >
                    {label}{external && href.startsWith('http') ? ' ↗' : ''}
                  </a>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 48,
          paddingTop: 24,
          borderTop: '1px solid rgba(250,246,242,0.15)',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 12,
          opacity: 0.6,
          fontFamily: MONO,
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        <span>© 2026 CLICK ONE SYSTEM ENTERPRISE · 003845611-X</span>
      </div>
    </footer>
  )
}
