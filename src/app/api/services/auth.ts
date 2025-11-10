import {
  mockUserService,
  mockPasswordService,
  mockResetCodeService
} from '@/utils'

type Credentials = {
  email: string
  password: string
}

type RegisterFormData = Credentials & {
  name: string
}

type LoginFormData = Credentials

type ResetPasswordRequest = {
  email: string
  resetCode: string
  newPassword: string
}

const generateMockToken = (
  email: string,
  name: string,
  role: string,
  id?: number
): string => {
  const payload = {
    id: id || 0,
    email,
    name,
    role,
    exp: Math.floor(Date.now() / 1000) + 3600
  }

  return btoa(JSON.stringify(payload))
}

const generateMockRefreshToken = (): string =>
  btoa(
    JSON.stringify({
      refresh: true,
      exp: Math.floor(Date.now() / 1000) + 604800
    })
  )

export const registerUser = async (formData: RegisterFormData) => {
  const existingUser = mockUserService.getUserByEmail(formData.email)

  if (existingUser) throw new Error('userExists')

  const newUser = mockUserService.createUser({
    email: formData.email,
    name: formData.name,
    roleId: 2
  })

  mockPasswordService.setPassword(formData.email, formData.password)

  const accessToken = generateMockToken(
    formData.email,
    formData.name,
    'User',
    newUser.id
  )

  const refreshToken = generateMockRefreshToken()

  return { accessToken, refreshToken }
}

export const loginUser = async (formData: LoginFormData) => {
  const user = mockUserService.getUserByEmail(formData.email)

  if (!user) throw new Error('passwordIncorrect')

  const isValidPassword = mockPasswordService.validatePassword(
    formData.email,
    formData.password
  )

  if (!isValidPassword) throw new Error('passwordIncorrect')

  const role = user.roleId === 1 ? 'Admin' : 'User'
  const accessToken = generateMockToken(
    user.email || '',
    user.name || '',
    role,
    user.id
  )

  const refreshToken = generateMockRefreshToken()

  return { accessToken, refreshToken }
}

export const fetchNewToken = async () => generateMockToken('', '', 'User')

export const forgotPassword = async (email: string) => {
  const user = mockUserService.getUserByEmail(email)

  if (!user) {
    mockResetCodeService.generateResetCode(email)
    return 'passwordResetEmailSent'
  }

  mockResetCodeService.generateResetCode(email)

  return 'passwordResetEmailSent'
}

export const resetPassword = async (request: ResetPasswordRequest) => {
  const isValidCode = mockResetCodeService.validateResetCode(
    request.email,
    request.resetCode
  )

  if (!isValidCode) throw new Error('invalidResetCode')

  mockPasswordService.updatePassword(request.email, request.newPassword)
  mockResetCodeService.clearResetCode(request.email)

  return 'passwordResetSuccess'
}
