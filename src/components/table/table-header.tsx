import { ComponentProps } from "react";
interface Props extends ComponentProps<"th"> {}

export function TableHeader(props: Props) {
  return <th className="py-3 px-4 text-sm font-semibold text-left">{props.children}</th>;
}
