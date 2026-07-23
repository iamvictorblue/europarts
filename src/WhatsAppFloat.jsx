import { siWhatsapp } from 'simple-icons'

export const whatsappNumber = '17872779490'

export function whatsappUrl(message) {
  const base = `https://wa.me/${whatsappNumber}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export function WhatsAppIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
      dangerouslySetInnerHTML={{ __html: `<path d="${siWhatsapp.path}" />` }}
    />
  )
}

function WhatsAppFloat({ message }) {
  return (
    <a
      className="whatsapp-float"
      href={whatsappUrl(message)}
      target="_blank"
      rel="noreferrer"
      aria-label="Escríbenos por WhatsApp"
      title="Escríbenos por WhatsApp"
    >
      <WhatsAppIcon />
    </a>
  )
}

export default WhatsAppFloat
