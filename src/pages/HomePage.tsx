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
              matters
            </em>
          </h1>

          <p
            style={{
              fontSize: 'clamp(16px, 2vw, 18px)',
              lineHeight: 1.5,
              fontWeight: 500,
              color: brand.ink,
              margin: '24px 0 32px',
            }}
          >
            A platform built on understanding. Leave that connects to your team, your
            culture, and your people.
          </p>

          <Link
            to="/login"
            className="c4c-focusable"
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: '#fff',
              textDecoration: 'none',
              background: brand.ink,
              padding: '12px 24px',
              borderRadius: 6,
              border: `2px solid ${brand.ink}`,
              boxShadow: `3px 3px 0 ${brand.orange}`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 150ms ease-out',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `6px 6px 0 ${brand.orange}`
              e.currentTarget.style.transform = 'translate(-2px, -2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = `3px 3px 0 ${brand.orange}`
              e.currentTarget.style.transform = 'translate(0, 0)'
            }}
          >
            Explore Click4Cuti <span>→</span>
          </Link>
        </div>

        <div style={{ position: 'relative', aspectRatio: '1 / 1' }}>
          <CutiSlip
            page={1}
            issueBg={brand.orange}
            rotationAngle={2.5}
            style={{
              position: 'absolute',
              width: '100%',
              maxWidth: 320,
              top: 0,
              right: 0,
            }}
          />
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// Balik Kampung
// ─────────────────────────────────────────────────────────────
function BalikKampung() {
  return (
    <section
      style={{
        padding: `${SECTION_PADDING_Y} ${SECTION_PADDING_X}`,
        background: '#2B2521',
        borderBottom: `1.5px solid ${brand.ink}`,
        overflow: 'hidden',
      }}
    >
      <h2
        style={{
          fontSize: 'clamp(32px, 5vw, 48px)',
          lineHeight: 1.2,
          fontWeight: 700,
          color: '#fff',
          margin: '0 0 48px',
          fontFamily: SANS,
        }}
      >
        Leave is more than just days off
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            icon: '📖',
            title: 'Balik Kampung',
            desc: 'Drive cross-cultural understanding. Stories of employees coming back home, to Hari Raya back home, to Deepavali with family, to Gawai at the longhouse.',
          },
          {
            icon: '🏥',
            title: 'Mental Health',
            desc: 'Create space for wellness. Destigmatize mental health breaks and support your people through difficult times.',
          },
          {
            icon: '👨‍👩‍👧‍👦',
            title: 'Family First',
            desc: 'Build inclusive policies. Celebrate milestones—births, marriages, funerals—that matter in your diverse culture.',
          },
        ].map((item) => (
          <div key={item.title}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>{item.icon}</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>{item.title}</h3>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: '#ccc', margin: 0 }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// Steps
// ─────────────────────────────────────────────────────────────
function Steps() {
  return (
    <section
      style={{
        padding: `${SECTION_PADDING_Y} ${SECTION_PADDING_X}`,
        background: brand.paper,
        borderBottom: `1.5px solid ${brand.ink}`,
      }}
    >
      <h2
        style={{
          fontSize: 'clamp(32px, 5vw, 48px)',
          lineHeight: 1.2,
          fontWeight: 700,
          color: brand.ink,
          margin: '0 0 48px',
          fontFamily: SANS,
        }}
      >
        From leave request to return—frictionless
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { num: '1', title: 'Request', desc: 'Apply with context' },
          { num: '2', title: 'Notify', desc: 'Instant team alerts' },
          { num: '3', title: 'Approve', desc: 'Fast decisions' },
          { num: '4', title: 'Return', desc: 'Seamless handoff' },
        ].map((step) => (
          <div key={step.num}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: brand.ink,
                color: '#fff',
                fontSize: 24,
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              {step.num}
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: brand.ink, margin: '0 0 8px' }}>{step.title}</h3>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: '#666', margin: 0 }}>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// Quote
// ─────────────────────────────────────────────────────────────
function Quote() {
  return (
    <section
      style={{
        padding: `${SECTION_PADDING_Y} ${SECTION_PADDING_X}`,
        background: brand.orange,
        borderBottom: `1.5px solid ${brand.ink}`,
      }}
    >
      <blockquote
        style={{
          fontSize: 'clamp(28px, 4vw, 40px)',
          lineHeight: 1.4,
          fontWeight: 600,
          color: '#fff',
          textAlign: 'center',
          margin: 0,
          fontFamily: SERIF,
          fontStyle: 'italic',
        }}
      >
        "Leave isn't a benefit. It's a bridge between work and the things that make us human."
      </blockquote>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// Features
// ─────────────────────────────────────────────────────────────
function Features() {
  return (
    <section
      style={{
        padding: `${SECTION_PADDING_Y} ${SECTION_PADDING_X}`,
        background: brand.paper,
        borderBottom: `1.5px solid ${brand.ink}`,
      }}
    >
      <h2
        style={{
          fontSize: 'clamp(32px, 5vw, 48px)',
          lineHeight: 1.2,
          fontWeight: 700,
          color: brand.ink,
          margin: '0 0 48px',
          textAlign: 'center',
          fontFamily: SANS,
        }}
      >
        Designed for your team
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          {
            icon: '📋',
            title: 'Policy Made Simple',
            desc: 'Craft policies that reflect your values. No legal jargon, just clarity.',
          },
          {
            icon: '👥',
            title: 'Team Visibility',
            desc: 'Know who's in the office, who's out, and why it matters.',
          },
          {
            icon: '📊',
            title: 'Insights & Reports',
            desc: 'Track leave patterns, balance trends, and HR metrics that matter.',
          },
          {
            icon: '🌍',
            title: 'Multi-country Ready',
            desc: 'Localized leave types, holidays, and compliance for Southeast Asia.',
          },
        ].map((feature) => (
          <div key={feature.title}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>{feature.icon}</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: brand.ink, margin: '0 0 8px' }}>
              {feature.title}
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: '#666', margin: 0 }}>{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// Finale
// ─────────────────────────────────────────────────────────────
function Finale() {
  return (
    <section
      style={{
        padding: `${SECTION_PADDING_Y} ${SECTION_PADDING_X} clamp(48px, 6vw, 80px)`,
        background: brand.paper,
        borderBottom: `1.5px solid ${brand.ink}`,
        textAlign: 'center',
      }}
    >
      <h2
        style={{
          fontSize: 'clamp(80px, 12vw, 160px)',
          lineHeight: 0.9,
          fontWeight: 900,
          letterSpacing: '-0.02em',
          color: brand.ink,
          margin: '0 0 24px',
          fontFamily: SANS,
        }}
      >
        Ready?
      </h2>
      <p
        style={{
          fontSize: 'clamp(16px, 2vw, 20px)',
          lineHeight: 1.5,
          fontWeight: 500,
          color: '#666',
          margin: '0 0 32px',
        }}
      >
        Join the movement. Let's make leave meaningful.
      </p>
      <Link
        to="/login"
        className="c4c-focusable"
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: '#fff',
          textDecoration: 'none',
          background: brand.ink,
          padding: '12px 24px',
          borderRadius: 6,
          border: `2px solid ${brand.ink}`,
          boxShadow: `3px 3px 0 ${brand.orange}`,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          transition: 'all 150ms ease-out',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = `6px 6px 0 ${brand.orange}`
          e.currentTarget.style.transform = 'translate(-2px, -2px)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = `3px 3px 0 ${brand.orange}`
          e.currentTarget.style.transform = 'translate(0, 0)'
        }}
      >
        Book a Demo <span>→</span>
      </Link>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      style={{
        padding: `24px ${SECTION_PADDING_X}`,
        background: '#f5f3f1',
        borderTop: `1.5px solid ${brand.ink}`,
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
      }}
    >
      <p style={{ margin: 0 }}>© 2024 Click4Cuti. Designed and built with ❤️ for Southeast Asia.</p>
    </footer>
  )
}
