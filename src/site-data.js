import {
  siAstonmartin,
  siAudi,
  siBentley,
  siBmw,
  siCitroen,
  siFerrari,
  siLamborghini,
  siMaserati,
  siMclaren,
  siMini,
  siPeugeot,
  siPorsche,
  siRenault,
  siSeat,
  siSkoda,
  siVolkswagen,
  siVolvo,
} from 'simple-icons'

export const serviceOptions = [
  {
    title: 'Diagnóstico computarizado',
    shortLabel: 'Diagnóstico',
    code: 'ECU',
    description: 'Localización de fallas electrónicas y mecánicas para autos europeos modernos.',
  },
  {
    title: 'Cambios de aceite',
    shortLabel: 'Aceite',
    code: 'OIL',
    description: 'Servicio preventivo con aceite, filtro y especificaciones correctas por plataforma.',
  },
  {
    title: 'Reparacion de fugas',
    shortLabel: 'Fugas',
    code: 'SEAL',
    description: 'Corrección de fugas de aceite, coolant y otros fluidos antes de daños mayores.',
  },
  {
    title: 'Bateria y sistema de carga',
    shortLabel: 'Bateria',
    code: '12V',
    description: 'Pruebas, reemplazo y revision del sistema de carga para voltaje estable.',
  },
  {
    title: 'Servicio de frenos',
    shortLabel: 'Frenos',
    code: 'BRK',
    description: 'Pastillas, discos, sensores y servicio completo para seguridad y control.',
  },
  {
    title: 'Bujias e ignicion',
    shortLabel: 'Bujias',
    code: 'IGN',
    description: 'Mantenimiento de encendido para recuperar suavidad, respuesta y eficiencia.',
  },
  {
    title: 'Suspensión y dirección',
    shortLabel: 'Suspension',
    code: 'SUS',
    description: 'Inspeccion y reemplazo de componentes de chasis para mejor manejo.',
  },
  {
    title: 'Sistema de enfriamiento',
    shortLabel: 'Enfriamiento',
    code: 'COOL',
    description: 'Diagnóstico por sobrecalentamiento, bombas, mangueras y fugas.',
  },
  {
    title: 'Servicio de admision',
    shortLabel: 'Admision',
    code: 'AIR',
    description: 'Filtro de aire y componentes de admision para flujo y rendimiento constante.',
  },
  {
    title: 'Diagnostico del sistema de aire acondicionado',
    shortLabel: 'A/C',
    code: 'AC',
    description: 'Diagnostico del sistema de aire acondicionado y revision de sus componentes.',
  },
  {
    title: 'Garantias y devoluciones',
    shortLabel: 'Garantia',
    code: 'RMA',
    description: 'Apoyo en verificación de piezas, garantías y devoluciones cuando aplica.',
  },
  {
    title: 'Aplicaciones performance',
    shortLabel: 'Performance',
    code: 'TUNE',
    description: 'Instalaciones y soporte para proyectos más allá de stock.',
  },
]

export const featuredServices = [
  serviceOptions[0],
  serviceOptions[1],
  serviceOptions[2],
  serviceOptions[4],
  serviceOptions[6],
  serviceOptions[7],
  serviceOptions[9],
  serviceOptions[11],
]

export const makes = [
  { name: 'Volkswagen', icon: siVolkswagen, logoSrc: '/48705-Sticker-VW-Logo-2019-Volkswagen.webp' },
  { name: 'Audi', icon: siAudi, logoSrc: '/Audi-logo-r9rxyonrkaga9x0m50vsyd1tl53kpdhhc30a5qj0po.webp' },
  { name: 'Porsche', icon: siPorsche, logoSrc: '/porsche-logo-png_seeklogo-399884.webp' },
  { name: 'BMW', icon: siBmw, logoSrc: '/BMW.svg' },
  { name: 'MINI', icon: siMini, logoSrc: '/P90188506-the-new-mini-logo-06-2015-1500px-1024x450.webp' },
  { name: 'Mercedes-Benz', label: 'Mercedes-Benz', logoSrc: '/Mercedes-Logo.svg-1024x1024.webp' },
  { name: 'Volvo', icon: siVolvo, logoSrc: '/volvo-logo-png_seeklogo-150600.webp' },
  { name: 'Jaguar', label: 'Jaguar', logoSrc: '/Jaguar-Logo-2021-1024x576.webp' },
  { name: 'Bentley', icon: siBentley, logoSrc: '/bentley-logo-2002-black-download-1024x572.webp' },
  { name: 'Ferrari', icon: siFerrari, logoSrc: '/ferrari-logo-1947-2002-scaled-1-1024x742.webp' },
  { name: 'Fiat', label: 'Fiat', logoSrc: '/Fiat_logo.svg.webp' },
  { name: 'Land Rover', label: 'Land Rover', logoSrc: '/LandRover.svg-1024x538.webp' },
  { name: 'Lamborghini', icon: siLamborghini, logoSrc: '/pngimg.com-lamborghini_PNG10709-910x1024.webp' },
  { name: 'Aston Martin', icon: siAstonmartin },
  { name: 'Maserati', icon: siMaserati },
  { name: 'Peugeot', icon: siPeugeot },
  { name: 'Renault', icon: siRenault },
  { name: 'Citroen', icon: siCitroen },
  { name: 'Skoda', icon: siSkoda },
  { name: 'McLaren', icon: siMclaren },
]

export const highlights = [
  {
    value: '28+ años',
    label: 'Experiencia en piezas, mantenimiento y performance para autos europeos en Puerto Rico.',
  },
  {
    value: '787-277-9490',
    label: 'Llama o escribe para cotizaciones, citas y seguimiento.',
  },
  {
    value: 'Lun - Vie',
    label: '9:00 a.m - 5:00 p.m en 1004 Ave Jesús T. Piñero, San Juan.',
  },
]

