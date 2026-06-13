import type { Metadata } from "next"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Footer } from "@/components/footer"
import { CookiePrefsButton } from "@/components/cookie-prefs-button"

export const metadata: Metadata = {
  title: "Política de Cookies",
  description: "Qué cookies usa Start By Global, con qué finalidad y cómo gestionar tu consentimiento.",
  alternates: { canonical: "/cookies" },
}

const COOKIE_TABLE: Array<{ cat: string; cookies: string; purpose: string }> = [
  { cat: "Necesarias", cookies: "sbg_consent, sbg_region", purpose: "Recuerdan tu decisión sobre cookies y tu región. Imprescindibles; no requieren consentimiento." },
  { cat: "Analítica", cookies: "_ga, _ga_*, _gid, _clck, _clsk", purpose: "Google Analytics / Tag Manager y Microsoft Clarity: medir el uso del sitio de forma agregada." },
  { cat: "Marketing", cookies: "_fbp, _fbc, sbg_attribution, cookies de TikTok", purpose: "Meta Pixel y TikTok para medir campañas; atribución de la fuente de la visita (orgánico/ads)." },
]

export default function CookiesPage() {
  return (
    <DashboardLayout title="Política de Cookies" subtitle="Última actualización: 13 de junio de 2026">
      <article className="glass-card rounded-xl p-6 sm:p-8 max-w-3xl space-y-6">
        <p className="text-sm text-muted-foreground leading-relaxed">
          <strong className="text-foreground">START BY GLOBAL</strong> utiliza cookies propias y de terceros para
          el funcionamiento del sitio, analizar su uso y medir nuestras campañas. Las cookies de analítica y
          marketing solo se activan con tu consentimiento.
        </p>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-foreground">¿Qué son las cookies?</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Son pequeños archivos que se almacenan en tu dispositivo al visitar un sitio web y permiten recordar
            información sobre tu visita, como tus preferencias o datos de uso.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-lg font-bold text-foreground">Cookies que utilizamos</h2>
          <div className="overflow-x-auto rounded-lg border border-border/50">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/30 border-b border-border/50">
                  {["Categoría", "Cookies", "Finalidad"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COOKIE_TABLE.map((r) => (
                  <tr key={r.cat} className="border-b border-border/30 align-top">
                    <td className="px-4 py-3 text-foreground font-medium whitespace-nowrap">{r.cat}</td>
                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{r.cookies}</td>
                    <td className="px-4 py-3 text-muted-foreground leading-relaxed">{r.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-foreground">Gestión del consentimiento</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Puedes aceptar, rechazar o personalizar las cookies en cualquier momento. Para los visitantes desde la
            Unión Europea y el Espacio Económico Europeo, las cookies de analítica y marketing permanecen
            desactivadas hasta que prestas tu consentimiento.
          </p>
          <CookiePrefsButton />
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-foreground">Cookies de terceros</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Algunas cookies son gestionadas por terceros (Google, Meta, TikTok, Microsoft) conforme a sus propias
            políticas de privacidad. Te recomendamos consultarlas para conocer cómo tratan tu información.
          </p>
        </section>
      </article>
      <Footer />
    </DashboardLayout>
  )
}
