import { NextResponse } from "next/server"
import { Resend } from "resend"

interface ContactFormData {
  name: string
  email: string
  company?: string
  service?: string
  budget?: string
  message: string
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

function buildEmailHtml(data: ContactFormData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0d1117; color: #e2e8f0; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 32px; }
    .header { background: linear-gradient(135deg, #e05a2b 0%, #c44a1e 100%); padding: 24px 32px; border-radius: 16px 16px 0 0; }
    .header h1 { color: #ffffff; margin: 0; font-size: 20px; font-weight: 700; }
    .header p { color: rgba(255,255,255,0.85); margin: 4px 0 0; font-size: 13px; }
    .body { background: #161b22; padding: 32px; border: 1px solid #21262d; border-top: none; border-radius: 0 0 16px 16px; }
    .field { margin-bottom: 20px; }
    .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #7d8590; margin-bottom: 6px; }
    .value { font-size: 15px; color: #e6edf3; line-height: 1.5; }
    .message-box { background: #0d1117; border: 1px solid #21262d; border-radius: 12px; padding: 16px; margin-top: 6px; }
    .footer { text-align: center; padding: 20px; color: #7d8590; font-size: 11px; }
    .badge { display: inline-block; background: rgba(224,90,43,0.15); color: #e05a2b; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Nuevo Mensaje de Contacto</h1>
      <p>Start By Global - Formulario Web</p>
    </div>
    <div class="body">
      <div class="field">
        <div class="label">Nombre</div>
        <div class="value">${escapeHtml(data.name)}</div>
      </div>
      <div class="field">
        <div class="label">Email</div>
        <div class="value"><a href="mailto:${escapeHtml(data.email)}" style="color:#e05a2b;text-decoration:none;">${escapeHtml(data.email)}</a></div>
      </div>
      ${data.company ? `<div class="field"><div class="label">Empresa</div><div class="value">${escapeHtml(data.company)}</div></div>` : ""}
      ${data.service ? `<div class="field"><div class="label">Servicio de Interes</div><div class="value"><span class="badge">${escapeHtml(data.service)}</span></div></div>` : ""}
      ${data.budget ? `<div class="field"><div class="label">Presupuesto Estimado</div><div class="value">${escapeHtml(data.budget)}</div></div>` : ""}
      <div class="field">
        <div class="label">Mensaje</div>
        <div class="message-box">
          <div class="value">${escapeHtml(data.message).replace(/\n/g, "<br>")}</div>
        </div>
      </div>
    </div>
    <div class="footer">
      Este mensaje fue enviado desde el formulario de contacto de startbyglobal.com
    </div>
  </div>
</body>
</html>`
}

function buildPlainText(data: ContactFormData): string {
  let text = `NUEVO MENSAJE DE CONTACTO - Start By Global\n${"=".repeat(50)}\n\n`
  text += `Nombre: ${data.name}\n`
  text += `Email: ${data.email}\n`
  if (data.company) text += `Empresa: ${data.company}\n`
  if (data.service) text += `Servicio: ${data.service}\n`
  if (data.budget) text += `Presupuesto: ${data.budget}\n`
  text += `\nMensaje:\n${"-".repeat(30)}\n${data.message}\n`
  return text
}

const serviceLabels: Record<string, string> = {
  web: "Desarrollo Web",
  seo: "SEO & Posicionamiento",
  marketing: "Marketing Digital",
  branding: "Branding & Diseno",
  analytics: "Analitica & Data",
  automation: "Automatizacion",
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, company, service, budget, message } = body as ContactFormData

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Los campos nombre, email y mensaje son obligatorios." },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "El formato del email no es valido." },
        { status: 400 }
      )
    }

    const resolvedService = service ? (serviceLabels[service] || service) : undefined

    const formData: ContactFormData = {
      name: name.trim(),
      email: email.trim(),
      company: company?.trim() || undefined,
      service: resolvedService,
      budget: budget?.trim() || undefined,
      message: message.trim(),
    }

    const htmlContent = buildEmailHtml(formData)
    const textContent = buildPlainText(formData)

    // Send via Resend if API key is available, otherwise via mailto fallback log
    const resendApiKey = process.env.RESEND_API_KEY

    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey)

        // Send to info@startbyglobal.com
        const { error: error1 } = await resend.emails.send({
          from: "Start By Global <onboarding@resend.dev>",
          to: ["info@startbyglobal.com"],
          replyTo: formData.email,
          subject: `Nuevo contacto: ${formData.name}${formData.company ? ` - ${formData.company}` : ""}`,
          html: htmlContent,
          text: textContent,
        })

        if (error1) {
          console.error("[Contact API] Resend error (info):", error1)
          return NextResponse.json(
            { error: "Error al enviar el email. Por favor intenta de nuevo." },
            { status: 500 }
          )
        }

        // Send copy to additional recipients
        const { error: error2 } = await resend.emails.send({
          from: "Start By Global <onboarding@resend.dev>",
          to: ["jhonesaa23@gmail.com"],
          cc: ["startbyglobal@gmail.com"],
          replyTo: formData.email,
          subject: `Nuevo contacto: ${formData.name}${formData.company ? ` - ${formData.company}` : ""}`,
          html: htmlContent,
          text: textContent,
        })

        if (error2) {
          console.error("[Contact API] Resend error (copy):", error2)
          // Don't fail the request if the copy fails, main email was sent
        }

        return NextResponse.json({ success: true, method: "resend" })
      } catch (err) {
        console.error("[Contact API] Resend exception:", err)
        return NextResponse.json(
          { error: "Error al enviar el email. Por favor intenta de nuevo." },
          { status: 500 }
        )
      }
    }

    // Fallback: Log the contact submission and return success
    // In production, configure RESEND_API_KEY for email delivery
    console.log("[Contact API] New submission (no RESEND_API_KEY configured):")
    console.log("[Contact API] To: info@startbyglobal.com")
    console.log("[Contact API] From:", formData.email)
    console.log("[Contact API] Name:", formData.name)
    console.log("[Contact API] Company:", formData.company || "N/A")
    console.log("[Contact API] Service:", formData.service || "N/A")
    console.log("[Contact API] Budget:", formData.budget || "N/A")
    console.log("[Contact API] Message:", formData.message)

    return NextResponse.json({
      success: true,
      method: "logged",
      note: "Configura RESEND_API_KEY para envio real de emails a info@startbyglobal.com",
    })
  } catch (error) {
    console.error("[Contact API] Unexpected error:", error)
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    )
  }
}
