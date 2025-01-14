import { ListType } from './types';
import { isBrowser } from '@utils';
import { MouseEvent, ReactElement } from 'react';
import { MenuDropdown } from './MenuDropdown';

const items = [
  {
    id: 'about',
    path: '/about',
    label: 'About ADS',
  },
  {
    id: 'new',
    path: '/help/whats_new',
    label: "What's New",
  },
  {
    id: 'blog',
    path: '/blog',
    label: 'ADS Blog',
  },
  {
    id: 'help',
    path: '/help/',
    label: 'ADS Help Pages',
  },
  {
    id: 'legacy',
    path: '/help/legacy',
    label: 'ADS Legacy Services',
  },
  {
    id: 'careers',
    path: '/about/careers',
    label: 'Careers@ADS',
  },
];

interface IAboutDropdownProps {
  type: ListType;
  onFinished?: () => void;
}

export const AboutDropdown = (props: IAboutDropdownProps): ReactElement => {
  const { type, onFinished } = props;

  const handleSelect = (e: MouseEvent<HTMLElement>) => {
    const id = (e.target as HTMLElement).dataset['id'];
    if (isBrowser()) {
      window.open(items.find((item) => id === item.id).path, '_blank', 'noopener,noreferrer');
      if (onFinished) {
        onFinished();
      }
    }
  };

  return <MenuDropdown id="about" type={type} label="About" items={items} onSelect={handleSelect} />;
};
