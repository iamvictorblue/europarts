import { useEffect, useState } from 'react'
import { makes, serviceOptions } from './site-data'
import { isSupabaseConfigured, supabase } from './lib/supabase'
import WhatsAppFloat, { WhatsAppIcon, whatsappUrl } from './WhatsAppFloat'

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

const currentYear = new Date().getFullYear()
const yearOptions = [
  ...Array.from({ length: currentYear + 2 - 1985 }, (_, index) => String(currentYear + 1 - index)),
  'Anterior a 1985',
]
const makeOptions = [...makes.map((make) => make.name), 'Otra marca europea']
const mileageOptions = [
  'Menos de 30,000 millas',
  '30,000 - 60,000 millas',
  '60,000 - 100,000 millas',
  '100,000 - 150,000 millas',
  'Más de 150,000 millas',
  'No estoy seguro',
]
const availabilityOptions = [
  'Lo antes posible',
  'Esta semana',
  'La próxima semana',
  'En las próximas 2 semanas',
  'Flexible',
]
const budgetOptions = [
  'Menos de $500',
  '$500 - $1,000',
  '$1,000 - $2,500',
  '$2,500 - $5,000',
  'Más de $5,000',
  'Aún no lo sé',
]
const contactOptions = ['Llamada', 'Texto', 'Email']
const serviceTypeOptions = ['Reparación', 'Mantenimiento', 'Diagnóstico', 'Performance / upgrade', 'Piezas']

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
      vehicleMake: '',
      vehicleModel: '',
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
    const formData = { ...baseState.formData, ...parsed.formData }

    if (!formData.vehicleMake && !formData.vehicleModel && parsed.formData?.makeModel) {
      formData.vehicleModel = parsed.formData.makeModel
    }
    delete formData.makeModel

    return {
      selectedServices: parsed.selectedServices?.length
        ? parsed.selectedServices.map((service) => legacyServiceLabels[service] ?? service)
        : baseState.selectedServices,
      formData,
    }
  } catch {
    return baseState
  }
}

