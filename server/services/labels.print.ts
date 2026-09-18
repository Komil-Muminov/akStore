import { config } from '../config'
import type { IProduct } from '../types'
import { barcodeSvg } from './barcode.svg'

const TITLE = 'Ценники'
const CURRENCY = 'смн'
const UNIT_TITLES: Record<string, string> = { piece: 'шт', kilogram: 'кг' }

const STYLE = `
  @page { margin: 8mm; }
  body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; color: #000; }
  .sheet { display: flex; flex-wrap: wrap; gap: 4mm; }
  .label { width: 58mm; height: 40mm; border: 1px dashed #999; padding: 3mm; box-sizing: border-box;
           display: flex; flex-direction: column; justify-content: space-between; page-break-inside: avoid; }
  .shop { font-size: 9px; color: #555; }
  .name { font-size: 13px; font-weight: 700; line-height: 1.15; max-height: 32px; overflow: hidden; }
  .price { font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
  .unit { font-size: 10px; color: #555; }
  .code { display: flex; align-items: center; justify-content: space-between; gap: 4px; }
  .code svg { height: 32px; }
  .digits { font-size: 9px; color: #333; }`

const priceOf = (product: IProduct) => product.salePrice.toFixed(2)

const labelHtml = (product: IProduct) => `
  <div class="label">
    <div>
      <div class="shop">${config.shop.name}</div>
      <div class="name">${product.name}</div>
    </div>
    <div>
      <div class="price">${priceOf(product)} <span class="unit">${CURRENCY} / ${UNIT_TITLES[product.unit] ?? ''}</span></div>
    </div>
    <div class="code">
      ${product.barcode.length > 0 ? barcodeSvg(product.barcode) : ''}
      <div class="digits">${product.barcode}</div>
    </div>
  </div>`

export const labelsHtml = (products: IProduct[]) => `<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><title>${TITLE}</title><style>${STYLE}</style></head>
<body onload="window.print()">
  <div class="sheet">${products.map(labelHtml).join('')}</div>
</body></html>`
