import React from 'react';
import { Link } from 'react-router-dom';
import { Feature, OptForm } from '../components';
import { JumbotronContainer } from '../containers/jumbotron';
import { FooterContainer } from '../containers/footer';
import { FaqsContainer } from '../containers/faqs';
import { HeaderContainer } from '../containers/header';

export default function Home() {
  return (
    <>
      <HeaderContainer>
        <Feature>
          <Feature.Title>Unlimited films, TV programmes and more.</Feature.Title>
          <Feature.SubTitle>Watch anywhere. Cancel at any time.</Feature.SubTitle>
          <OptForm>
            <OptForm.Text>Ready to watch? Connect now or click here to watch without connecting
            </OptForm.Text>
            <OptForm.Break />
            <Link to="/v1/home3" className="btn p-2" style={{ backgroundColor: 'black', color: 'white', width: '150px' }}>
              Launch App
            </Link>
          </OptForm>
        </Feature>
      </HeaderContainer>
      <JumbotronContainer />
      <FaqsContainer />
      <FooterContainer />
    </>
  );
}
