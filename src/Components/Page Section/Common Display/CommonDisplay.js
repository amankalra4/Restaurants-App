import React from 'react';
import styles from './CommonDisplay.module.css';

const CommonDisplay = (props) => (
    <div className = {styles.CommonDisplay}>
        We couldn't fetch {props.data}. Please go to home page by clicking the icon on top left corner.
        <br/>
        Or type the location above.
    </div>
)

export default CommonDisplay;
