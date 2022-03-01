export interface ButtonProps {
  type: 'primary' | 'secondary' | 'action' | 'transparent'
  text: string
  handler: () => void
  xtraClass?: string
  disabled?: boolean
}
function Button({ type, handler, text, xtraClass, disabled }: ButtonProps) {
  return (
    <button
      className={`button is-${type} ${xtraClass}`}
      onClick={handler}
      disabled={disabled}
    >
      {text}
    </button>
  )
}
export default Button
