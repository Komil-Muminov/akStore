import QRCode from 'qrcode'
import type { IPass } from '../types'

const LOCALE = 'ru-RU'
const TITLE = 'ПРОПУСК'
const SUBTITLE = 'Разовый пропуск на территорию'
const ISSUED_LABEL = 'Выдан'
const SIGN_LABEL = 'Подпись ответственного'
const GUARD_LABEL = 'Отметка охраны'
const QR_HINT = 'Предъявите код на проходной'

const FIELDS: { label: string; valueOf: (pass: IPass) => string }[] = [
  { label: 'Посетитель', valueOf: (pass) => pass.holderName },
  { label: 'Организация', valueOf: (pass) => pass.organization },
  { label: 'К кому', valueOf: (pass) => pass.hostName },
  { label: 'Цель визита', valueOf: (pass) => pass.purpose },
  { label: 'Телефон', valueOf: (pass) => pass.phone },
  { label: 'Автомобиль', valueOf: (pass) => pass.carPlate },
]

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

const dateOf = (iso: string) => new Date(iso).toLocaleString(LOCALE, { dateStyle: 'long', timeStyle: 'short' })

const rowsOf = (pass: IPass) =>
  FIELDS.filter((field) => field.valueOf(pass).trim().length > 0)
    .map(
      (field) =>
        `<tr><td class="label">${escapeHtml(field.label)}</td><td class="value">${escapeHtml(field.valueOf(pass))}</td></tr>`,
    )
    .join('')

const STYLES = `
  * { box-sizing: border-box; }
  body { margin: 0; padding: 24px; font-family: "Segoe UI", Arial, sans-serif; color: #111; background: #fff; }
  .sheet { width: 148mm; border: 1px solid #111; padding: 16px 20px; }
  .head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
  h1 { font-size: 22px; margin: 0; letter-spacing: 4px; }
  .subtitle { font-size: 12px; color: #555; margin-top: 4px; }
  .code { font-size: 18px; font-weight: 700; margin-top: 12px; font-family: "Consolas", monospace; }
  .qr { width: 104px; flex-shrink: 0; text-align: center; }
  .qr svg { width: 104px; height: 104px; }
  .qr-hint { font-size: 9px; color: #666; margin-top: 4px; }
  table { width: 100%; border-collapse: collapse; margin-top: 16px; }
  td { padding: 6px 0; vertical-align: top; font-size: 13px; border-bottom: 1px dotted #bbb; }
  .label { width: 38%; color: #555; }
  .value { font-weight: 600; }
  .issued { margin-top: 14px; font-size: 12px; color: #555; }
  .signs { display: flex; gap: 24px; margin-top: 28px; }
  .sign { flex: 1; font-size: 11px; color: #555; }
  .line { border-bottom: 1px solid #111; height: 28px; margin-bottom: 4px; }
  @media print { body { padding: 0; } .sheet { border: none; } }
`

export const renderPassSheet = async (pass: IPass) => {
  const qr = await QRCode.toString(pass.code, { type: 'svg', margin: 0 })
  return `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(TITLE)} ${escapeHtml(pass.code)}</title>
    <style>${STYLES}</style>
  </head>
  <body onload="window.print()">
    <div class="sheet">
      <div class="head">
        <div>
          <h1>${TITLE}</h1>
          <div class="subtitle">${SUBTITLE}</div>
          <div class="code">${escapeHtml(pass.code)}</div>
        </div>
        <div class="qr">${qr}<div class="qr-hint">${QR_HINT}</div></div>
      </div>
      <table>${rowsOf(pass)}</table>
      <div class="issued">${ISSUED_LABEL}: ${escapeHtml(dateOf(pass.createdAt))}</div>
      <div class="signs">
        <div class="sign"><div class="line"></div>${SIGN_LABEL}</div>
        <div class="sign"><div class="line"></div>${GUARD_LABEL}</div>
      </div>
    </div>
  </body>
</html>`
}
