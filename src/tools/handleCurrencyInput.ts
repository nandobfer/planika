export const handleCurrencyInput = (inputed: string, decimalScale: number = 2) => {
    // Remove all non-digit characters to get just the digits
    const digits = inputed.replace(/\D/g, "")

    // If empty or all zeros, return formatted zero
    if (!digits) {
        return "0." + "0".repeat(decimalScale)
    }

    // Don't remove leading zeros - we need to keep the digit sequence as-is
    // Just pad if needed to ensure we have enough digits for decimal places
    const paddedDigits = digits.padStart(decimalScale + 1, "0")

    // Split into integer and decimal parts
    const integerPart = paddedDigits.slice(0, -decimalScale)
    const decimalPart = paddedDigits.slice(-decimalScale)

    // Remove leading zeros from integer part only, but keep at least one zero
    const cleanedInteger = integerPart.replace(/^0+/, "") || "0"

    return `${cleanedInteger}.${decimalPart}`
}
