import { ReactElement, useState } from 'react';
import { DropdownList, ItemType, SelectorLabel } from '@components/Dropdown';
import { AppEvent, useAppCtx } from '@store';
import { Theme } from '@types';
import styles from './NavBar.module.css';
import clsx from 'clsx';

const themes: ItemType[] = [
  {
    id: Theme.GENERAL,
    domId: 'theme-general',
    label: 'General Science',
  },
  {
    id: Theme.ASTROPHYSICS,
    domId: 'theme-astrophysics',
    label: 'Astrophysics',
  },
  {
    id: Theme.HELIOPHYISCS,
    domId: 'theme-heliophysics',
    label: 'Heliophysics',
  },
  {
    id: Theme.PLANET_SCIENCE,
    domId: 'theme-planetary',
    label: 'Planetary Science',
  },
  {
    id: Theme.EARTH_SCIENCE,
    domId: 'theme-earth',
    label: 'Earth Science',
  },
  {
    id: Theme.BIO_PHYSICAL,
    domId: 'theme-biophysical',
    label: 'Biological & Physical Science',
  },
];

export const ThemeDropdown = (): ReactElement => {

  const { state: appState, dispatch } = useAppCtx();

  const getUserTheme = () => {
    const userTheme = appState.theme.toString();
    return userTheme? userTheme : Theme.GENERAL;
  }

  const [selectedTheme, setSelectedTheme] = useState<string>(getUserTheme());

  const setUserTheme = (themeId: Theme) => {
    dispatch({type: AppEvent.SET_THEME, payload: themeId });
    setSelectedTheme(themeId);
  }

  const selectorClasses = clsx(styles['navbar-bg-color'], styles['navbar-text-color'], 'flex items-center justify-between w-64 border border-gray-50 border-opacity-50 rounded-sm cursor-pointer');

  const getLabelNode = (itemId: string) => {
    const label = themes.find(item => item.id === itemId).label;

    return <SelectorLabel text={label} classes={selectorClasses} />
  };

  const handleOnSelect = (themeId: Theme) => {
    setUserTheme(themeId);
    setSelectedTheme(themes.find((theme) => theme.id === themeId).id);
  };

  return (
    <DropdownList
      label={getLabelNode(selectedTheme)}
      items={themes}
      onSelect={handleOnSelect}
      classes={{
        button: '',
        list: 'w-64'
      }}
      offset={[0, 4]}
      useCustomLabel={true}
      placement="bottom-start"
      role="listbox"
      ariaLabel="Theme selector"
    />
  );
};