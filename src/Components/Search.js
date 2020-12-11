import React, { useState } from 'react';
import styles from './Search.module.css';
import Modal from './UI/Modal';

const Search = (props) => {
    const [text, textChange] = useState('');
    const [showModal, toggleModal] = useState(false);

    const handleClick = () => {
        if(/\S/.test(text)) {
            props.handleView(text);
        }
        else {
            toggleModal(true);
            textChange('');
        }
    }

    const toggle = () => {
        toggleModal(!showModal);
    }

    return (
        <div className = {styles.Search}>
            <div className = {styles.innerDiv}>
                <input 
                    type = 'text'
                    placeholder = 'Enter your city'
                    spellCheck = 'false'
                    autoComplete = 'off'
                    value = {text}
                    onChange = {(e) => textChange(e.target.value)} />
                <button className = {styles.FindButton} type = 'submit' onClick = {handleClick}>Find</button>
            </div>
            {
                showModal &&
                <Modal showModal = {showModal} toggleModal = {toggle}>
                    <p>Please enter a city</p>
                </Modal>
            }
        </div>
    )
}

export default Search;