function ChoiceRow({ label, name, options, value, onSelect }) {
  return (
    <div className="choice-group">
      <span className="choice-label">{label}</span>
      <div className="choice-row" role="group" aria-label={label}>
        {options.map((option) => (
          <button
            key={option}
            className={`choice-chip ${value === option ? 'active' : ''}`}
            type="button"
            aria-pressed={value === option}
            onClick={() => onSelect(name, option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
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

  const setFormField = (name, value) => {
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const updateFormField = (event) => {
    const { name, value } = event.target
    setFormField(name, value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!isSupabaseConfigured || !supabase) {
      setSubmitState('error')
      setSubmitMessage('El formulario no esta configurado correctamente en este momento.')
      return
    }

    const payload = {
      client_name: formData.clientName.trim(),
      client_phone: formData.clientPhone.trim(),
      client_email: formData.clientEmail.trim(),
      preferred_contact: formData.preferredContact,
      request_date: formData.requestDate || null,
      vehicle_year: formData.vehicleYear,
      make_model: `${formData.vehicleMake} ${formData.vehicleModel.trim()}`.trim(),
      vin: formData.vin.trim(),
      odometer: formData.odometer,
      service_type: formData.serviceType,
      availability: formData.availability,
      budget_range: formData.budgetRange,
      issue_details: formData.issueDetails.trim(),
      goals: formData.goals.trim(),
      request_items: formData.requestItems.trim(),
      selected_services: selectedServices,
      source_page: 'orden-de-trabajo.html',
      status: 'nueva',
    }

    if (!payload.client_name || !payload.client_phone || !formData.vehicleMake || !payload.issue_details) {
      setSubmitState('error')
      setSubmitMessage('Completa nombre, telefono, la marca del vehiculo y la descripcion del trabajo para enviar la solicitud.')
      return
    }

    setSubmitState('submitting')
    setSubmitMessage('')

    const { error } = await supabase.from('quote_requests').insert(payload)

    if (error) {
      setSubmitState('error')
      setSubmitMessage('No se pudo enviar la solicitud. Intenta de nuevo en un momento.')
      return
    }

    setSubmitState('success')
    setSubmitMessage('Solicitud enviada. El taller ya puede revisarla.')
    window.localStorage.removeItem(storageKey)
  }

  const clearDraft = () => {
    window.localStorage.removeItem(storageKey)
    const freshState = buildInitialState(today)
    setSelectedServices(freshState.selectedServices)
    setFormData(freshState.formData)
    setSubmitState('idle')
    setSubmitMessage('')
  }

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  const vehicleSummary = [formData.vehicleYear !== 'Anterior a 1985' ? formData.vehicleYear : '', formData.vehicleMake, formData.vehicleModel]
    .filter(Boolean)
    .join(' ')

  const buildWhatsAppMessage = () => {
    const lines = ['Hola Euro Parts Engineering, quiero solicitar una cotización.']
    if (formData.clientName.trim()) lines.push(`Nombre: ${formData.clientName.trim()}`)
    if (formData.clientPhone.trim()) lines.push(`Teléfono: ${formData.clientPhone.trim()}`)
    if (vehicleSummary) lines.push(`Vehículo: ${vehicleSummary}`)
    if (formData.odometer) lines.push(`Millaje: ${formData.odometer}`)
    lines.push(`Trabajo principal: ${formData.serviceType}`)
    if (selectedServices.length) lines.push(`Servicios: ${selectedServices.join(', ')}`)
    if (formData.availability) lines.push(`Disponibilidad: ${formData.availability}`)
    if (formData.budgetRange) lines.push(`Presupuesto: ${formData.budgetRange}`)
    if (formData.issueDetails.trim()) lines.push(`Detalles: ${formData.issueDetails.trim()}`)
    if (formData.goals.trim()) lines.push(`Objetivo: ${formData.goals.trim()}`)
    if (formData.requestItems.trim()) lines.push(`Piezas de interés: ${formData.requestItems.trim()}`)
    return lines.join('\n')
  }

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
          <h1>
            Cotiza reparación, mantenimiento o upgrades para tu{' '}
            <span className="title-accent">auto europeo.</span>
          </h1>
          <p className="hero-text">
            Casi todo se escoge con un toque: solo escribes tu nombre, teléfono, el modelo y qué
            necesita el carro. Menos de dos minutos desde el celular.
          </p>
        </div>
      </header>

      <main className="page-shell work-order-layout">
        <section className="panel-section work-order-panel">
          <div className="section-heading">
            <p className="eyebrow">Formulario de cotización</p>
            <p className="required-note">
              Los campos marcados con <span className="req-mark">*</span> son necesarios para
              enviar la solicitud.
            </p>
          </div>

          <form className="work-order-card" onSubmit={handleSubmit}>
            <div className="form-block">
              <h3 className="form-step-heading">
                <span className="form-step-index" aria-hidden="true">
                  01
                </span>
                Contacto
              </h3>
              <div className="field-grid two-up">
                <label>
                  <span className="field-label-text">
                    Nombre <span className="req-mark">*</span>
                  </span>
                  <input
                    name="clientName"
                    autoComplete="name"
                    placeholder="Ej: Juan Pérez"
                    value={formData.clientName}
                    onChange={updateFormField}
                  />
                </label>
                <label>
                  <span className="field-label-text">
                    Teléfono <span className="req-mark">*</span>
                  </span>
                  <input
                    name="clientPhone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="787-555-0123"
                    value={formData.clientPhone}
                    onChange={updateFormField}
                  />
                </label>
              </div>
              <div className="field-grid two-up">
                <label>
                  <span className="field-label-text">
                    Email <span className="optional-mark">opcional</span>
                  </span>
                  <input
                    name="clientEmail"
                    type="email"
                    autoComplete="email"
                    placeholder="nombre@email.com"
                    value={formData.clientEmail}
                    onChange={updateFormField}
                  />
                </label>
                <ChoiceRow
                  label="¿Cómo prefieres que te contactemos?"
                  name="preferredContact"
                  options={contactOptions}
                  value={formData.preferredContact}
                  onSelect={setFormField}
                />
              </div>
            </div>

            <div className="form-block">
              <h3 className="form-step-heading">
                <span className="form-step-index" aria-hidden="true">
                  02
                </span>
                Vehículo
              </h3>
              <div className="field-grid two-up">
                <label>
                  <span className="field-label-text">
                    Marca <span className="req-mark">*</span>
                  </span>
                  <select name="vehicleMake" value={formData.vehicleMake} onChange={updateFormField}>
                    <option value="" disabled>
                      Selecciona la marca
                    </option>
                    {makeOptions.map((make) => (
                      <option key={make}>{make}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Modelo
                  <input
                    name="vehicleModel"
                    placeholder="Ej: Golf GTI, 911 Carrera, C300"
                    value={formData.vehicleModel}
                    onChange={updateFormField}
                  />
                </label>
                <label>
                  Año
                  <select name="vehicleYear" value={formData.vehicleYear} onChange={updateFormField}>
                    <option value="" disabled>
                      Selecciona el año
                    </option>
                    {yearOptions.map((year) => (
                      <option key={year}>{year}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Millaje
                  <select name="odometer" value={formData.odometer} onChange={updateFormField}>
                    <option value="" disabled>
                      Selecciona el millaje
                    </option>
                    {mileageOptions.map((range) => (
                      <option key={range}>{range}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <div className="form-block">
              <h3 className="form-step-heading">
                <span className="form-step-index" aria-hidden="true">
                  03
                </span>
                Tipo de solicitud
              </h3>
              <ChoiceRow
                label="¿Qué necesitas principalmente?"
                name="serviceType"
                options={serviceTypeOptions}
                value={formData.serviceType}
                onSelect={setFormField}
              />
              <div className="field-grid two-up">
                <label>
                  ¿Cuándo puedes traer el carro?
                  <select name="availability" value={formData.availability} onChange={updateFormField}>
                    <option value="" disabled>
                      Selecciona tu disponibilidad
                    </option>
                    {availabilityOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Presupuesto aproximado
                  <select name="budgetRange" value={formData.budgetRange} onChange={updateFormField}>
                    <option value="" disabled>
                      Selecciona un rango
                    </option>
                    {budgetOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
              </div>

              <p className="pills-label">Marca los servicios relacionados</p>
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
              <h3 className="form-step-heading">
                <span className="form-step-index" aria-hidden="true">
                  04
                </span>
                Cuéntanos qué pasa
              </h3>
              <label>
                <span className="field-label-text">
                  Describe el problema o lo que necesitas <span className="req-mark">*</span>
                </span>
                <textarea
                  name="issueDetails"
                  rows="5"
                  placeholder="Ej: El carro pierde fuerza al acelerar y la luz del motor prende desde la semana pasada."
                  value={formData.issueDetails}
                  onChange={updateFormField}
                />
              </label>

              <details className="optional-details">
                <summary>
                  <span className="optional-details-title">Detalles opcionales</span>
                  <span className="optional-details-hint">VIN, objetivo del proyecto, piezas específicas</span>
                </summary>
                <div className="optional-details-fields">
                  <label>
                    VIN
                    <input
                      name="vin"
                      maxLength="17"
                      placeholder="17 caracteres (opcional, agiliza la búsqueda de piezas)"
                      value={formData.vin}
                      onChange={updateFormField}
                    />
                  </label>
                  <label>
                    Objetivo del proyecto o upgrade
                    <textarea
                      name="goals"
                      rows="3"
                      placeholder="Ej: Busco stage 1 con piezas APR y mejor respuesta del acelerador."
                      value={formData.goals}
                      onChange={updateFormField}
                    />
                  </label>
                  <label>
                    Piezas o servicios que te interesan
                    <textarea
                      name="requestItems"
                      rows="3"
                      placeholder="Ej: Frenos delanteros, aceite Liqui Moly, filtro de aire."
                      value={formData.requestItems}
                      onChange={updateFormField}
                    />
                  </label>
                </div>
              </details>
            </div>

            <div className="form-footer form-footer-single">
              <aside className="totals-card">
                <div className="quote-summary-row">
                  <span>Vehículo</span>
                  <strong>{vehicleSummary || 'Sin especificar'}</strong>
                </div>
                <div className="quote-summary-row">
                  <span>Trabajo principal</span>
                  <strong>{formData.serviceType}</strong>
                </div>
                <div className="quote-summary-row">
                  <span>Disponibilidad</span>
                  <strong>{formData.availability || 'Sin especificar'}</strong>
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
                <a
                  className="button button-whatsapp"
                  href={whatsappUrl(buildWhatsAppMessage())}
                  target="_blank"
                  rel="noreferrer"
                >
                  <WhatsAppIcon className="button-whatsapp-icon" />
                  Enviar por WhatsApp
                </a>
                <button className="button button-secondary" type="button" onClick={clearDraft}>
                  Limpiar borrador
                </button>
              </div>
              <div className="submit-copy">
                <p>
                  Envíala al sistema del taller o directo por WhatsApp con el resumen ya escrito —
                  lo que te sea más cómodo.
                </p>
                {submitMessage ? (
                  <p className={`submit-status submit-status-${submitState}`}>{submitMessage}</p>
                ) : null}
              </div>
            </div>
          </form>
        </section>

        <aside className="panel-section work-order-sidebar">
          <div className="sidebar-block contact-block">
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

      <WhatsAppFloat message="Hola Euro Parts Engineering, quiero cotizar un servicio para mi auto europeo." />
    </div>
  )
}

export default WorkOrderPage
