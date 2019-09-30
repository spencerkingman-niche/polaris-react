import React, {useMemo} from 'react';
import {ThemeContext} from '../../utilities/theme';
import {ThemeConfig, Theme} from '../../utilities/theme/types';
import {setColors} from '../../utilities/theme/legacy-utils';
import {Colors} from '../../utilities/theme/utils';
import {themeProvider} from '../shared';

import styles from './ThemeProvider.scss';

interface ThemeProviderProps {
  /** Custom logos and colors provided to select components */
  theme: ThemeConfig;
  /** The content to display */
  children?: React.ReactNode;
}

type CustomPropertiesLike = Record<string, string>;

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
      <div
        style={customProperties}
        {...themeProvider.props}
        className={styles.ThemeProvider}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

function buildCustomProperties(themeConfig: ThemeConfig): CustomPropertiesLike {
  return {
    ...buildLegacyCustomProperties(themeConfig),
    ...Colors(themeConfig),
  };
}

function buildLegacyCustomProperties(
  themeConfig: ThemeConfig,
): CustomPropertiesLike {
  const legacyColorProperties = setColors(themeConfig);

  if (!legacyColorProperties) {
    return {};
  }

  return legacyColorProperties.reduce(
    (state, [key, value]) => ({...state, [key]: value}),
    {},
  );
}

function buildThemeContext(themeConfig: ThemeConfig): Theme {
  const {logo} = themeConfig;
  return {logo};
}
