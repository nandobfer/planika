import * as yup from 'yup'

export const yup_validations = {
    password: yup.string().min(6, "A nova senha deve ter ao menos 6 caracteres.").required()
}