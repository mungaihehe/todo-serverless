import { FC } from "react";

export const Input: FC<any> = ({ className, ...props }) => {
  return (
    <input
      className={className + " p-2 w-full bg-slate-600 text-slate-100"}
      {...props}
    />
  );
};
