
type ButtonProps = {
    onButtonClicked: () => void;
    btnText: string;
  }

export const Button = (props: ButtonProps) => {
  return <button className="text-white rounded-md px-4 py-2 font-medium hover:bg-gray-700 bg-blue-600 hover:border-2 border-white"
    onClick={props.onButtonClicked}>{props.btnText}</button>
}