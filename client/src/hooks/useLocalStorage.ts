import { Dispatch, SetStateAction, useEffect, useState } from "react";

type UseLocalStorageReturnType<T> = [T, Dispatch<SetStateAction<T>>];

function useLocalStorage<T>(
  key: string,
  initialValue: T
): UseLocalStorageReturnType<T> {
  // Get the stored value or use the initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return initialValue;
    }
  });

  // Update local storage when the state changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  }, [key, storedValue]);

  // Return the stored value and a function to update it
  return [storedValue, setStoredValue];
}

export default useLocalStorage;
