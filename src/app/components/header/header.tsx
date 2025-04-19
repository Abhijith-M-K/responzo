'use client'; 
import React, { useState } from "react";
import styles from "./header.module.scss";
import { FaBars, FaTimes } from "react-icons/fa"; 

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>RESPONZO</div>

    </header>
  );
};

export default Header;
