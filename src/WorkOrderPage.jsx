import { useEffect, useState } from 'react'
import { serviceOptions } from './site-data'

const defaultLine = { description: '', amount: '' }
const defaultPart = { partNumber: '', name: '', quantity: '1', unitPrice: '', amount: '' }
const storageKey = 'epe-work-order-draft'
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

function currency(value) {
  return new Intl.NumberFormat('es-PR', {
    style: 'currency',
    currency: 'USD',
  }).format(value || 0)
}

function toNumber(value) {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function buildInitialState(today) {
  const baseState = {
    selectedServices: ['Diagnóstico'],
    laborRows: [{ ...defaultLine }, { ...defaultLine }],
    partsRows: [{ ...defaultPart }, { ...defaultPart }],
    taxRate: '11.5',
    formData: {
      clientName: '',
      clientPhone: '',
      date: today,
      orderReceivedBy: '',
      orderDateTime: '',
      datePromised: '',
      dateDelivered: '',
      vin: '',
      odometer: '',
      makeModel: '',
      license: '',
      motor: '',
      workOrderCompiledBy: '',
      workAuthorizedBy: '',
      authorizationDate: today,
      notes: '',
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
      laborRows: parsed.laborRows?.length ? parsed.laborRows : baseState.laborRows,
      partsRows: parsed.partsRows?.length ? parsed.partsRows : baseState.partsRows,
      taxRate: parsed.taxRate ?? baseState.taxRate,
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
  const [laborRows, setLaborRows] = useState(initialState.laborRows)
  const [partsRows, setPartsRows] = useState(initialState.partsRows)
  const [taxRate, setTaxRate] = useState(initialState.taxRate)
  const [formData, setFormData] = useState(initialState.formData)

  const laborTotal = laborRows.reduce((sum, row) => sum + toNumber(row.amount), 0)
  const partsTotal = partsRows.reduce((sum, row) => {
    const quantity = toNumber(row.quantity)
    const unitPrice = toNumber(row.unitPrice)
    const amount = row.amount ? toNumber(row.amount) : quantity * unitPrice
    return sum + amount
  }, 0)
  const subtotal = laborTotal + partsTotal
  const totalTax = subtotal * (toNumber(taxRate) / 100)
  const total = subtotal + totalTax

  useEffect(() => {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        selectedServices,
        laborRows,
        partsRows,
        taxRate,
        formData,
      }),
    )
  }, [formData, laborRows, partsRows, selectedServices, taxRate])

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

  const updateLaborRow = (index, key, value) => {
    setLaborRows((current) =>
      current.map((row, rowIndex) => (rowIndex === index ? { ...row, [key]: value } : row)),
    )
  }

  const updatePartRow = (index, key, value) => {
    setPartsRows((current) =>
      current.map((row, rowIndex) => {
        if (rowIndex !== index) {
          return row
        }

        const nextRow = { ...row, [key]: value }
        if (key === 'quantity' || key === 'unitPrice') {
          nextRow.amount = String(toNumber(nextRow.quantity) * toNumber(nextRow.unitPrice))
        }
        return nextRow
      }),
    )
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    window.print()
  }

  const clearDraft = () => {
    const freshState = buildInitialState(today)
    setSelectedServices(freshState.selectedServices)
    setLaborRows(freshState.laborRows)
    setPartsRows(freshState.partsRows)
    setTaxRate(freshState.taxRate)
    setFormData(freshState.formData)
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
          <p className="eyebrow">Orden de trabajo digital</p>
          <h1>Recepción clara para diagnóstico, autorización y seguimiento.</h1>
          <p className="hero-text">
            Esta página vive separada del landing para que el recorrido principal del sitio se sienta
            más enfocado. Aquí puedes llenar, imprimir o guardar la orden de trabajo del taller.
          </p>
        </div>
      </header>

      <main className="page-shell work-order-layout">
        <section className="panel-section work-order-panel">
          <div className="section-heading">
            <p className="eyebrow">Formulario del taller</p>
            <h2>Basado en la hoja física incluida, con totales calculados automáticamente.</h2>
          </div>

          <form className="work-order-card" onSubmit={handleSubmit}>
            <div className="form-block">
              <h3>Datos del cliente y la orden</h3>
              <div className="field-grid two-up">
                <label>
                  Nombre del cliente
                  <input name="clientName" value={formData.clientName} onChange={updateFormField} />
                </label>
                <label>
                  Teléfono del cliente
                  <input name="clientPhone" value={formData.clientPhone} onChange={updateFormField} />
                </label>
                <label>
                  Fecha
                  <input type="date" name="date" value={formData.date} onChange={updateFormField} />
                </label>
                <label>
                  Recibido por
                  <input name="orderReceivedBy" value={formData.orderReceivedBy} onChange={updateFormField} />
                </label>
                <label>
                  Fecha y hora de la orden
                  <input
                    type="datetime-local"
                    name="orderDateTime"
                    value={formData.orderDateTime}
                    onChange={updateFormField}
                  />
                </label>
                <label>
                  Fecha prometida
                  <input type="date" name="datePromised" value={formData.datePromised} onChange={updateFormField} />
                </label>
                <label>
                  Fecha entregada
                  <input type="date" name="dateDelivered" value={formData.dateDelivered} onChange={updateFormField} />
                </label>
              </div>
            </div>

            <div className="form-block">
              <h3>Datos del vehículo</h3>
              <div className="field-grid two-up">
                <label>
                  VIN
                  <input name="vin" value={formData.vin} onChange={updateFormField} />
                </label>
                <label>
                  Millaje
                  <input name="odometer" value={formData.odometer} onChange={updateFormField} />
                </label>
                <label>
                  Marca y modelo
                  <input name="makeModel" value={formData.makeModel} onChange={updateFormField} />
                </label>
                <label>
                  Tablilla y estado
                  <input name="license" value={formData.license} onChange={updateFormField} />
                </label>
                <label>
                  Número de motor
                  <input name="motor" value={formData.motor} onChange={updateFormField} />
                </label>
              </div>
            </div>

            <div className="form-block">
              <h3>Servicios solicitados</h3>
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
              <label>
                Notas u otra solicitud
                <textarea name="notes" value={formData.notes} onChange={updateFormField} rows="4" />
              </label>
            </div>

            <div className="form-block">
              <div className="block-heading">
                <h3>Mano de obra</h3>
                <button
                  className="small-action"
                  type="button"
                  onClick={() => setLaborRows((current) => [...current, { ...defaultLine }])}
                >
                  Agregar línea
                </button>
              </div>
              <div className="table-grid labor-grid">
                <div className="table-head">Descripción</div>
                <div className="table-head">Cantidad</div>
                {laborRows.map((row, index) => (
                  <div className="table-row" key={`labor-${index}`}>
                    <div className="mobile-field">
                      <span className="mobile-field-label">Descripción</span>
                      <input
                        placeholder="Descripción del trabajo"
                        value={row.description}
                        onChange={(event) => updateLaborRow(index, 'description', event.target.value)}
                      />
                    </div>
                    <div className="mobile-field">
                      <span className="mobile-field-label">Cantidad</span>
                      <input
                        placeholder="0.00"
                        inputMode="decimal"
                        value={row.amount}
                        onChange={(event) => updateLaborRow(index, 'amount', event.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-block">
              <div className="block-heading">
                <h3>Piezas</h3>
                <button
                  className="small-action"
                  type="button"
                  onClick={() => setPartsRows((current) => [...current, { ...defaultPart }])}
                >
                  Agregar línea
                </button>
              </div>
              <div className="parts-table">
                <div className="parts-head">Pieza #</div>
                <div className="parts-head">Nombre de pieza</div>
                <div className="parts-head">Cant.</div>
                <div className="parts-head">Precio unitario</div>
                <div className="parts-head">Cantidad</div>
                {partsRows.map((row, index) => (
                  <div className="parts-row" key={`part-${index}`}>
                    <div className="mobile-field">
                      <span className="mobile-field-label">Pieza #</span>
                      <input
                        placeholder="Número de pieza"
                        value={row.partNumber}
                        onChange={(event) => updatePartRow(index, 'partNumber', event.target.value)}
                      />
                    </div>
                    <div className="mobile-field">
                      <span className="mobile-field-label">Nombre de pieza</span>
                      <input
                        placeholder="Nombre de pieza"
                        value={row.name}
                        onChange={(event) => updatePartRow(index, 'name', event.target.value)}
                      />
                    </div>
                    <div className="mobile-field">
                      <span className="mobile-field-label">Cant.</span>
                      <input
                        placeholder="1"
                        inputMode="numeric"
                        value={row.quantity}
                        onChange={(event) => updatePartRow(index, 'quantity', event.target.value)}
                      />
                    </div>
                    <div className="mobile-field">
                      <span className="mobile-field-label">Precio unitario</span>
                      <input
                        placeholder="0.00"
                        inputMode="decimal"
                        value={row.unitPrice}
                        onChange={(event) => updatePartRow(index, 'unitPrice', event.target.value)}
                      />
                    </div>
                    <div className="mobile-field">
                      <span className="mobile-field-label">Cantidad</span>
                      <input
                        placeholder="0.00"
                        inputMode="decimal"
                        value={row.amount}
                        onChange={(event) => updatePartRow(index, 'amount', event.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-footer">
              <div className="field-grid two-up">
                <label>
                  Orden preparada por
                  <input
                    name="workOrderCompiledBy"
                    value={formData.workOrderCompiledBy}
                    onChange={updateFormField}
                  />
                </label>
                <label>
                  Trabajo autorizado por
                  <input
                    name="workAuthorizedBy"
                    value={formData.workAuthorizedBy}
                    onChange={updateFormField}
                  />
                </label>
                <label>
                  Fecha de autorización
                  <input
                    type="date"
                    name="authorizationDate"
                    value={formData.authorizationDate}
                    onChange={updateFormField}
                  />
                </label>
                <label>
                  IVU %
                  <input value={taxRate} onChange={(event) => setTaxRate(event.target.value)} />
                </label>
              </div>

              <aside className="totals-card">
                <div>
                  <span>Total mano de obra</span>
                  <strong>{currency(laborTotal)}</strong>
                </div>
                <div>
                  <span>Total piezas</span>
                  <strong>{currency(partsTotal)}</strong>
                </div>
                <div>
                  <span>Subtotal</span>
                  <strong>{currency(subtotal)}</strong>
                </div>
                <div>
                  <span>Total IVU</span>
                  <strong>{currency(totalTax)}</strong>
                </div>
                <div className="grand-total">
                  <span>Total</span>
                  <strong>{currency(total)}</strong>
                </div>
              </aside>
            </div>

            <div className="submit-row">
              <div className="submit-actions">
                <button className="button button-primary" type="submit">
                  Imprimir o guardar orden
                </button>
                <button className="button button-secondary" type="button" onClick={clearDraft}>
                  Limpiar borrador
                </button>
              </div>
              <p>
                Lista para recepción, impresión y futura integración con correo o administración del
                taller.
              </p>
            </div>
          </form>
        </section>

        <aside className="panel-section work-order-sidebar">
          <div className="sidebar-block">
            <p className="eyebrow">Información del taller</p>
            <h2>Euro Parts Engineering LLC</h2>
            <p>1004 Ave Jesús T. Piñero, San Juan, PR 00921</p>
            <p>lunes a viernes 9:00 a.m - 5:00 p.m</p>
            <a href="tel:+17872779490">(787) 277-9490</a>
            <a href="mailto:epe.corp@gmail.com">epe.corp@gmail.com</a>
          </div>
          <div className="sidebar-block">
            <p className="eyebrow">Recomendación</p>
            <h2>Llama antes de llegar</h2>
            <p>
              Confirma disponibilidad, estimados y coordinación de entrega para que la recepción sea
              más rápida.
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
