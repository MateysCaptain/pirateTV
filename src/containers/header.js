import React from 'react';
import { Header } from '../components';
import * as ROUTES from '../constants/routes';

export function HeaderContainer({ children }) {
  return (
    <Header>
      <Header.Frame>
        <Header.Logo to={ROUTES.HOME} src="https://i.ibb.co/GFvwssk/pirate-logo-removebg-preview.png" alt="Netflix" />
        <Header.ButtonLink to="/login2">Connect</Header.ButtonLink>
      </Header.Frame>
      {children}
    </Header>
  );
}