export const partners = [
  'ECS Tuning',
  'Integrated Engineering',
  'SSF Imported Auto Parts',
  'IMC Parts Authority',
  'North Side Imports',
  'Liqui Moly',
]

export const shopGallery = [
  {
    src: '/Euro-Parts-EPE-LLC2-1024x478.webp',
    alt: 'Fachada de Euro Parts Engineering en San Juan',
  },
  {
    src: '/Euro-Parts-EPE-LLC3-1-768x359.webp',
    alt: 'Vehículos europeos estacionados frente al taller',
  },
  {
    src: '/Euro-Parts-EPE-LLC4-768x359.webp',
    alt: 'Línea de vehículos de clientes en Euro Parts Engineering',
  },
  {
    src: '/Euro-Parts-EPE-LLC10-768x359.webp',
    alt: 'Exterior del taller e identidad de Euro Parts Engineering',
  },
  {
    src: '/Euro-Parts-EPE-LLC11-768x359.webp',
    alt: 'Vehículos europeos de lujo y performance atendidos por el taller',
  },
  {
    src: '/Euro-Parts-EPE-LLC14-768x359.webp',
    alt: 'Vehículos y ambiente del taller en Euro Parts Engineering',
  },
  {
    src: '/WhatsApp Image 2026-03-16 at 3.37.53 PM (1).webp',
    alt: 'Vehículo europeo recibiendo servicio dentro del taller EPE',
  },
  {
    src: '/WhatsApp Image 2026-03-16 at 3.37.54 PM.webp',
    alt: 'Trabajo detallado en el compartimiento del motor',
  },
  {
    src: '/WhatsApp Image 2026-03-16 at 3.37.55 PM.webp',
    alt: 'Preparación de motor turbo y configuración performance',
  },
  {
    src: '/WhatsApp Image 2026-03-16 at 3.37.56 PM.webp',
    alt: 'Trabajo mecánico de cerca sobre un motor europeo',
  },
  {
    src: '/WhatsApp Image 2026-03-16 at 3.37.56 PM (1).webp',
    alt: 'Trabajo de reparación y tuning en progreso',
  },
  {
    src: '/WhatsApp Image 2026-03-16 at 3.38.16 PM.webp',
    alt: 'Técnico trabajando un wagon europeo dentro del taller',
  },
]

export const bannerStories = [
  {
    eyebrow: 'Presencia EPE',
    title: 'Recepción, inventario y atención especializada para autos europeos en Puerto Rico.',
    description: 'Cada visita al taller combina trato directo, piezas correctas y una operación enfocada en servicio europeo.',
    variant: 'blue',
    images: shopGallery.slice(0, 4),
  },
  {
    eyebrow: 'Trabajo especializado',
    title: 'Diagnóstico preciso, mantenimiento preventivo y reparaciones con criterio técnico.',
    description: 'Desde servicio diario hasta trabajos más exigentes, cada caso se maneja con enfoque en confiabilidad y rendimiento.',
    variant: 'red',
    images: shopGallery.slice(4, 8),
  },
  {
    eyebrow: 'Performance real',
    title: 'Motores, preparaciones y upgrades respaldados por experiencia en proyectos performance.',
    description: 'EPE integra piezas, instalación y soporte para clientes que buscan mejor respuesta, potencia y atención experta.',
    variant: 'orange',
    images: shopGallery.slice(8, 12),
  },
]

export const tuningHighlights = [
  {
    title: 'Distribuidores exclusivos de APR Puerto Rico',
    description: 'Hardware, calibración y apoyo para proyectos de alto rendimiento.',
    image: '/automotive-racing-products-arp-logo-png_seeklogo-343247.webp',
    alt: 'Logo de Automotive Racing Products',
    logoMode: true,
  },
  {
    title: 'Instaladores certificados de EVOMS (Evolution Motorsport)',
    description: 'Integración de componentes respaldados por marcas performance.',
    image: '/evoms-evolution-motorsports.webp',
    alt: 'Logo de EVOMS Evolution Motorsports',
    logoMode: true,
  },
  {
    title: 'Dealer oficial de VW Racingline UK',
    description: 'Red de marcas, piezas y soluciones para plataformas europeas.',
    image: '/653f35_e321e98544d54198afe55e18d174d9a7mv2.webp',
    alt: 'Logo de RacingLine',
    logoMode: true,
  },
]

export const maintenanceHighlights = [
  {
    title: 'Cambios de aceite con Liqui Moly',
    description: 'Mantenimiento preventivo con fluidos, filtros y especificaciones correctas.',
    icon: 'oil',
  },
  {
    title: 'Reemplazo de frenos, suspensión y dirección',
    description: 'Componentes de seguridad y chasis para mejor control y calidad de manejo.',
    icon: 'suspension',
  },
  {
    title: 'Diagnóstico computarizado de última generación',
    description: 'Lectura avanzada y localización de fallas para sistemas electrónicos y mecánicos.',
    icon: 'diagnostic',
  },
]

export const whyChooseCards = [
  {
    title: 'Líderes en piezas para carros europeos en Puerto Rico',
    body: 'Inventario, sourcing y criterio técnico para encontrar la pieza correcta.',
    icon: 'parts',
  },
  {
    title: 'Más de 28 años de experiencia',
    body: 'Miles de clientes atendidos y soluciones para múltiples plataformas europeas.',
    icon: 'check',
  },
  {
    title: 'Soporte experto para marcas europeas',
    body: 'Servicio enfocado en plataformas premium, alemanas y performance.',
    icon: 'support',
  },
]
