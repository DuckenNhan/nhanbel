import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

interface SavedRoomsContextType {
  savedRoomIds: string[];
  isRoomSaved: (roomId: string) => boolean;
  toggleSaveRoom: (roomId: string) => void;
  saveRoom: (roomId: string) => void;
  unsaveRoom: (roomId: string) => void;
  savedCount: number;
}

const SavedRoomsContext = createContext<SavedRoomsContextType | undefined>(undefined);

export const useSavedRooms = () => {
  const context = useContext(SavedRoomsContext);
  if (!context) {
    throw new Error('useSavedRooms must be used within SavedRoomsProvider');
  }
  return context;
};

interface SavedRoomsProviderProps {
  children: ReactNode;
}

const SAVED_ROOMS_KEY = 'phongtro3d_saved_rooms';

export const SavedRoomsProvider: React.FC<SavedRoomsProviderProps> = ({ children }) => {
  const [savedRoomIds, setSavedRoomIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(SAVED_ROOMS_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedRoomIds(parsed);
        }
      } catch {
        localStorage.removeItem(SAVED_ROOMS_KEY);
      }
    }
  }, []);

  // Sync to localStorage whenever savedRoomIds changes
  useEffect(() => {
    localStorage.setItem(SAVED_ROOMS_KEY, JSON.stringify(savedRoomIds));
  }, [savedRoomIds]);

  const isRoomSaved = useCallback((roomId: string) => {
    return savedRoomIds.includes(roomId);
  }, [savedRoomIds]);

  const saveRoom = useCallback((roomId: string) => {
    setSavedRoomIds(prev => {
      if (prev.includes(roomId)) return prev;
      return [...prev, roomId];
    });
  }, []);

  const unsaveRoom = useCallback((roomId: string) => {
    setSavedRoomIds(prev => prev.filter(id => id !== roomId));
  }, []);

  const toggleSaveRoom = useCallback((roomId: string) => {
    setSavedRoomIds(prev => {
      if (prev.includes(roomId)) {
        return prev.filter(id => id !== roomId);
      }
      return [...prev, roomId];
    });
  }, []);

  return (
    <SavedRoomsContext.Provider value={{
      savedRoomIds,
      isRoomSaved,
      toggleSaveRoom,
      saveRoom,
      unsaveRoom,
      savedCount: savedRoomIds.length
    }}>
      {children}
    </SavedRoomsContext.Provider>
  );
};
