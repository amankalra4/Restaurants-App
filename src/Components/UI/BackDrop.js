import React from 'react';
import styles from './BackDrop.module.css';

const BackDrop = (props) => (
    <div className = {styles.BackDrop} onClick = {() => props.toggleView()}></div>
)

export default BackDrop;