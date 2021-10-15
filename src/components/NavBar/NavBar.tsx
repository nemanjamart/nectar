import { AdsSmallLogo } from '@components/images';
import { isBrowser } from '@utils';
import clsx from 'clsx';
import Link from 'next/link';
import React, { FC } from 'react';
import styles from './NavBar.module.css';
import { NavMenus } from './NavMenus';
import { ThemeDropdown } from './ThemeDropdown';

export const NavBar: FC = () => {
  const navbarClasses = clsx(styles['navbar-bg-color'], 'relative flex items-center');

  return (
    <nav className={navbarClasses}>
      <div className="px-4 sm:px-6 lg:px-8">
        <Link href="/">
          <a className="flex items-center h-12">
            <AdsSmallLogo className="w-10 h-10" aria-hidden />
            <h1 className="hidden ml-2 text-white text-2xl font-bold sm:inline">SciX</h1>
          </a>
        </Link>
      </div>
      {!isBrowser() ? null : <ThemeDropdown />}
      <a href="#main-content" className="flex items-center text-white focus:not-sr-only sr-only">
        Skip to content
      </a>
      {!isBrowser() ? null : <NavMenus />}
    </nav>
  );
};
