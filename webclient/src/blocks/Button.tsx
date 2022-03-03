export interface ButtonProps {
  type: 'primary' | 'secondary' | 'action' | 'transparent' | 'dropdown'
  text: string
  handler: () => void
  xtra?: string
  disabled?: boolean
  icon?: string
}
function Button({ type, handler, text, xtra, disabled, icon }: ButtonProps) {
  return (
    <button
      className={`button is-${type} ${xtra}`}
      onClick={handler}
      disabled={disabled}
    >
      {text}
      {!!icon && <img src={icon} alt="icon" />}
    </button>
  )
}
export default Button
