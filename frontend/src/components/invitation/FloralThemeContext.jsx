import { createContext, useContext } from 'react';

export const FloralThemeContext = createContext(null);

export function FloralThemeProvider({ value, children }) {
  return (
    <FloralThemeContext.Provider value={value}>
      {children}
    </FloralThemeContext.Provider>
  );
}

export function useFloralTheme() {
  return useContext(FloralThemeContext);
}
