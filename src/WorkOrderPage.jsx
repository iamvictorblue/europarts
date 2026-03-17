import { useEffect, useState } from 'react'
import { serviceOptions } from './site-data'
import { isSupabaseConfigured, supabase } from './lib/supabase'

const storageKey = 'epe-quote-request-draft'
const legacyServiceLabels = {
  Diagnostic: 'Diagnóstico',
  'Oil Change': 'Aceite',
  'Fluid Leak': 'Fugas',
  'Battery Check / Replacement': 'Batería',
  'Brake Replacement': 'Frenos',
  'Spark Plug Replacement': 'Bujías',
  'Suspension and Steering': 'Suspensión',
  'Coolant System / Overheating': 'Enfriamiento',
  'Air Filter Replacement': 'Admisión',
  'A/C System': 'A/C',
  'Warranty / Return': 'Garantía',
  'Performance Application': 'Performance',
  Diagnostico: 'Diagnóstico',
  Bateria: 'Batería',
  Bujias: 'Bujías',
  Suspension: 'Suspensión',
  Garantia: 'Garantía',
}

function buildInitialState(today) {
  const baseState = {
    selectedServices: ['Diagnóstico'],
    formData: {
      clientName: '',
      clientPhone: '',
      clientEmail: '',
      preferredContact: 'Llamada',
      requestDate: today,
      vehicleYear: '',
      makeModel: '',
      vin: '',
      odometer: '',
      serviceType: 'Reparación',
      availability: '',
      budgetRange: '',
      issueDetails: '',
      goals: '',
      requestItems: '',
    },
  }

  try {
    const stored = window.localStorage.getItem(storageKey)
    if (!stored) {
      return baseState
    }

    const parsed = JSON.parse(stored)
    return {
      selectedServices: parsed.selectedServices?.length
        ? parsed.selectedServices.map((service) => legacyServiceLabels[service] ?? service)
        : baseState.selectedServices,
      formData: { ...baseState.formData, ...parsed.formData },
    }
  } catch {
    return baseState
  }
}

