
type ButtonProps = {
    onButtonClicked: () => void;
    btnText: string;
    disabled?: boolean
  }

export const Button = (props: ButtonProps) => {
  const disabled = props.disabled || false
  const classNameNormal = "text-white rounded-md px-4 py-2 font-medium hover:bg-gray-700 bg-blue-600 hover:border-2 border-white"
  const classNameDisabled = "text-white rounded-md px-4 py-2 font-medium bg-gray-700 border-white"
  return <button disabled={disabled} className={disabled ? classNameDisabled : classNameNormal}
    onClick={props.onButtonClicked}>{props.btnText}</button>
}