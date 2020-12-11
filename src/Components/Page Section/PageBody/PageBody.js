import React from 'react';
import styles from './PageBody.module.css';

const PageBody = () =>{
    return (
        <div id = 'home-Text'>
            <div style = {{textAlign: 'center', fontSize: 'larger', padding: '15px'}}>
            <p>How Our Site works</p>
            <ul>
                <li>Type up the location you want to search.</li>
                <li>You'll get all cities related to the search you made.</li>
                <li>Click on the city of where you want to check the cuisinies.</li>
                <li>Now you can click on the cusine for which you want to search a resturant.</li>
                <li>Hurray!! Thats it.... you'll now get the resturants based on your selection criteria.</li>
            </ul>
            </div>
            <div className = {styles.imageGrid}>
                <img 
                    src = {`https://b.zmtcdn.com/images/online_ordering/delivery.svg`} 
                    alt = 'Resturant and cuisines types' 
                    className = {styles.imgStyle} />
                <img 
                    src = {`https://b.zmtcdn.com/images/online_ordering/menu.svg`} 
                    alt = 'Resturant search' 
                    className = {styles.imgStyle}/>
                <p>Explore cuisines availble in your city.</p>
                <p>Browse resturants based on your selection.</p>
            </div>
        </div>
    )
}

export default PageBody;
