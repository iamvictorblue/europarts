import { useEffect, useMemo, useState } from 'react'
import { isSupabaseConfigured, supabase } from './lib/supabase'

const statusOptions = ['nueva', 'en revision', 'cotizada', 'seguimiento', 'cerrada']

function formatDateTime(value) {
  if (!value) {
    return 'Sin fecha'
  }

  try {
    return new Intl.DateTimeFormat('es-PR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value))
  } catch {
    return value
  }
}

function buildDrafts(requests) {
  return Object.fromEntries(
    requests.map((request) => [
      request.id,
      {
        status: request.status || 'nueva',
        followUpDate: request.follow_up_date || '',
        internalNotes: request.internal_notes || '',
      },
    ]),
  )
}

function AdminPage() {
  const [session, setSession] = useState(null)
  const [isLoadingSession, setIsLoadingSession] = useState(true)
  const [isLoadingRequests, setIsLoadingRequests] = useState(false)
  const [authError, setAuthError] = useState('')
  const [requestError, setRequestError] = useState('')
  const [requests, setRequests] = useState([])
  const [drafts, setDrafts] = useState({})
  const [saveState, setSaveState] = useState({})
  const [filters, setFilters] = useState({ search: '', status: 'all' })
  const [credentials, setCredentials] = useState({ email: '', password: '' })

  const loadRequests = async () => {
    if (!supabase) {
      return
    }

    setIsLoadingRequests(true)
    setRequestError('')

    const { data, error } = await supabase
      .from('quote_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setRequestError('No se pudieron cargar las solicitudes desde Supabase.')
      setRequests([])
      setDrafts({})
    } else {
      const nextRequests = data ?? []
      setRequests(nextRequests)
      setDrafts(buildDrafts(nextRequests))
    }

    setIsLoadingRequests(false)
  }

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setIsLoadingSession(false)
      return undefined
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null)
      setIsLoadingSession(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setIsLoadingSession(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session || !supabase) {
      return
    }

    loadRequests()
  }, [session])

  const handleSignIn = async (event) => {
    event.preventDefault()

    if (!supabase) {
      setAuthError('Faltan las credenciales de Supabase en el proyecto.')
      return
    }

    setAuthError('')
    setIsLoadingSession(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    })

    if (error) {
      setAuthError('No se pudo iniciar sesion. Verifica email y contrasena.')
      setIsLoadingSession(false)
    }
  }

  const handleSignOut = async () => {
    if (!supabase) {
      return
    }

    await supabase.auth.signOut()
    setRequests([])
    setDrafts({})
    setSaveState({})
  }

  const updateDraftField = (requestId, field, value) => {
    setDrafts((current) => ({
      ...current,
      [requestId]: {
        ...(current[requestId] ?? {}),
        [field]: value,
      },
    }))
    setSaveState((current) => ({
      ...current,
      [requestId]: current[requestId]?.state === 'success' ? { state: 'idle', message: '' } : current[requestId],
    }))
  }

  const saveRequest = async (requestId) => {
    if (!supabase) {
      return
    }

    const draft = drafts[requestId]
    if (!draft) {
      return
    }

    setSaveState((current) => ({
      ...current,
      [requestId]: { state: 'saving', message: '' },
    }))

    const payload = {
      status: draft.status,
      follow_up_date: draft.followUpDate || null,
      internal_notes: draft.internalNotes.trim() || null,
    }

    const { error } = await supabase.from('quote_requests').update(payload).eq('id', requestId)

    if (error) {
      setSaveState((current) => ({
        ...current,
        [requestId]: {
          state: 'error',
          message: 'No se pudo guardar el seguimiento de esta solicitud.',
        },
      }))
      return
    }

    setRequests((current) =>
      current.map((request) =>
        request.id === requestId
          ? {
              ...request,
              ...payload,
            }
          : request,
      ),
    )

    setSaveState((current) => ({
      ...current,
      [requestId]: { state: 'success', message: 'Cambios guardados en Supabase.' },
    }))
  }

  const filteredRequests = useMemo(
    () =>
      requests.filter((request) => {
        const matchesStatus = filters.status === 'all' ? true : request.status === filters.status
        const searchValue = filters.search.trim().toLowerCase()

        if (!searchValue) {
          return matchesStatus
        }

        const haystack = [
          request.client_name,
          request.client_phone,
          request.client_email,
          request.make_model,
          request.vehicle_year,
          request.service_type,
          request.issue_details,
          request.goals,
          request.request_items,
          request.internal_notes,
          ...(request.selected_services ?? []),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        return matchesStatus && haystack.includes(searchValue)
      }),
    [filters.search, filters.status, requests],
  )

  const totalRequests = requests.length
  const visibleRequests = filteredRequests.length
  const newRequests = requests.filter((request) => request.status === 'nueva').length
  const inProgressRequests = requests.filter((request) =>
    ['en revision', 'seguimiento', 'cotizada'].includes(request.status),
  ).length

  return (
    <div className="work-order-view admin-view">
      <header className="subpage-hero">
        <div className="page-shell nav-shell">
          <nav className="nav-bar">
            <div className="nav-top">
              <a className="brand-lockup" href="/index.html" aria-label="Euro Parts Engineering">
                <img src="/logo.png" alt="Euro Parts Engineering LLC" />
              </a>
            </div>
            <div className="nav-actions">
              <div className="nav-links">
                <a href="/index.html">Sitio</a>
                <a href="/orden-de-trabajo.html">Cotizacion</a>
              </div>
              {session ? (
                <button className="nav-cta" type="button" onClick={handleSignOut}>
                  Cerrar sesion
                </button>
              ) : null}
            </div>
          </nav>
        </div>

        <div className="page-shell subpage-shell">
          <p className="eyebrow">Panel admin</p>
          <h1>Gestiona solicitudes, seguimiento y notas internas desde Supabase.</h1>
          <p className="hero-text">
            Este panel ya permite revisar cotizaciones, mover estados y dejar notas internas para el
            seguimiento del taller.
          </p>
        </div>
      </header>

      <main className="page-shell admin-layout">
        {!isSupabaseConfigured ? (
          <section className="panel-section admin-panel">
            <div className="section-heading">
              <p className="eyebrow">Configuracion pendiente</p>
              <h2>Faltan las variables de entorno de Supabase.</h2>
              <p>Configura `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` para usar el panel admin.</p>
            </div>
          </section>
        ) : !session ? (
          <section className="panel-section admin-panel">
            <div className="section-heading">
              <p className="eyebrow">Acceso admin</p>
              <h2>Inicia sesion para ver y actualizar las solicitudes.</h2>
              <p>Usa un usuario creado en Supabase Auth para entrar al panel interno del taller.</p>
            </div>

            <form className="work-order-card admin-auth-card" onSubmit={handleSignIn}>
              <label>
                Email
                <input
                  type="email"
                  value={credentials.email}
                  onChange={(event) => setCredentials((current) => ({ ...current, email: event.target.value }))}
                />
              </label>
              <label>
                Contrasena
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))}
                />
              </label>
              <button className="button button-primary" type="submit" disabled={isLoadingSession}>
                {isLoadingSession ? 'Entrando...' : 'Entrar al panel'}
              </button>
              {authError ? <p className="submit-status submit-status-error">{authError}</p> : null}
            </form>
          </section>
        ) : (
          <>
            <section className="panel-section admin-panel">
              <div className="section-heading">
                <p className="eyebrow">Solicitudes</p>
                <h2>{isLoadingRequests ? 'Cargando solicitudes...' : `${visibleRequests} solicitudes visibles`}</h2>
              </div>

              <div className="admin-stats">
                <div className="work-order-card">
                  <p className="eyebrow">Total</p>
                  <h3>{totalRequests}</h3>
                  <p>Solicitudes guardadas en `quote_requests`.</p>
                </div>
                <div className="work-order-card">
                  <p className="eyebrow">Nuevas</p>
                  <h3>{newRequests}</h3>
                  <p>Registros listos para revisar y contactar.</p>
                </div>
                <div className="work-order-card">
                  <p className="eyebrow">En proceso</p>
                  <h3>{inProgressRequests}</h3>
                  <p>Casos en revision, seguimiento o ya cotizados.</p>
                </div>
              </div>

              <div className="admin-toolbar">
                <label>
                  Buscar
                  <input
                    value={filters.search}
                    onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
                    placeholder="Cliente, vehiculo, servicio..."
                  />
                </label>
                <label>
                  Estado
                  <select
                    value={filters.status}
                    onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
                  >
                    <option value="all">Todos</option>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  className="button button-secondary"
                  type="button"
                  onClick={loadRequests}
                  disabled={isLoadingRequests}
                >
                  {isLoadingRequests ? 'Recargando...' : 'Recargar solicitudes'}
                </button>
              </div>

              {requestError ? <p className="submit-status submit-status-error">{requestError}</p> : null}

              <div className="admin-requests">
                {filteredRequests.map((request) => {
                  const draft = drafts[request.id] ?? {
                    status: request.status || 'nueva',
                    followUpDate: request.follow_up_date || '',
                    internalNotes: request.internal_notes || '',
                  }
                  const requestSaveState = saveState[request.id] ?? { state: 'idle', message: '' }

                  return (
                    <article className="admin-request-card" key={request.id}>
                      <div className="admin-request-head">
                        <div>
                          <p className="eyebrow">Solicitud</p>
                          <h3>{request.client_name}</h3>
                        </div>
                        <div className={`admin-status-pill admin-status-pill-${draft.status.replace(/\s+/g, '-')}`}>
                          {draft.status}
                        </div>
                      </div>

                      <div className="admin-request-meta">
                        <span>{request.make_model || 'Vehiculo sin modelo'}</span>
                        <span>{request.vehicle_year || 'Ano sin indicar'}</span>
                        <span>{request.service_type || 'Tipo sin indicar'}</span>
                        <span>{formatDateTime(request.created_at)}</span>
                      </div>

                      <div className="admin-request-grid">
                        <div className="admin-request-block">
                          <strong>Contacto</strong>
                          <p>{request.client_phone || 'Sin telefono'}</p>
                          <p>{request.client_email || 'Sin email'}</p>
                          <p>{request.preferred_contact || 'Sin preferencia'}</p>
                        </div>
                        <div className="admin-request-block">
                          <strong>Vehiculo</strong>
                          <p>VIN: {request.vin || 'No indicado'}</p>
                          <p>Millaje: {request.odometer || 'No indicado'}</p>
                          <p>Disponibilidad: {request.availability || 'No indicada'}</p>
                        </div>
                        <div className="admin-request-block">
                          <strong>Presupuesto</strong>
                          <p>{request.budget_range || 'No indicado'}</p>
                          <p>Solicitud: {request.request_date || 'Sin fecha de referencia'}</p>
                          <p>Seguimiento: {request.follow_up_date || 'Sin fecha programada'}</p>
                        </div>
                      </div>

                      <div className="admin-request-body">
                        <div className="admin-request-block">
                          <strong>Servicios marcados</strong>
                          <div className="service-pills admin-pills">
                            {(request.selected_services ?? []).map((service) => (
                              <span className="pill active" key={`${request.id}-${service}`}>
                                {service}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="admin-request-block">
                          <strong>Sintomas o servicio</strong>
                          <p>{request.issue_details || 'Sin detalle'}</p>
                        </div>
                        <div className="admin-request-block">
                          <strong>Objetivo</strong>
                          <p>{request.goals || 'Sin objetivo adicional'}</p>
                        </div>
                        <div className="admin-request-block">
                          <strong>Piezas o servicios de interes</strong>
                          <p>{request.request_items || 'Sin items listados'}</p>
                        </div>
                      </div>

                      <div className="admin-editor">
                        <div className="field-grid admin-editor-grid">
                          <label>
                            Estado
                            <select
                              value={draft.status}
                              onChange={(event) => updateDraftField(request.id, 'status', event.target.value)}
                            >
                              {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label>
                            Fecha de seguimiento
                            <input
                              type="date"
                              value={draft.followUpDate}
                              onChange={(event) => updateDraftField(request.id, 'followUpDate', event.target.value)}
                            />
                          </label>
                        </div>
                        <label>
                          Notas internas
                          <textarea
                            rows="4"
                            value={draft.internalNotes}
                            onChange={(event) => updateDraftField(request.id, 'internalNotes', event.target.value)}
                            placeholder="Llamar cliente, revisar disponibilidad de piezas, enviar cotizacion, etc."
                          />
                        </label>

                        <div className="admin-editor-actions">
                          <button
                            className="button button-primary"
                            type="button"
                            onClick={() => saveRequest(request.id)}
                            disabled={requestSaveState.state === 'saving'}
                          >
                            {requestSaveState.state === 'saving' ? 'Guardando...' : 'Guardar seguimiento'}
                          </button>
                          {requestSaveState.message ? (
                            <p
                              className={`submit-status submit-status-${
                                requestSaveState.state === 'error' ? 'error' : 'success'
                              }`}
                            >
                              {requestSaveState.message}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  )
                })}

                {!isLoadingRequests && filteredRequests.length === 0 ? (
                  <div className="work-order-card">
                    <h3>No hay solicitudes con ese filtro.</h3>
                    <p>Prueba otra busqueda o revisa si ya llegaron registros a `quote_requests`.</p>
                  </div>
                ) : null}
              </div>
            </section>

            <aside className="panel-section work-order-sidebar">
              <div className="sidebar-block">
                <p className="eyebrow">Sesion</p>
                <h2>{session.user.email}</h2>
                <p>Autenticado con Supabase Auth.</p>
              </div>
              <div className="sidebar-block">
                <p className="eyebrow">Capacidades</p>
                <h2>Seguimiento operativo</h2>
                <p>
                  Ya puedes mover estados, programar seguimiento y dejar notas internas por solicitud
                  sin salir del panel.
                </p>
              </div>
              <div className="sidebar-block">
                <p className="eyebrow">Acceso</p>
                <h2>/admin.html</h2>
                <p>Este panel usa Supabase Auth con email y contrasena para proteger lectura y edicion.</p>
              </div>
            </aside>
          </>
        )}
      </main>
    </div>
  )
}

export default AdminPage
