const CLEAN_PATTERN = /[\s_.-]/g

const ALIASES: Record<string, string[]> = {
  barcode: ['штрихкод', 'штрих', 'barcode', 'ean', 'код'],
  name: ['название', 'наименование', 'товар', 'name', 'product'],
  category: ['категория', 'группа', 'category', 'group'],
  unit: ['единица', 'ед', 'едизм', 'unit'],
  costPrice: ['ценазакупки', 'закупка', 'себестоимость', 'cost', 'costprice'],
  salePrice: ['ценапродажи', 'цена', 'price', 'saleprice'],
  vatRate: ['ндс', 'ставкандс', 'vat', 'vatrate'],
  markCode: ['кодмаркировки', 'маркировка', 'mark', 'markcode'],
  stock: ['остаток', 'количество', 'колво', 'stock', 'quantity', 'qty'],
}

const normalize = (value: string) => value.trim().toLowerCase().replace(CLEAN_PATTERN, '')

export const fieldOf = (header: string) => {
  const cleaned = normalize(header)
  if (cleaned.length === 0) return null
  const found = Object.entries(ALIASES).find(([, aliases]) => aliases.includes(cleaned))
  return found ? found[0] : null
}

export const mapHeaders = (headers: string[]) => {
  const map = new Map<number, string>()
  headers.forEach((header, index) => {
    const field = fieldOf(header)
    if (field) map.set(index, field)
  })
  return map
}

export const TEMPLATE_HEADERS = [
  'Штрихкод',
  'Название',
  'Категория',
  'Единица',
  'Цена закупки',
  'Цена продажи',
  'НДС',
  'Код маркировки',
  'Остаток',
]

export const TEMPLATE_EXAMPLE = ['4600123456789', 'Чай зелёный', 'Напитки', 'шт', '8', '12.5', '14', '', '20']
