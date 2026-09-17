import type { IProduct } from '@/entities/product'
import { unitLabelOf } from '@/entities/product'
import type { ICartLine } from '@/entities/sale'

export const addToCart = (lines: ICartLine[], product: IProduct): ICartLine[] => {
  const existing = lines.find((line) => line.productId === product.id)
  if (!existing) {
    return [
      ...lines,
      {
        productId: product.id,
        name: product.name,
        unit: unitLabelOf(product.unit),
        price: product.salePrice,
        quantity: 1,
        stock: product.stock,
        vatRate: product.vatRate,
      },
    ]
  }
  return lines.map((line) =>
    line.productId === product.id
      ? { ...line, quantity: Math.min(line.quantity + 1, line.stock) }
      : line,
  )
}

export const changeQuantity = (lines: ICartLine[], productId: string, quantity: number): ICartLine[] =>
  lines
    .map((line) =>
      line.productId === productId ? { ...line, quantity: Math.min(Math.max(quantity, 0), line.stock) } : line,
    )
    .filter((line) => line.quantity > 0)
