export const handleCurrencyInput = (inputed: string, decimalScale: number = 2) => {
    const digits = inputed.replace(/\D/g, "")

    if (!digits) return "0"

    // Pad with zeros if needed to have at least decimalScale + 1 digits
    const paddedDigits = digits.padStart(decimalScale + 1, "0")

    // Split into integer and decimal parts
    const integerPart = paddedDigits.slice(0, -decimalScale) || "0"
    const decimalPart = paddedDigits.slice(-decimalScale)

    // Remove leading zeros from integer part, but keep at least one zero
    const cleanedInteger = integerPart.replace(/^0+/, "") || "0"

    return `${cleanedInteger}.${decimalPart}`
}
