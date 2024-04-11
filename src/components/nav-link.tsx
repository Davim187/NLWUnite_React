import { ComponentProps } from "react";

interface Props extends ComponentProps<'a'>{
  text:string
}
export function NavLink(props:Props) {


  return (
    <a {...props} className="font-medium text-sm" >
     {props.text}
    </a>
  );
}
