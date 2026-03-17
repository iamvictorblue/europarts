import { useEffect, useState } from 'react'
import {
  bannerStories,
  featuredServices,
  highlights,
  maintenanceHighlights,
  makes,
  partners,
  tuningHighlights,
  whyChooseCards,
} from './site-data'

function SectionIcon({ kind }) {
  const icons = {
    oil: (
      <path d="M4 13.5c0 3.1 2.4 5.5 5.5 5.5H16a4 4 0 0 0 0-8h-2.2L11.4 7H7v4H4v2.5Zm4-8.5h5v2H8V5Zm11.1 9.3.9-1.8 1.8.9-.9 1.8a2.5 2.5 0 1 1-1.8-.9Z" />
    ),
    suspension: (
      <path d="M5 7h3l2 4h4l2-4h3v2h-2l-1.4 3H19v2h-3l1.4 3H19v2h-3l-2-4h-4l-2 4H5v-2h2.6L9 14H5v-2h4l-1.4-3H5V7Zm6 6h2l1-2h-4l1 2Zm0 0-1 2h4l-1-2Z" />
    ),
    diagnostic: (
      <path d="M7 4h10v2h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-3l2 3v1h-2l-2-3H10l-2 3H6v-1l2-3H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2V4Zm0 4H5v6h14V8h-2v2H7V8Zm2-2v2h6V6H9Zm2 5h2v2h-2v-2Z" />
    ),
    parts: (
      <path d="M12 3a3 3 0 0 1 3 3v1.1a4.8 4.8 0 0 1 2.2 1.3l1-.6 1 1.8-1 .6c.3.6.5 1.3.6 2h1.2v2h-1.2a5 5 0 0 1-.6 2l1 .6-1 1.8-1-.6A4.8 4.8 0 0 1 15 19v1h-2v-1a4.8 4.8 0 0 1-2-.8l-1 .6-1-1.8 1-.6a5 5 0 0 1-.6-2H4v-2h5.4c.1-.7.3-1.4.6-2l-1-.6 1-1.8 1 .6A4.8 4.8 0 0 1 13 7.1V6a1 1 0 1 0-2 0v1H9V6a3 3 0 0 1 3-3Zm0 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
    ),
    check: (
      <path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm4.3 7.3-5.2 5.2-2.4-2.4-1.4 1.4 3.8 3.8 6.6-6.6-1.4-1.4Z" />
    ),
    support: (
      <path d="M12 3a4 4 0 0 1 4 4c0 .7-.2 1.4-.5 2a5.5 5.5 0 0 1 3.5 5.1V17h1a2 2 0 0 1 0 4h-3v-2h3v-2h-2v-3a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 6 14v3H4v2h3v2H4a2 2 0 0 1 0-4h1v-2.9A5.5 5.5 0 0 1 8.5 9c-.3-.6-.5-1.3-.5-2a4 4 0 0 1 4-4Zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm6.5 6 1.2.8 1.3-.6.8 1.4-1.1.8.1 1.4 1 .9-.9 1.3-1.3-.5-1.2.7-.2 1.4h-1.6l-.2-1.4-1.2-.7-1.3.5-.9-1.3 1-.9.1-1.4-1.1-.8.8-1.4 1.3.6 1.2-.8.2-1.4h1.6l.2 1.4Z" />
    ),
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {icons[kind]}
    </svg>
  )
}

function BrandMark({ make, mode = 'marquee' }) {
  if (make.logoSrc) {
    return <img className="brand-logo-image" src={make.logoSrc} alt={make.name} loading="lazy" />
  }

  if (!make.icon) {
    return <span className="brand-label">{make.label}</span>
  }

  return (
    <svg
      className="brand-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: `<path d="${make.icon.path}" />` }}
    />
  )
}

function BannerSlideshow({ images }) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (images.length <= 1) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length)
    }, 3200)

    return () => window.clearInterval(intervalId)
  }, [images.length])

  return (
    <div className="section-banner-slideshow" aria-label="Galería del taller">
      {images.map((image, index) => (
        <figure
          className={`section-banner-shot ${index === activeIndex ? 'is-active' : ''}`}
          key={image.src}
          aria-hidden={index !== activeIndex}
        >
          <img src={image.src} alt={image.alt} loading="lazy" />
        </figure>
      ))}
      <div className="section-banner-dots" aria-hidden="true">
        {images.map((image, index) => (
          <span
            className={`section-banner-dot ${index === activeIndex ? 'is-active' : ''}`}
            key={`${image.src}-dot`}
          />
        ))}
      </div>
    </div>
  )
}

