import { notFound } from 'next/navigation'

// Unknown URLs land here (the proxy rewrites every path under a locale), so they get the
// styled [locale]/not-found page inside the site layout instead of Next's bare default 404.
export default function CatchAll() {
  notFound()
}
