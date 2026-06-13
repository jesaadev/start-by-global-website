import type { Metadata } from "next"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Aviso Legal",
  description: "Condiciones generales de uso del sitio web de Start By Global.",
  alternates: { canonical: "/aviso-legal" },
}

export default function AvisoLegalPage() {
  return (
    <DashboardLayout title="Aviso Legal" subtitle="Última actualización: 13 de junio de 2026">
      <article className="glass-card rounded-xl p-6 sm:p-8 max-w-3xl space-y-6">
        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-foreground">1. Titular del sitio</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Este sitio web es operado por <strong className="text-foreground">START BY GLOBAL</strong>, agencia de
            marketing digital con presencia en República Dominicana, España, Latinoamérica y EE.UU. Para cualquier
            comunicación puedes escribir a{" "}
            <a href="mailto:info@startbyglobal.com" className="text-primary hover:underline">info@startbyglobal.com</a>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-foreground">2. Objeto</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            El presente aviso regula el uso del sitio web de START BY GLOBAL, cuya finalidad es ofrecer información
            sobre nuestros servicios de desarrollo web, marketing digital, SEO, branding, analítica y automatización,
            así como facilitar el contacto con clientes potenciales.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-foreground">3. Condiciones de uso</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            El usuario se compromete a hacer un uso adecuado y lícito del sitio y de sus contenidos, absteniéndose
            de emplearlos con fines ilícitos o que puedan dañar, inutilizar o sobrecargar el sitio, o impedir su
            normal utilización por parte de otros usuarios.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-foreground">4. Propiedad intelectual</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Los contenidos del sitio (textos, diseños, logotipos, gráficos y código) son titularidad de START BY
            GLOBAL o de sus licenciantes y están protegidos por la normativa de propiedad intelectual e industrial.
            Queda prohibida su reproducción, distribución o transformación sin autorización expresa.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-foreground">5. Responsabilidad</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            START BY GLOBAL procura que la información del sitio sea correcta y esté actualizada, pero no garantiza
            la ausencia de errores ni la disponibilidad ininterrumpida del servicio. No nos hacemos responsables de
            los daños derivados del uso del sitio ni de los contenidos de sitios de terceros enlazados.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-foreground">6. Protección de datos y cookies</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            El tratamiento de datos personales se rige por nuestra{" "}
            <a href="/privacidad" className="text-primary hover:underline">Política de Privacidad</a> y el uso de
            cookies por nuestra{" "}
            <a href="/cookies" className="text-primary hover:underline">Política de Cookies</a>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-foreground">7. Legislación aplicable</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Las presentes condiciones se rigen por la legislación aplicable en las jurisdicciones donde START BY
            GLOBAL presta sus servicios. Cualquier controversia se someterá a los tribunales competentes conforme a
            la normativa vigente.
          </p>
        </section>
      </article>
      <Footer />
    </DashboardLayout>
  )
}
