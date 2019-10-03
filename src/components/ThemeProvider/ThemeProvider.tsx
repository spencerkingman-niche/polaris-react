import React, {useMemo} from 'react';
import {
  ThemeContext,
  ThemeConfig,
  buildThemeContext,
  buildCustomProperties,
} from '../../utilities/theme';

interface ThemeProviderProps {
  /** Custom logos and colors provided to select components */
  theme: ThemeConfig;
  /** The content to display */
  children?: React.ReactNode;
}

export function ThemeProvider({
  theme: themeConfig,
  children,
}: ThemeProviderProps) {
  const theme = useMemo(() => buildThemeContext(themeConfig), [themeConfig]);
  const customProperties = useMemo(() => buildCustomProperties(themeConfig), [
    themeConfig,
  ]);

  return (
    <ThemeContext.Provider value={theme}>
      <div style={customProperties}>{children}</div>
    </ThemeContext.Provider>
  );
}
