import type { Metadata } from "next"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: "Cómo Start By Global recopila, usa y protege tus datos personales conforme al RGPD.",
  alternates: { canonical: "/privacidad" },
}

export default function PrivacidadPage() {
  return (
    <DashboardLayout title="Política de Privacidad" subtitle="Última actualización: 13 de junio de 2026">
      <article className="glass-card rounded-xl p-6 sm:p-8 max-w-3xl space-y-6 legal-prose">
        <p className="text-sm text-muted-foreground leading-relaxed">
          En <strong className="text-foreground">START BY GLOBAL</strong> ("nosotros") nos tomamos en serio la
          privacidad de quienes visitan nuestro sitio y contactan con nosotros. Esta política explica qué datos
          personales tratamos, con qué finalidad y qué derechos tienes sobre ellos, conforme al Reglamento General de
          Protección de Datos (RGPD) y demás normativa aplicable.
        </p>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-foreground">1. Responsable del tratamiento</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            El responsable del tratamiento de tus datos es START BY GLOBAL, agencia de marketing digital con
            presencia en República Dominicana, España, Latinoamérica y EE.UU. Puedes contactarnos en{" "}
            <a href="mailto:info@startbyglobal.com" className="text-primary hover:underline">info@startbyglobal.com</a>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-foreground">2. Datos que recopilamos</h2>
          <ul className="list-disc pl-5 text-sm text-muted-foreground leading-relaxed space-y-1">
            <li><strong className="text-foreground">Datos de contacto</strong>: nombre, email, empresa y el mensaje que nos envías a través del formulario de contacto.</li>
            <li><strong className="text-foreground">Conversaciones del chat</strong>: el contenido que compartes con nuestro asistente virtual, y tu email si decides dejarlo.</li>
            <li><strong className="text-foreground">Datos de navegación</strong>: información técnica y de uso recopilada mediante cookies (ver nuestra <a href="/cookies" className="text-primary hover:underline">Política de Cookies</a>), siempre sujeta a tu consentimiento cuando es de analítica o marketing.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-foreground">3. Finalidad y base legal</h2>
          <ul className="list-disc pl-5 text-sm text-muted-foreground leading-relaxed space-y-1">
            <li>Atender tus solicitudes y consultas (base: tu consentimiento y/o medidas precontractuales).</li>
            <li>Enviarte propuestas comerciales relacionadas con los servicios que solicitas (base: consentimiento e interés legítimo).</li>
            <li>Medir y mejorar el rendimiento del sitio y nuestras campañas (base: tu consentimiento de cookies de analítica y marketing).</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-foreground">4. Destinatarios y encargados</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            No vendemos tus datos. Para prestar nuestros servicios trabajamos con proveedores que actúan como
            encargados del tratamiento, como servicios de envío de correo, alojamiento y base de datos, y
            herramientas de analítica y publicidad (por ejemplo Google, Meta y similares). Estos proveedores tratan
            los datos siguiendo nuestras instrucciones y con las debidas garantías, incluidas las transferencias
            internacionales cuando aplican.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-foreground">5. Conservación</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Conservamos tus datos durante el tiempo necesario para atender tu solicitud y cumplir con las
            obligaciones legales aplicables. Cuando ya no sean necesarios, los eliminamos o anonimizamos.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-foreground">6. Tus derechos</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad,
            así como retirar tu consentimiento en cualquier momento, escribiendo a{" "}
            <a href="mailto:info@startbyglobal.com" className="text-primary hover:underline">info@startbyglobal.com</a>.
            También puedes presentar una reclamación ante la autoridad de control competente.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-foreground">7. Cookies</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Utilizamos cookies propias y de terceros. Puedes configurar o retirar tu consentimiento en cualquier
            momento desde el enlace "Configurar cookies" del pie de página. Más información en nuestra{" "}
            <a href="/cookies" className="text-primary hover:underline">Política de Cookies</a>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-foreground">8. Cambios en esta política</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Podemos actualizar esta política para reflejar cambios legales o en nuestros servicios. Publicaremos la
            versión vigente en esta misma página con su fecha de actualización.
          </p>
        </section>
      </article>
      <Footer />
    </DashboardLayout>
  )
}
