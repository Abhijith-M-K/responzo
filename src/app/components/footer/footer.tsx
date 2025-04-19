import React from "react";
import styles from "./footer.module.scss";
import { FaInstagram, FaFacebookF } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p>&copy; {new Date().getFullYear()} Responzo. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
