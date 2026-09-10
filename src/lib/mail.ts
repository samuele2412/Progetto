import 'server-only';
import nodemailer, { type Transporter } from 'nodemailer';
import { env, mailEnabled } from './env';

/**
 * Notification email. SMTP is optional on purpose: if it is not configured (or
 * the provider is down) the request is still stored and visible in the admin
 * panel. A lead must never be lost because a mail server hiccuped.
 */
let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (!mailEnabled) return null;
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASSWORD } : undefined,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
  });
  return transporter;
}

export type MailMessage = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
};

/** Never throws: mail failures are logged, not propagated to the visitor. */
export async function sendMail(message: MailMessage): Promise<{ sent: boolean; error?: string }> {
  const tx = getTransporter();
  if (!tx) return { sent: false, error: 'SMTP not configured' };

  try {
    await tx.sendMail({
      from: env.MAIL_FROM ?? env.SMTP_USER ?? 'no-reply@localhost',
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: message.html,
      replyTo: message.replyTo,
    });
    return { sent: true };
  } catch (error) {
    console.error('[mail] delivery failed:', error instanceof Error ? error.message : error);
    return { sent: false, error: error instanceof Error ? error.message : 'unknown error' };
  }
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Notification sent to the owner when a new request lands. */
export function buildOwnerNotification(input: {
  reference: string;
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  eventType: string;
  guests: string;
  area: string;
  packageName: string;
  serviceMode: string;
  preferences: string;
  message: string;
  source: string;
  adminUrl: string;
}): MailMessage {
  const rows: [string, string][] = [
    ['Riferimento', input.reference],
    ['Nome', input.name],
    ['Telefono', input.phone],
    ['Email', input.email],
    ['Data evento', input.eventDate],
    ['Tipo evento', input.eventType],
    ['Ospiti', input.guests],
    ['Zona', input.area],
    ['Pacchetto', input.packageName],
    ['Formula', input.serviceMode],
    ['Preferenze', input.preferences],
    ['Provenienza', input.source],
  ];

  const text = [
    `Nuova richiesta evento — ${input.reference}`,
    '',
    ...rows.map(([label, value]) => `${label}: ${value || '—'}`),
    '',
    'Note del cliente:',
    input.message || '—',
    '',
    `Apri nel pannello: ${input.adminUrl}`,
  ].join('\n');

  const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:600px">
      <h2 style="margin:0 0 4px">Nuova richiesta evento</h2>
      <p style="margin:0 0 20px;color:#666">Riferimento <strong>${escapeHtml(input.reference)}</strong></p>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        ${rows
          .map(
            ([label, value]) => `<tr>
              <td style="padding:6px 12px 6px 0;color:#666;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td>
              <td style="padding:6px 0"><strong>${escapeHtml(value || '—')}</strong></td>
            </tr>`,
          )
          .join('')}
      </table>
      ${
        input.message
          ? `<p style="margin:20px 0 4px;color:#666;font-size:14px">Note del cliente</p>
             <p style="margin:0;padding:12px;background:#f5f5f4;border-radius:8px;font-size:14px;white-space:pre-wrap">${escapeHtml(input.message)}</p>`
          : ''
      }
      <p style="margin:24px 0 0">
        <a href="${escapeHtml(input.adminUrl)}" style="background:#111;color:#fff;padding:10px 18px;border-radius:999px;text-decoration:none;font-size:14px">Apri nel pannello</a>
      </p>
    </div>`;

  return {
    to: env.NOTIFY_EMAIL ?? '',
    subject: `Nuova richiesta ${input.reference} — ${input.eventType} ${input.eventDate}`,
    text,
    html,
    replyTo: input.email,
  };
}

/** Acknowledgement sent to the client. Sets expectations, promises nothing. */
export function buildClientAcknowledgement(input: {
  to: string;
  name: string;
  reference: string;
  brandName: string;
  locale: 'it' | 'en';
  whatsappUrl: string;
}): MailMessage {
  const it = {
    subject: `Abbiamo ricevuto la tua richiesta — ${input.reference}`,
    body: [
      `Ciao ${input.name},`,
      '',
      `abbiamo ricevuto la tua richiesta (riferimento ${input.reference}).`,
      '',
      'Ti risponderemo personalmente, di solito entro 24 ore, con la formula consigliata e un prezzo chiuso. La disponibilità della data viene verificata a mano: nessun evento è confermato finché non ne parliamo.',
      '',
      `Se nel frattempo vuoi aggiungere qualcosa, rispondi a questa email o scrivici su WhatsApp: ${input.whatsappUrl}`,
      '',
      `A presto,`,
      input.brandName,
    ].join('\n'),
  };

  const en = {
    subject: `We received your request — ${input.reference}`,
    body: [
      `Hi ${input.name},`,
      '',
      `we have received your request (reference ${input.reference}).`,
      '',
      'We will reply personally, usually within 24 hours, with a recommended format and a fixed price. Availability is checked by hand: nothing is confirmed until we have spoken.',
      '',
      `If you want to add anything in the meantime, reply to this email or message us on WhatsApp: ${input.whatsappUrl}`,
      '',
      'Speak soon,',
      input.brandName,
    ].join('\n'),
  };

  const copy = input.locale === 'en' ? en : it;
  return {
    to: input.to,
    subject: copy.subject,
    text: copy.body,
    html: `<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:560px;font-size:15px;line-height:1.6;white-space:pre-wrap">${escapeHtml(copy.body)}</div>`,
  };
}
