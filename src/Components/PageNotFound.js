import React from 'react';
import styles from './PageNotFound.module.css';

const Page404 = (props) => (
    <div>
       <p className = {styles.Page404}>
           Page Not Found for "{props.location.pathname}". 
           <br/>
           Please go to homepage, to search a city.
        </p>
    </div>
);

export default Page404;
