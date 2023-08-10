import { useSelector } from 'react-redux'
import {
  getIsLoggedIn,
  getUserID,
  getIsLoading,
  getIsLoginFailed,
} from '../../redux/auth/selectors'

export const useAuth = () => {
  const isLoggedIn = useSelector(getIsLoggedIn)
  const userId = useSelector(getUserID)
  const isLoading = useSelector(getIsLoading)
  const isLoginFailed = useSelector(getIsLoginFailed)
  return {
    isLoggedIn,
    userId,
    isLoading,
    isLoginFailed,
  }
}
