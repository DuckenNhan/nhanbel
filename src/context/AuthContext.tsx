import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

export type UserRole = 'landlord' | 'renter' | null;

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  age: number;
  role: UserRole;
  password?: string;
  avatar?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  registeredUsers: User[];
  login: (userData: User) => void;
  loginWithEmail: (email: string, password: string) => User | null;
  register: (userData: Omit<User, 'id' | 'createdAt'> & { password: string }) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const USER_STORAGE_KEY = 'phongtro3d_user';
const USERS_STORAGE_KEY = 'phongtro3d_registered_users';

// Initial mock registered users
const INITIAL_MOCK_USERS: User[] = [
  {
    id: 'user_mock_1',
    fullName: 'Nguyễn Văn A',
    email: 'nguyenvana@gmail.com',
    phone: '0901234567',
    age: 28,
    role: 'landlord',
    password: '123456',
    avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=2563eb&color=fff',
    createdAt: '2024-01-01'
  },
  {
    id: 'user_mock_2',
    fullName: 'Trần Thị B',
    email: 'tranthib@gmail.com',
    phone: '0912345678',
    age: 25,
    role: 'renter',
    password: '123456',
    avatar: 'https://ui-avatars.com/api/?name=Tran+Thi+B&background=2563eb&color=fff',
    createdAt: '2024-01-02'
  }
];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load registered users from localStorage or use initial mock
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    let users: User[];

    if (storedUsers) {
      try {
        users = JSON.parse(storedUsers);
      } catch {
        users = INITIAL_MOCK_USERS;
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      }
    } else {
      users = INITIAL_MOCK_USERS;
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }

    setRegisteredUsers(users);

    // Load current user session
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Verify user still exists in registered users
        if (users.some(u => u.id === parsedUser.id)) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem(USER_STORAGE_KEY);
        }
      } catch {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((userData: User) => {
    setUser(userData);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
  }, []);

  const loginWithEmail = useCallback((email: string, password: string): User | null => {
    const foundUser = registeredUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword as User);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userWithoutPassword));
      return foundUser;
    }

    return null;
  }, [registeredUsers]);

  const register = useCallback((userData: Omit<User, 'id' | 'createdAt'> & { password: string }): { success: boolean; error?: string } => {
    // Check if email already exists
    if (registeredUsers.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      return { success: false, error: 'Email đã được sử dụng. Vui lòng chọn email khác.' };
    }

    // Check if phone already exists
    if (registeredUsers.some(u => u.phone === userData.phone)) {
      return { success: false, error: 'Số điện thoại đã được sử dụng. Vui lòng chọn số khác.' };
    }

    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullName)}&background=2563eb&color=fff`
    };

    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));

    // Auto login after registration
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword as User);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userWithoutPassword));

    return { success: true };
  }, [registeredUsers]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      registeredUsers,
      login,
      loginWithEmail,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
