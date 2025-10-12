// Dán code này vào file: packages/web-client/src/hooks/useUser.ts

import { createContext, useState, useContext } from 'react';
import type { ReactNode, Dispatch, SetStateAction } from 'react';

// Định nghĩa kiểu dữ liệu cho User
interface User {
  fullname: string;
  avatar?: string;
}

// Định nghĩa kiểu dữ liệu cho Context
interface UserContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

// Tạo Context với kiểu đã định nghĩa
const UserContext = createContext<UserContextType | undefined>(undefined);

// Tạo Provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

/* eslint-disable react-refresh/only-export-components */

// Custom hook để sử dụng context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};