function WorkOrderPage() {
  const today = new Date().toISOString().slice(0, 10)
  const initialState = buildInitialState(today)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedServices, setSelectedServices] = useState(initialState.selectedServices)
  const [formData, setFormData] = useState(initialState.formData)
  const [submitState, setSubmitState] = useState('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  useEffect(() => {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        selectedServices,
        formData,
      }),
    )
  }, [formData, selectedServices])

  const toggleService = (service) => {
    setSelectedServices((current) =>
      current.includes(service)
        ? current.filter((item) => item !== service)
        : [...current, service],
    )
  }

  const updateFormField = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!isSupabaseConfigured || !supabase) {
      setSubmitState('error')
      setSubmitMessage('Faltan las credenciales de Supabase. Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.')
      return
    }

    const payload = {
      client_name: formData.clientName.trim(),
      client_phone: formData.clientPhone.trim(),
      client_email: formData.clientEmail.trim(),
      preferred_contact: formData.preferredContact,
      request_date: formData.requestDate || null,
      vehicle_year: formData.vehicleYear.trim(),
      make_model: formData.makeModel.trim(),
      vin: formData.vin.trim(),
      odometer: formData.odometer.trim(),
      service_type: formData.serviceType,
      availability: formData.availability.trim(),
      budget_range: formData.budgetRange.trim(),
      issue_details: formData.issueDetails.trim(),
      goals: formData.goals.trim(),
      request_items: formData.requestItems.trim(),
      selected_services: selectedServices,
      source_page: 'orden-de-trabajo.html',
      status: 'nueva',
    }

    if (!payload.client_name || !payload.client_phone || !payload.make_model || !payload.issue_details) {
      setSubmitState('error')
      setSubmitMessage('Completa nombre, telefono, marca/modelo y la descripcion del trabajo para enviar la solicitud.')
      return
    }

    setSubmitState('submitting')
    setSubmitMessage('')

    const { error } = await supabase.from('quote_requests').insert(payload)

    if (error) {
      setSubmitState('error')
      setSubmitMessage('No se pudo enviar la solicitud. Verifica la tabla y las politicas de Supabase.')
      return
    }

    setSubmitState('success')
    setSubmitMessage('Solicitud enviada. El taller ya puede revisarla en Supabase.')
    window.localStorage.removeItem(storageKey)
  }

  const clearDraft = () => {
    const freshState = buildInitialState(today)
    setSelectedServices(freshState.selectedServices)
    setFormData(freshState.formData)
    setSubmitState('idle')
    setSubmitMessage('')
    window.localStorage.removeItem(storageKey)
  }

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  return (
    <div className="work-order-view">
      <header className="subpage-hero">
        <div className="page-shell nav-shell">
          <nav className={`nav-bar ${isMobileMenuOpen ? 'is-open' : ''}`}>
            <div className="nav-top">
              <a className="brand-lockup" href="/index.html" aria-label="Euro Parts Engineering" onClick={closeMobileMenu}>
                <img src="/logo.png" alt="Euro Parts Engineering LLC" />
              </a>
              <button
                className="nav-mobile-toggle"
                type="button"
                aria-expanded={isMobileMenuOpen}
                aria-controls="work-order-nav-menu"
                aria-label="Abrir menu"
                onClick={() => setIsMobileMenuOpen((current) => !current)}
              >
                <span className="nav-mobile-toggle-box" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
                <span>Menu</span>
              </button>
            </div>
            <div className="nav-actions" id="work-order-nav-menu">
              <div className="nav-links">
                <a href="/index.html#services" onClick={closeMobileMenu}>
                  Servicios
                </a>
                <a href="/index.html#performance" onClick={closeMobileMenu}>
                  Performance
                </a>
                <a href="/index.html#brands" onClick={closeMobileMenu}>
                  Marcas
                </a>
                <a href="/index.html#contact" onClick={closeMobileMenu}>
                  Contacto
                </a>
              </div>
              <a className="nav-cta" href="/index.html" onClick={closeMobileMenu}>
                Volver al inicio
              </a>
            </div>
          </nav>
        </div>

        <div className="page-shell subpage-shell">
          <p className="eyebrow">Solicitud de cotización</p>
          <h1>Cotiza reparación, mantenimiento o upgrades para tu auto europeo.</h1>
          <p className="hero-text">
            Dejamos este formulario más corto para que puedas enviarlo rápido desde el celular y el
            taller tenga lo esencial para evaluar tu caso.
          </p>
        </div>
      </header>

      <main className="page-shell work-order-layout">
        <section className="panel-section work-order-panel">
          <div className="section-heading">
            <p className="eyebrow">Formulario de cotización</p>
          </div>

          <form className="work-order-card" onSubmit={handleSubmit}>
            <div className="form-block">
              <h3>Contacto</h3>
              <div className="field-grid two-up">
                <label>
                  Nombre
                  <input name="clientName" value={formData.clientName} onChange={updateFormField} />
                </label>
                <label>
                  Teléfono
                  <input name="clientPhone" value={formData.clientPhone} onChange={updateFormField} />
                </label>
                <label>
                  Email
                  <input name="clientEmail" value={formData.clientEmail} onChange={updateFormField} />
                </label>
                <label>
                  Contacto preferido
                  <select name="preferredContact" value={formData.preferredContact} onChange={updateFormField}>
                    <option>Llamada</option>
                    <option>Texto</option>
                    <option>Email</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="form-block">
              <h3>Vehículo</h3>
              <div className="field-grid two-up">
                <label>
                  Año
                  <input name="vehicleYear" value={formData.vehicleYear} onChange={updateFormField} />
                </label>
                <label>
                  Marca y modelo
                  <input name="makeModel" value={formData.makeModel} onChange={updateFormField} />
                </label>
                <label>
                  VIN
                  <input name="vin" value={formData.vin} onChange={updateFormField} />
                </label>
                <label>
                  Millaje
                  <input name="odometer" value={formData.odometer} onChange={updateFormField} />
                </label>
              </div>
            </div>

            <div className="form-block">
              <h3>Tipo de solicitud</h3>
              <div className="field-grid two-up">
                <label>
                  Trabajo principal
                  <select name="serviceType" value={formData.serviceType} onChange={updateFormField}>
                    <option>Reparación</option>
                    <option>Mantenimiento</option>
                    <option>Diagnóstico</option>
                    <option>Performance / upgrade</option>
                    <option>Piezas</option>
                  </select>
                </label>
                <label>
                  Disponibilidad
                  <input name="availability" value={formData.availability} onChange={updateFormField} />
                </label>
                <label>
                  Presupuesto aproximado
                  <input name="budgetRange" value={formData.budgetRange} onChange={updateFormField} />
                </label>
                <label>
                  Fecha de solicitud
                  <input type="date" name="requestDate" value={formData.requestDate} onChange={updateFormField} />
                </label>
              </div>

              <div className="service-pills">
                {serviceOptions.map((service) => {
                  const active = selectedServices.includes(service.shortLabel)
                  return (
                    <button
                      key={service.shortLabel}
                      className={`pill ${active ? 'active' : ''}`}
                      type="button"
                      onClick={() => toggleService(service.shortLabel)}
                    >
                      {service.shortLabel}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="form-block">
              <h3>Cuéntanos lo necesario</h3>
              <label>
                Síntomas, servicio o falla
                <textarea name="issueDetails" value={formData.issueDetails} onChange={updateFormField} rows="5" />
              </label>
              <label>
                Objetivo del proyecto o upgrade
                <textarea name="goals" value={formData.goals} onChange={updateFormField} rows="4" />
              </label>
              <label>
                Piezas o servicios que te interesan
                <textarea name="requestItems" value={formData.requestItems} onChange={updateFormField} rows="4" />
              </label>
            </div>

            <div className="form-footer form-footer-single">
              <aside className="totals-card">
                <div className="quote-summary-row">
                  <span>Tipo de solicitud</span>
                  <strong>{formData.serviceType}</strong>
                </div>
                <div className="quote-summary-row">
                  <span>Servicios marcados</span>
                  <strong>{selectedServices.length}</strong>
                </div>
                <div className="grand-total">
                  <span>Próximo paso</span>
                  <strong>Revisión del taller</strong>
                </div>
              </aside>
            </div>

            <div className="submit-row">
              <div className="submit-actions">
                <button className="button button-primary" type="submit" disabled={submitState === 'submitting'}>
                  {submitState === 'submitting' ? 'Enviando solicitud...' : 'Enviar solicitud'}
                </button>
                <button className="button button-secondary" type="button" onClick={clearDraft}>
                  Limpiar borrador
                </button>
              </div>
              <div className="submit-copy">
                <p>Compártelo con el taller para acelerar la evaluacion inicial y la cotizacion.</p>
                {submitMessage ? (
                  <p className={`submit-status submit-status-${submitState}`}>{submitMessage}</p>
                ) : null}
              </div>
            </div>
          </form>
        </section>

        <aside className="panel-section work-order-sidebar">
          <div className="sidebar-block">
            <p className="eyebrow">Informacion del taller</p>
            <h2>Euro Parts Engineering LLC</h2>
            <p>1004 Ave Jesus T. Pinero, San Juan, PR 00921</p>
            <p>lunes a viernes 9:00 a.m - 5:00 p.m</p>
            <a href="tel:+17872779490">(787) 277-9490</a>
            <a href="mailto:epe.corp@gmail.com">epe.corp@gmail.com</a>
          </div>
          <div className="sidebar-block">
            <p className="eyebrow">Consejo</p>
            <h2>Mientras mas claro, mejor</h2>
            <p>
              Si incluyes sintomas, objetivo del trabajo y preferencias de piezas, el taller puede
              responder con una orientacion inicial mas precisa.
            </p>
          </div>
          <div className="mini-map-frame">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d35449.96867647493!2d-66.08638986095401!3d18.42085775327863!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8c0368f3ddd41f73%3A0x831e9e0a664f14b2!2sEuro%20Parts%20Engineering!5e0!3m2!1sen!2spr!4v1773688279322!5m2!1sen!2spr"
              width="600"
              height="360"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa del taller"
            />
          </div>
        </aside>
      </main>
    </div>
  )
}

export default WorkOrderPage
