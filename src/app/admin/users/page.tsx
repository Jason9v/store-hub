'use client'

import { useTranslations } from 'next-intl'
import { useState, useCallback, ChangeEvent, useEffect } from 'react'

import { useUsersMutation, useUsersQuery } from '@/hooks/users'

import withAdminRedirect from '@/hoc/withAdminRedirect'

import {
  LoadingSpinner,
  Snackbar,
  SearchBar,
  NoUsersMessage,
  UserList
} from '@/components'

import { Role } from '@/types'

const UsersPanel = () => {
  const translations = useTranslations('UsersPanel')
  const [inputValue, setInputValue] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null
  )

  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    variant: 'error' | 'info' | 'success'
  }>({
    open: false,
    message: '',
    variant: 'info'
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(inputValue)
      setCurrentPage(1)
    }, 300)

    return () => clearTimeout(timer)
  }, [inputValue])

  const { data: paginatedUsers, isLoading } = useUsersQuery(
    searchTerm,
    currentPage
  )

  const updateRoleMutation = useUsersMutation(searchTerm, currentPage)

  const handleRoleChange = useCallback(
    (params: { userId: number; roleId: Role }) => {
      updateRoleMutation.mutate(params, {
        onSuccess: () => {
          setSnackbar({
            open: true,
            message: translations('roleUpdatedSuccessfully'),
            variant: 'success'
          })
        }
      })
    },
    [updateRoleMutation, translations]
  )

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value)
    },
    []
  )

  const handleClearSearch = useCallback(() => {
    setInputValue('')
    setSearchTerm('')
    setCurrentPage(1)
  }, [])

  const handlePageChange = useCallback(
    (page: number) => setCurrentPage(page),
    []
  )

  const handleToggleDropdown = useCallback(
    (index: number) =>
      setOpenDropdownIndex(previousState =>
        previousState === index ? null : index
      ),
    []
  )

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="m-10">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <p className="text-xl font-semibold">{translations('title')}</p>

        <SearchBar
          searchTerm={inputValue}
          onSearchChange={handleSearchChange}
          onClearSearch={handleClearSearch}
        />
      </div>

      <hr className="my-10 border-gray-300 dark:border-gray-600" />

      {paginatedUsers?.users.length ? (
        <UserList
          users={paginatedUsers.users}
          openDropdownIndex={openDropdownIndex}
          onToggleDropdown={handleToggleDropdown}
          onRoleChange={handleRoleChange}
          totalPages={paginatedUsers.totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      ) : (
        <NoUsersMessage />
      )}

      <Snackbar
        {...snackbar}
        onClose={() =>
          setSnackbar(previousState => ({ ...previousState, open: false }))
        }
      />
    </div>
  )
}

export default withAdminRedirect(UsersPanel)
