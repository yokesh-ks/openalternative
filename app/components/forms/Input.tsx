import { InputHTMLAttributes, forwardRef } from "react"
import { VariantProps, cva, cx } from "~/utils/cva"

export const inputVariants = cva({
  base: "rounded-md border appearance-none px-3 py-2 text-[13px]/tight bg-background text-secondary font-medium placeholder:text-inherit placeholder:opacity-50 disabled:opacity-50",

  variants: {
    hoverable: {
      true: "bg-card enabled:cursor-pointer enabled:hover:bg-card-dark enabled:hover:border-border-dark",
    },
  },
})

export type InputProps = InputHTMLAttributes<HTMLInputElement> & VariantProps<typeof inputVariants>

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { className, hoverable, ...rest } = props

  return <input ref={ref} className={cx(inputVariants({ hoverable, className }))} {...rest} />
})

Input.displayName = "Input"
