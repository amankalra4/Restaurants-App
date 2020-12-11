import React from 'react';
import { withRouter } from 'react-router';
import food from '../../../assets/food.jpg'
import styles from './Header.module.css';

const Header = (props) => {
    return(
        <div className = {styles.header}>
            <img style = {{cursor: 'pointer'}} src = {food} alt = 'Food icon' onClick = {() => props.history.push('/')} />
            <p>Cuisine &amp; Restaurant Finder</p>
        </div>
    )
}

export default withRouter(Header);
