"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface InputOTPContextType {
  value: string
  maxLength: number
  onChange?: (value: string) => void
  disabled?: boolean
}

const InputOTPContext = React.createContext<InputOTPContextType>({
  value: "",
  maxLength: 6,
})

export interface InputOTPProps
  extends Omit<React.ComponentProps<"div">, "onChange"> {
  maxLength?: number
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  autoFocus?: boolean
}

export function InputOTP({
  maxLength = 6,
  value = "",
  onChange,
  disabled = false,
  autoFocus = false,
  className,
  children,
  ...props
}: InputOTPProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, "").slice(0, maxLength)
    onChange?.(rawVal)
  }

  return (
    <InputOTPContext.Provider value={{ value, maxLength, onChange, disabled }}>
      <div
        className={cn("relative inline-flex items-center select-none justify-center", className)}
        onClick={() => inputRef.current?.focus()}
        {...props}
      >
        <input
          ref={inputRef}
          type="password"
          inputMode="numeric"
          pattern="\d*"
          maxLength={maxLength}
          value={value}
          onChange={handleInputChange}
          disabled={disabled}
          className="absolute inset-0 opacity-0 cursor-pointer pointer-events-auto"
          aria-label="OTP input"
        />
        {children}
      </div>
    </InputOTPContext.Provider>
  )
}

export function InputOTPGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
}

export interface InputOTPSlotProps extends React.ComponentProps<"div"> {
  index: number
}

export function InputOTPSlot({
  index,
  className,
  ...props
}: InputOTPSlotProps) {
  const { value, disabled } = React.useContext(InputOTPContext)
  const char = value[index] || ""
  const isFocused = value.length === index

  return (
    <div
      data-slot="input-otp-slot"
      className={cn(
        "relative flex h-14 w-12 items-center justify-center border border-input text-xl font-bold rounded-lg bg-white shadow-2xs transition-all",
        isFocused && "ring-2 ring-emerald-500 border-emerald-500",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {char ? "•" : ""}
      {isFocused && !char && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-5 w-0.5 animate-pulse bg-emerald-600 duration-1000" />
        </div>
      )}
    </div>
  )
}
