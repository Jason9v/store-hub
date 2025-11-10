import UserSearchRequest from '@/types/user-search'
import { UsersResponse } from '@/types/models/user'
import { Role } from '@/types/models/user'
import { mockUserService } from '@/utils'

export const fetchUsers = async ({
  pageNumber,
  pageSize,
  searchTerm
}: UserSearchRequest): Promise<UsersResponse> => {
  let users = mockUserService.getUsers()

  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase()
    users = users.filter(
      user =>
        user.email?.toLowerCase().includes(searchLower) ||
        user.name?.toLowerCase().includes(searchLower)
    )
  }

  const startIndex = (pageNumber - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedUsers = users.slice(startIndex, endIndex)
  const totalPages = Math.ceil(users.length / pageSize)

  return {
    users: paginatedUsers,
    totalItems: users.length,
    totalPages
  }
}

export const fetchUserRole = async (id: number): Promise<number> => {
  const user = mockUserService.getUserById(id)
  if (!user) throw new Error('userNotFound')

  return user.roleId
}

export const updateUserRole = async (
  id: number,
  roleId: number
): Promise<void> => mockUserService.updateUserRole(id, roleId as Role)
