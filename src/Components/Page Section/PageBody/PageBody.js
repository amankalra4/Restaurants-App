import React from 'react';
import styles from './PageBody.module.css';

const PageBody = () =>{
    return (
        <div id = 'home-Text'>
            <div style = {{textAlign: 'center', fontSize: 'larger'}}>
            <p>How Our Site Works</p>
            <ul>
                <li>Type up the location you want to search.</li>
                <li>From the available cities, select your desired city.</li>
                <li>Now select cuisines for which you want to search restaurants.</li>
                <li>Hurray!! Thats it.... you'll now get the restaurants based on your selection criteria.</li>
                <li>Click on the restaurant name to view more details.</li>
                <li>Sort the restaurants based on the rating and average cost.</li>
            </ul>
            </div>
            <div className = {styles.imageGrid}>
                <img 
                    src = {`https://b.zmtcdn.com/images/online_ordering/delivery.svg`} 
                    alt = 'Restaurant and cuisines types' 
                    className = {styles.imgStyle} />
                <img 
                    src = {`https://b.zmtcdn.com/images/online_ordering/menu.svg`} 
                    alt = 'Restaurant search' 
                    className = {styles.imgStyle}/>
                <p>Explore cuisines availble in your city.</p>
                <p>Browse restaurants based on your selection.</p>
            </div>
        </div>
    )
}

export default PageBody;
