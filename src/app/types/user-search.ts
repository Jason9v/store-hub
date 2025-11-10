import { PaginationParams } from './pagination'

type UserSearchRequest = PaginationParams & {
  searchTerm?: string
}

export default UserSearchRequest
