import React, {useState, useRef, useContext, useEffect} from 'react';
import {useUniqueId} from '../../utilities/unique-id';
import {elementChildren, isElementOfType} from '../../utilities/components';
import {Key} from '../../types';
import {classNames} from '../../utilities/css';

import {KeypressListener} from '../KeypressListener';
import {TextFieldProps} from '../TextField';
import {Popover} from '../Popover';
import styles from './Autocomplete.scss';

export interface AutocompleteProps {
  id?: string;
  children: React.ReactNode;
  textfield: React.ReactElement<TextFieldProps>;
}

export function Autocomplete({children, textfield}: AutocompleteProps) {
  const [popoverActive, setPopoverActive] = useState(false);
  const comboBoxId = useUniqueId('comboBox');
  const listBoxId = useUniqueId('listBox');

  const handleFocus = () => {
    setPopoverActive(true);
  };

  const handleBlur = () => {
    setPopoverActive(false);
  };

  const textfieldMarkup = (
    <div
      role="combobox"
      aria-expanded={popoverActive}
      aria-owns={listBoxId}
      aria-haspopup="listbox"
      aria-controls={listBoxId}
      id={comboBoxId}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {textfield}
    </div>
  );

  const listBoxMarkup =
    React.Children.toArray(children).length > 0 ? (
      <div id={listBoxId}>{children}</div>
    ) : null;

  const popover = (
    <Popover
      active={popoverActive}
      onClose={() => null}
      activator={textfieldMarkup}
      preventAutofocus
      fullWidth
    >
      {listBoxMarkup}
    </Popover>
  );

  return <React.Fragment>{popover}</React.Fragment>;
}

type ListBoxProps = {
  children: React.ReactNode;
  onSelect?(active: string): void;
};

const ListBoxtContext = React.createContext<ListBoxContextType>({});

interface ListBoxContextType {
  // setActive?(id: string): void;
  active?: string;
}

export function ListBox({children, onSelect}: ListBoxProps) {
  const listBoxClassName = classNames(styles.ListBox);
  const [active, setActive] = useState();
  const [navigableOptions, setNavigableOptions] = useState([] as string[]);

  const totalOptions = useRef<number>(navigableOptions.length);

  useEffect(() => {
    const updatedNavigableOptions = elementChildren(children).map(
      (child: React.ReactElement<OptionProps>) => {
        if (
          child &&
          isElementOfType(child, Option) &&
          !child.props.disabled &&
          child.props.value
        ) {
          return child.props.value;
        }
      },
    );
    setNavigableOptions(updatedNavigableOptions as string[]);
    totalOptions.current = updatedNavigableOptions.length;
  }, [children]);

  const context = {
    active,
  };

  /** key interactions */
  const handleDownArrow = () => {
    if (!navigableOptions) return;
    active == null
      ? setActive(navigableOptions[0])
      : handleNextPosition(navigableOptions.indexOf(active) + 1);
  };

  const handleUpArrow = () => {
    if (!navigableOptions || !totalOptions.current) return;
    active == null
      ? setActive(navigableOptions[totalOptions.current - 1])
      : handleNextPosition(navigableOptions.indexOf(active) - 1);
  };

  const handleNextPosition = (nextPosition: number) => {
    switch (nextPosition) {
      case -1:
        setActive(navigableOptions[totalOptions.current - 1]);
        break;
      case totalOptions.current:
        setActive(navigableOptions[0]);
        break;
      default:
        setActive(navigableOptions[nextPosition]);
    }
  };

  const handleEnter = (evt: KeyboardEvent) => {
    evt.preventDefault();
    onSelect && onSelect(active);
  };

  const handleClick = ({target}: React.MouseEvent<HTMLUListElement>) => {
    const value = (target as HTMLElement).dataset.value;
    value && onSelect && onSelect(value);
  };

  return (
    <React.Fragment>
      <KeypressListener keyCode={Key.DownArrow} handler={handleDownArrow} />
      <KeypressListener keyCode={Key.UpArrow} handler={handleUpArrow} />
      <KeypressListener
        keyCode={Key.Enter}
        handler={handleEnter}
        keyEventName="keyup"
      />
      <ListBoxtContext.Provider value={context}>
        <ul className={listBoxClassName} onClick={handleClick}>
          {children}
        </ul>
      </ListBoxtContext.Provider>
    </React.Fragment>
  );
}

type OptionProps = {
  value: string;
  children: string | React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
};

export function Option({value, children, selected}: OptionProps) {
  const {active} = useContext(ListBoxtContext);
  const optionClassName = classNames(
    styles.Option,
    selected && styles.selected,
    active === value && styles.focused,
  );

  return (
    <li className={optionClassName} data-value={value}>
      {children}
    </li>
  );
}

Autocomplete.Option = Option;
Autocomplete.ListBox = ListBox;
