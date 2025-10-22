import { numericFormatter } from "react-number-format"

interface Options {
    withoutAffix?: boolean
    percent?: boolean
    scaleDecimal?: number
}

export const currencyMask = (value: number | string, options?: Options) => {
    return numericFormatter(value.toString(), {
        decimalSeparator: ",",
        thousandSeparator: ".",
        prefix: options?.withoutAffix ? "" : "R$ ",
        suffix: options?.percent ? " %" : undefined,
        fixedDecimalScale: true,
        decimalScale: options?.scaleDecimal ? options.scaleDecimal : 2,
    })
}

export const numberMask = (value: number | string, decimalScale?: number) => {
    return numericFormatter(value.toString(), {
        decimalSeparator: ",",
        thousandSeparator: ".",
        fixedDecimalScale: !!decimalScale,
        decimalScale: decimalScale,
    })
}
