import styles from '../../styles/components/Footer.module.css';

export function Footer() {
  return (
    <div className={styles.footerContainer}>
      <a href="https://www.github.com/brunocrez" target="_blank">
        <img src="github.png" alt="GitHub"/>
      </a>
      <a href="https://www.facebook.com/bruno.rezende.33" target="_blank">
        <img src="facebook.png" alt="Facebook"/>
      </a>
      <a href="https://www.instagram.com/brunoc.rez" target="_blank">
        <img src="instagram.png" alt="Instagram"/>
      </a>
    </div>
  );
}