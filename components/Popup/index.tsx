'use client';

import React from 'react';
import Header from '../Header';
import Body from '../Body';
import Footer from '../Footer';
import styles from './Popup.module.css';

const Popup: React.FC = () => {
  return (
    <div className={styles.popup}>
      <Header />
      <Body />
      {/* <Footer /> */}
    </div>
  );
};

export default Popup;
