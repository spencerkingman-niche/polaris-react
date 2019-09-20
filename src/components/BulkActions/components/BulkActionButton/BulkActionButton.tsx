import React, {createRef} from 'react';
import {CaretDownMinor} from '@shopify/polaris-icons';

import {classNames} from '../../../../utilities/css';
import {Icon} from '../../../Icon';
import {UnstyledLink} from '../../../UnstyledLink';
import {DisableableAction} from '../../../../types';

import {handleMouseUpByBlurring} from '../../../../utilities/focus';

import styles from '../../BulkActions.scss';

export type BulkActionButtonProps = {
  disclosure?: boolean;
  handleMeasurement?(width: number): void;
} & DisableableAction;

export class BulkActionButton extends React.PureComponent<
  BulkActionButtonProps,
  never
> {
  private bulkActionButton = createRef<HTMLButtonElement>();

  componentDidMount() {
    const {handleMeasurement} = this.props;
    if (handleMeasurement && this.bulkActionButton.current) {
      const width = this.bulkActionButton.current.getBoundingClientRect().width;
      handleMeasurement(width);
    }
  }

  render() {
    const {
      url,
      external,
      onAction,
      content,
      disclosure,
      accessibilityLabel,
      disabled,
    } = this.props;

    const disclosureIconMarkup = disclosure ? (
      <span className={styles.ActionIcon}>
        <Icon source={CaretDownMinor} />
      </span>
    ) : null;

    const contentMarkup = disclosureIconMarkup ? (
      <span className={styles.ActionContent}>
        <span>{content}</span>
        {disclosureIconMarkup}
      </span>
    ) : (
      content
    );

    if (url) {
      return (
        <UnstyledLink
          external={external}
          url={url}
          onMouseUp={handleMouseUpByBlurring}
          className={styles.Button}
          aria-label={accessibilityLabel}
        >
          {contentMarkup}
        </UnstyledLink>
      );
    }

    const className = classNames(styles.Button, disabled && styles.disabled);

    return (
      <button
        className={className}
        onClick={onAction}
        onMouseUp={handleMouseUpByBlurring}
        aria-label={accessibilityLabel}
        type="button"
        disabled={disabled}
        ref={this.bulkActionButton}
      >
        {contentMarkup}
      </button>
    );
  }
}
