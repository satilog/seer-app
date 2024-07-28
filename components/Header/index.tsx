'use client';

import React from 'react';
import styles from './Header.module.css';

const Header: React.FC = () => {
  return (
    <div className={styles.header}>
      <div className={styles.pair}>
        <img src="icons/icon32.png" alt="Logo" className={styles.logo} />
        <h1 className={styles.title}>seer.ai</h1>
      </div>
      <button className={styles.closeButton}>×</button>
    </div>
  );
};

export default Header;
