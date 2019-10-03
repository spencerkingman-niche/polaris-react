import React from 'react'

import { HeadingTagName } from '../../types'
import styles from './Watchamacallit.scss'

export interface WatchamacallitProps {
  /**
   * The element name to use for the heading
   * @default 'h2'
   */
  element?: HeadingTagName;
  /** The content to display inside the heading */
  children?: React.ReactNode;
}

export function Watchamacallit({element: Element = 'h2', children}: WatchamacallitProps) {
  return <Element className={styles.Heading}>{children}</Element>;
}
