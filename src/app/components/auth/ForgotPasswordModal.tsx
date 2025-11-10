'use client'

import { useTranslations } from 'next-intl'
import Image from 'next/image'

import { FormEvent, useState } from 'react'

import { z } from 'zod'

import { Input, Snackbar } from '@/components/ui'
import { SubmitButton } from '@/components/buttons'

import { useForm } from '@/hooks'

import { useMutation } from '@tanstack/react-query'

import { forgotPassword } from '@/api/services'
import { withBasePath } from '@/utils'

type ForgotPasswordModalProps = {
  onClose: () => void
}

const ForgotPasswordModal = ({ onClose }: ForgotPasswordModalProps) => {
  const translations = useTranslations('Login')

  const schema = z.object({
    email: z.email()
  })

  const { formData, errors, handleChange, validate } = useForm(schema, {
    email: ''
  })

  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    variant: 'error' | 'info' | 'success'
  }>({ open: false, message: '', variant: 'info' })

  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      const messageKey = await forgotPassword(email)
      return { messageKey, email }
    },
    onSuccess: ({ messageKey, email }) => {
      setSnackbar({
        open: true,
        message: `${translations(messageKey)}. Check the browser console for the reset code, or use the reset code displayed below.`,
        variant: 'success'
      })

      setTimeout(() => {
        setSnackbar({
          open: true,
          message: `Reset code has been generated. Check the browser console (F12) to see it. You can also navigate to /reset-password?email=${encodeURIComponent(email)}&token=YOUR_CODE`,
          variant: 'info'
        })
      }, 1000)
    },
    onError: (error: Error) => {
      setSnackbar({
        open: true,
        message: translations(error.message),
        variant: 'error'
      })

      setTimeout(() => onClose(), 3000)
    }
  })

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    if (!validate()) {
      setSnackbar({ ...snackbar, open: false })
      return
    }

    forgotPasswordMutation.mutate(formData.email)
  }

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-secondary dark:bg-secondary-dark p-6 px-12 rounded-3xl shadow-lg max-w-md w-full relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 p-2 hover:bg-gray-100
                   dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <Image
            src={withBasePath('/icons/close.svg')}
            alt="Close modal"
            width={15}
            height={15}
            className="dark:invert opacity-70"
          />
        </button>

        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <h2 className="text-lg font-semibold mt-5 mb-10">
            {translations('forgottenPassword')}
          </h2>

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            required
            error={errors.email}
            variant="outline"
          />

          <SubmitButton
            label={translations('submit')}
            variant="thin"
            className="w-full my-5"
          />

          <p className="text-xs text-foreground-secondary dark:text-foreground-secondary-dark mt-4 text-center">
            Note: the reset code will be logged to the browser console. Check
            the console (F12) after submitting.
          </p>
        </form>

        <Snackbar
          {...snackbar}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        />
      </div>
    </div>
  )
}

export default ForgotPasswordModal
