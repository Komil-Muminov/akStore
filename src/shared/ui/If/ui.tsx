import type { ReactNode } from 'react'

type TChildren = ReactNode | (() => ReactNode)

interface IProps {
  condition: boolean
  children: TChildren
  fallback?: TChildren
}

const resolve = (node: TChildren): ReactNode => (typeof node === 'function' ? node() : node)

export const If = ({ condition, children, fallback = null }: IProps) => (
  <>{condition ? resolve(children) : resolve(fallback)}</>
)
