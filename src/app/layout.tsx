/**
 * Root layout for Next.js App Router.
 *
 * Both route groups in this app — `(payload)` and `(web)` — render their own
 * complete `<html>`/`<body>` shells (Payload's admin UI needs full control, and
 * the public site has its own font/meta setup). This top-level layout must
 * exist, but it must NOT also emit `<html>` or it would produce nested
 * document tags. It simply passes children through.
 */
export const metadata = {
  title: 'Wipe That Record',
  description: 'California criminal record expungement services.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