function SectionBanner({ eyebrow, title, description, images, variant }) {
  return (
    <section className={`section-banner section-banner--${variant} reveal`}>
      <div className="page-shell section-banner-shell">
        <div className="section-banner-copy">
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <BannerSlideshow images={images} />
      </div>
    </section>
  )
}

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const marqueeMakes = makes.filter((make) => make.logoSrc)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return
          }

          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.16 },
    )

    const elements = document.querySelectorAll('.reveal')
    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [])

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  return (
    <>
      <header className="site-hero">
        <div className="page-shell nav-shell">
          <nav className={`nav-bar ${isMobileMenuOpen ? 'is-open' : ''}`}>
            <div className="nav-top">
              <a className="brand-lockup" href="#top" aria-label="Euro Parts Engineering" onClick={closeMobileMenu}>
                <img src="/logo.png" alt="Euro Parts Engineering LLC" />
              </a>
              <button
                className="nav-mobile-toggle"
                type="button"
                aria-expanded={isMobileMenuOpen}
                aria-controls="site-nav-menu"
                aria-label="Abrir menú"
                onClick={() => setIsMobileMenuOpen((current) => !current)}
              >
                <span className="nav-mobile-toggle-box" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
                <span>Menú</span>
              </button>
            </div>
            <div className="nav-actions" id="site-nav-menu">
              <div className="nav-links">
                <a href="#services" onClick={closeMobileMenu}>
                  Servicios
                </a>
                <a href="#performance" onClick={closeMobileMenu}>
                  Performance
                </a>
                <a href="#brands" onClick={closeMobileMenu}>
                  Marcas
                </a>
                <a href="#contact" onClick={closeMobileMenu}>
                  Contacto
                </a>
              </div>
              <a className="nav-cta" href="/orden-de-trabajo.html" onClick={closeMobileMenu}>
                Solicitar cotizacion
              </a>
            </div>
          </nav>
        </div>

        <section className="hero-band reveal is-visible" id="top">
          <video
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
            poster="/logo.png"
            preload="metadata"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>

          <div className="hero-overlay">
            <div className="page-shell hero-shell">
              <div className="hero-grid">
                <div className="hero-copy">
                  <p className="eyebrow">Piezas para carros europeos | Performance en Puerto Rico</p>
                  <h1>
                    Piezas originales, performance y servicio
                    experto en autos europeos
                  </h1>
                  <p className="hero-text">
                    Con más de 28 años de experiencia, somos líderes en la venta de piezas OEM,
                    accesorios y mantenimiento especializado para vehículos europeos.
                  </p>
                  <div className="hero-actions">
                    <a className="button button-primary" href="/orden-de-trabajo.html">
                      Solicitar cotizacion
                    </a>
                    <a className="button button-secondary" href="tel:+17872779490">
                      Llamar al taller
                    </a>
                  </div>
                </div>
              </div>

              <div className="hero-highlights">
                {highlights.map((item) => (
                  <article key={item.value} className="stat-card">
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </article>
                ))}
              </div>

              <div className="hero-rail">
                <div className="hero-marquee" aria-label="Marcas aliadas">
                  <div className="hero-marquee-track">
                    {[...partners, ...partners].map((partner, index) => (
                      <span key={`${partner}-${index}`}>{partner}</span>
                    ))}
                  </div>
                </div>
                <div className="make-marquee" aria-label="Marcas europeas">
                  <div className="make-marquee-track">
                    {[...marqueeMakes, ...marqueeMakes].map((make, index) => (
                      <div className="make-chip" key={`${make.name}-${index}`} title={make.name}>
                        <BrandMark make={make} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </header>

      <main>
        <div className="page-shell main-shell">
          <section className="panel-section reveal" id="services">
            <div className="section-heading">
              <p className="eyebrow">Nuestros servicios</p>
              <h2>Diagnóstico, mantenimiento, piezas y performance para autos europeos.</h2>
              <p>
                Atendemos servicio preventivo, reparaciones, diagnóstico avanzado, piezas OEM y
                proyectos performance con enfoque en plataformas europeas.
              </p>
            </div>
            <div className="service-grid">
              {featuredServices.map((service, index) => (
                <article className="service-card reveal" key={service.code} style={{ '--delay': `${index * 45}ms` }}>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        {bannerStories.slice(0, 1).map((story) => (
          <SectionBanner key={story.eyebrow} {...story} />
        ))}

        <div className="page-shell main-shell">
          <section className="panel-section reveal" id="performance">
            <div className="section-heading section-heading-center">
              <p className="eyebrow">Programacion y tuning</p>
              <h2 className="section-title-accent">Programación avanzada y performance tuning</h2>
              <p>
                Programaciones, hardware y soporte para proyectos de calle o racing con marcas
                reconocidas y experiencia real en autos europeos.
              </p>
            </div>
            <div className="tuning-grid">
              {tuningHighlights.map((item, index) => (
                <article className="tuning-card reveal" key={item.title} style={{ '--delay': `${index * 55}ms` }}>
                  <div className={`tuning-media ${item.logoMode ? 'logo-mode' : ''}`}>
                    <img src={item.image} alt={item.alt} loading="lazy" />
                  </div>
                  <div className="tuning-copy">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="panel-section reveal">
            <div className="section-heading section-heading-center">
              <p className="eyebrow">Mantenimiento especializado</p>
              <h2>Mantenimiento y reparación especializada</h2>
              <p>
                Servicio preventivo y correctivo con criterio técnico, piezas correctas y enfoque
                en confiabilidad diaria.
              </p>
            </div>
            <div className="maintenance-grid">
              {maintenanceHighlights.map((item, index) => (
                <article className="maintenance-card reveal" key={item.title} style={{ '--delay': `${index * 55}ms` }}>
                  <div className="maintenance-icon">
                    <SectionIcon kind={item.icon} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        {bannerStories.slice(1, 2).map((story) => (
          <SectionBanner key={story.eyebrow} {...story} />
        ))}

        <div className="page-shell main-shell">
          <section className="panel-section reveal" id="brands">
            <div className="section-heading">
              <p className="eyebrow">Marcas que trabajamos</p>
              <h2 className="section-title-accent">
                Marcas europeas que atendemos con frecuencia en piezas, servicio y diagnóstico.
              </h2>
              <p>
                Trabajamos con plataformas alemanas, inglesas, italianas y otras líneas europeas
                con necesidades OEM y performance.
              </p>
            </div>
            <div className="brand-grid">
              {makes.map((make, index) => (
                <article className="brand-card reveal" key={make.name} style={{ '--delay': `${index * 30}ms` }}>
                  <div className="brand-mark">
                    <BrandMark make={make} mode="grid" />
                  </div>
                  <h3>{make.name}</h3>
                </article>
              ))}
            </div>
          </section>

          <section className="panel-section reveal">
            <div className="section-heading section-heading-center">
              <p className="eyebrow">Por qué elegirnos</p>
              <h2>Experiencia, inventario y criterio técnico para resolver bien desde la primera visita.</h2>
              <p>
                Combinamos venta de piezas, mantenimiento especializado y apoyo técnico para que
                cada cliente reciba una solución completa.
              </p>
            </div>
            <div className="why-grid">
              {whyChooseCards.map((item, index) => (
                <article className="why-card reveal" key={item.title} style={{ '--delay': `${index * 60}ms` }}>
                  <div className="why-icon">
                    <SectionIcon kind={item.icon} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        {bannerStories.slice(2).map((story) => (
          <SectionBanner key={story.eyebrow} {...story} />
        ))}

        <div className="page-shell main-shell">
          <section className="panel-section location-section reveal" id="contact">
            <div className="location-copy">
              <p className="eyebrow">Contáctanos hoy</p>
              <h2>Visitanos en San Juan o envianos tu solicitud de cotizacion antes de llegar.</h2>
              <p>
                Atendemos citas, cotizaciones y seguimiento directamente desde el taller, con
                un formulario digital disponible para agilizar la evaluacion inicial.
              </p>
              <div className="location-details">
                <a href="tel:+17872779490">(787) 277-9490</a>
                <a href="mailto:epe.corp@gmail.com">epe.corp@gmail.com</a>
                <p>1004 Ave Jesús T. Piñero, San Juan, PR 00921</p>
                <p>lunes a viernes 9:00 a.m - 5:00 p.m</p>
              </div>
              <div className="location-actions">
                <a className="button button-primary" href="/orden-de-trabajo.html">
                  Ir al formulario de cotizacion
                </a>
                <a className="button button-secondary" href="https://maps.google.com/?q=1004+Ave+Jesus+T+Piñero+San+Juan+PR+00921">
                  Abrir en mapas
                </a>
              </div>
            </div>
            <div className="map-frame">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d35449.96867647493!2d-66.08638986095401!3d18.42085775327863!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8c0368f3ddd41f73%3A0x831e9e0a664f14b2!2sEuro%20Parts%20Engineering!5e0!3m2!1sen!2spr!4v1773688279322!5m2!1sen!2spr"
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa de Euro Parts Engineering"
              />
            </div>
          </section>
        </div>
      </main>

      <footer className="site-footer">
        <div className="page-shell footer-shell">
          <a className="brand-lockup footer-brand" href="#top" aria-label="Euro Parts Engineering">
            <img src="/logo.png" alt="Euro Parts Engineering LLC" />
          </a>
          <div className="footer-links">
            <a href="#services">Servicios</a>
            <a href="#performance">Performance</a>
            <a href="#brands">Marcas</a>
            <a href="/orden-de-trabajo.html">Cotizacion</a>
            <a href="/admin.html">Admin</a>
          </div>
          <div className="footer-contact">
            <p className="eyebrow">Contacto</p>
            <a href="tel:+17872779490">(787) 277-9490</a>
            <a href="mailto:epe.corp@gmail.com">epe.corp@gmail.com</a>
            <p>1004 Ave Jesús T. Piñero, San Juan, PR 00921</p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default App
