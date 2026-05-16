import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@christianfuchs.de";
const FROM_NAME = process.env.RESEND_FROM_NAME || "Christian Fuchs";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@christianfuchs.de";

export async function sendNewPostNotification(
  email: string,
  postTitle: string,
  postSlug: string
) {
  const postUrl = `${SITE_URL}/blog/${postSlug}`;

  await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: email,
    subject: `Neuer Blogbeitrag: ${postTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family:-apple-system,BlinkMacSystemFont,Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px 16px;">
        <div style="border-bottom:2px solid #f97316;padding-bottom:16px;margin-bottom:24px;">
          <h1 style="font-size:20px;font-weight:700;color:#1e293b;margin:0;">Christian Fuchs</h1>
        </div>
        <h2 style="font-size:18px;color:#1e293b;">Neuer Blogbeitrag</h2>
        <p style="color:#475569;line-height:1.6;">Es gibt einen neuen Beitrag:</p>
        <div style="background:#f8fafc;border-radius:8px;padding:16px;margin:16px 0;">
          <strong style="font-size:16px;color:#1e293b;">${postTitle}</strong>
        </div>
        <a href="${postUrl}" style="display:inline-block;background:#f97316;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:500;">Beitrag lesen →</a>
        <p style="margin-top:24px;font-size:12px;color:#94a3b8;">
          Du erhältst diese E-Mail, weil du Benachrichtigungen abonniert hast.<br>
          <a href="${SITE_URL}/profile" style="color:#94a3b8;">Benachrichtigungen verwalten</a>
        </p>
      </body>
      </html>
    `,
  });
}

export async function sendNewCommentNotification(
  authorName: string,
  postTitle: string,
  commentContent: string,
  postSlug: string
) {
  const postUrl = `${SITE_URL}/blog/${postSlug}`;

  await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: ADMIN_EMAIL,
    subject: `Neuer Kommentar von ${authorName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family:-apple-system,BlinkMacSystemFont,Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px 16px;">
        <div style="border-bottom:2px solid #f97316;padding-bottom:16px;margin-bottom:24px;">
          <h1 style="font-size:20px;font-weight:700;color:#1e293b;margin:0;">Christian Fuchs</h1>
        </div>
        <h2 style="font-size:18px;color:#1e293b;">Neuer Kommentar</h2>
        <p style="color:#475569;line-height:1.6;">
          <strong>${authorName}</strong> hat zu "<em>${postTitle}</em>" kommentiert:
        </p>
        <div style="background:#f8fafc;border-left:4px solid #f97316;border-radius:4px;padding:16px;margin:16px 0;">
          <p style="color:#475569;line-height:1.6;margin:0;">${commentContent}</p>
        </div>
        <a href="${postUrl}" style="display:inline-block;background:#f97316;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:500;">Kommentar ansehen →</a>
      </body>
      </html>
    `,
  });
}

export async function sendCommentReplyNotification(
  email: string,
  postTitle: string,
  replyContent: string,
  postSlug: string
) {
  const postUrl = `${SITE_URL}/blog/${postSlug}`;

  await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: email,
    subject: `${FROM_NAME} hat auf deinen Kommentar geantwortet`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family:-apple-system,BlinkMacSystemFont,Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px 16px;">
        <div style="border-bottom:2px solid #f97316;padding-bottom:16px;margin-bottom:24px;">
          <h1 style="font-size:20px;font-weight:700;color:#1e293b;margin:0;">Christian Fuchs</h1>
        </div>
        <h2 style="font-size:18px;color:#1e293b;">Antwort auf deinen Kommentar</h2>
        <p style="color:#475569;line-height:1.6;">Christian hat auf deinen Kommentar zu "<em>${postTitle}</em>" geantwortet:</p>
        <div style="background:#f8fafc;border-left:4px solid #f97316;border-radius:4px;padding:16px;margin:16px 0;">
          <p style="color:#475569;line-height:1.6;margin:0;">${replyContent}</p>
        </div>
        <a href="${postUrl}" style="display:inline-block;background:#f97316;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:500;">Kommentare ansehen →</a>
      </body>
      </html>
    `,
  });
}
