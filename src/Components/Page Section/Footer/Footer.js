import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <div className = {styles.Footer}>
            <p>Copy rights reserved. &#169; Anonymous Developer 2020</p>
            <p><strong>Note: </strong>Data shown above is derived from Zomato's API.</p>
        </div>
    )
}

export default Footer;