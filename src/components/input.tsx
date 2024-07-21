import { Dispatch, FC, SetStateAction } from "react";

interface InputProps {
  label: string;
  placeholder: string;
  inputType: string;
  onChange: Dispatch<SetStateAction<string>>;
  value: string;
  error?: string;
}

export const Input: FC<InputProps> = ({
  label,
  placeholder,
  inputType,
  onChange,
  value,
  error,
}) => {
  return (
    <div className="mb-[32px] flex flex-col md:w-[456px]">
      <label className="mb-[7px] text-[16px] capitalize" htmlFor={label}>
        {label}
      </label>
      <input
        required
        onChange={(e) => {
          onChange(e.target.value);
        }}
        className="h-[48px] w-[auto] rounded-[6px] border border-dull-border pl-2 font-normal placeholder:text-dull-text"
        name={label}
        type={inputType}
        placeholder={placeholder}
        value={value}
      />
      {error ? (
        <span className="mt-2 text-sm font-medium text-red-400"> {error}</span>
      ) : (
        <></>
      )}
    </div>
  );
};
