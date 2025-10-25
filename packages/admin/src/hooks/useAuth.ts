import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

export const useAuth = () => {
    const { user, token } = useSelector((state: RootState) => state.auth);
    return { user, token, isAuthenticated: !!token };
};