import React, { useEffect, useRef } from 'react';
import Theme from './Theme';

export const ThemeContext = React.createContext({
  theme: null,
});

const StyleProvider = ({ children, style }) => {
  const theme = useRef(new Theme(style));

  useEffect(() => {
    theme.current?.setTheme(style);
  }, [style]);

  return (
    <ThemeContext.Provider value={{ theme: theme.current }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default StyleProvider;
