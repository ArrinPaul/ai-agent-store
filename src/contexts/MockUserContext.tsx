
import React, { createContext } from "react";
const { useContext } = React;

interface MockUser {
  id: string;
  username: string;
  avatar_url: string | null;
  favorites: string[];
  bookmarks: string[];
}

interface MockUserContextType {
  user: MockUser | null;
  toggleFavorite: (appId: string) => void;
  toggleBookmark: (appId: string) => void;
  isFavorite: (appId: string) => boolean;
  isBookmarked: (appId: string) => boolean;
}

const MockUserContext = createContext<MockUserContextType>({
  user: null,
  toggleFavorite: () => {},
  toggleBookmark: () => {},
  isFavorite: () => false,
  isBookmarked: () => false,
});

export const MockUserProvider = ({ children }: { children: React.ReactNode }) => {
  const mockUser: MockUser = {
    id: "demo-user",
    username: "Demo User",
    avatar_url: null,
    favorites: [],
    bookmarks: []
  };

  const toggleFavorite = (appId: string) => {
    // Mock implementation - in a real app this would update state
    console.log(`Toggled favorite for app: ${appId}`);
  };

  const toggleBookmark = (appId: string) => {
    // Mock implementation - in a real app this would update state
    console.log(`Toggled bookmark for app: ${appId}`);
  };

  const isFavorite = (appId: string) => {
    return false; // Mock implementation
  };

  const isBookmarked = (appId: string) => {
    return false; // Mock implementation
  };

  return (
    <MockUserContext.Provider value={{
      user: mockUser,
      toggleFavorite,
      toggleBookmark,
      isFavorite,
      isBookmarked
    }}>
      {children}
    </MockUserContext.Provider>
  );
};

export const useMockUser = () => {
  const context = useContext(MockUserContext);
  if (!context) {
    throw new Error("useMockUser must be used within a MockUserProvider");
  }
  return context;
};
