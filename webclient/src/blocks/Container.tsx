import { ReactNode } from 'react'

export interface ContainerProps {
  type:
    | 'primary'
    | 'secondary'
    | 'background'
    | 'light'
    | 'dark'
    | 'transparent'
  children: ReactNode
  id?: string
  xtra?: string
}
function Container({ type, children, id = '', xtra }: ContainerProps) {
  return (
    <div id={id} className={`n-box is-${type} ${xtra}`}>
      {children}
    </div>
  )
}
export default Container
