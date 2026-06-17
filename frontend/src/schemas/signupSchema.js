import * as yup from 'yup'

export const getSignupValidationSchema = (t) => yup.object().shape({
  username: yup
    .string()
    .required(t('signup.errors.required'))
    .min(3, t('signup.errors.usernameLength'))
    .max(20, t('signup.errors.usernameLength')),
  password: yup
    .string()
    .required(t('signup.errors.required'))
    .min(6, t('signup.errors.passwordLength')),
  confirmPassword: yup
    .string()
    .required(t('signup.errors.required'))
    .oneOf([yup.ref('password'), null], t('signup.errors.passwordMismatch')),
})