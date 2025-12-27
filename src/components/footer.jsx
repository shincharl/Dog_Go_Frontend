import styles from '../css/footer.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebook, faTwitter, faGithub } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    return(
        <footer className={styles.footer}>
            <div className={styles.container}>
                <h2 className={styles.logo}>웹 사이트</h2>
                <div className={styles.icons}>
                     <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faInstagram} />
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faFacebook} />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faTwitter} />
                    </a>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faGithub} />
                    </a>
                </div>
                <p className={styles.copy}>
                    © {new Date().getFullYear()} MyWebsite. All rights reserved.
                </p>
            </div>
        </footer>
    )
}

export default Footer;  