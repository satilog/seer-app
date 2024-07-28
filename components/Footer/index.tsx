"use client";

import React from "react";
import styles from "./Footer.module.css";

const Footer: React.FC = () => {
  return (
    <div className={styles.footer}>
      <span className={styles.text}>Copy</span>
    </div>
  );
};

export default Footer;
