import React, {useMemo} from 'react';
import {ThemeContext} from '../../utilities/theme';
import {ThemeConfig} from '../../utilities/theme/types';
import {
  buildThemeContext,
  buildCustomProperties,
} from '../../utilities/theme/utils';
import {themeProvider} from '../shared';
import {useFeatures} from '../../utilities/features';

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
  const {globalTheming} = useFeatures();
  const theme = useMemo(() => buildThemeContext(themeConfig), [themeConfig]);
  const customProperties = useMemo(
    () => buildCustomProperties(themeConfig, globalTheming),
    [globalTheming, themeConfig],
  );

  return (
    <ThemeContext.Provider value={theme}>
      <div style={customProperties} {...themeProvider.props}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
