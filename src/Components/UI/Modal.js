import React from 'react';
import BackDrop from './BackDrop';
import styles from './Modal.module.css';

const Modal = (props) => {
    return (
        props.showModal
        ?
            <React.Fragment>
                <BackDrop toggleView = {props.toggleModal} />
                <div className = {styles.Modal}>
                    {props.children}
                    <button className = {styles.ModalButton} onClick = {() => props.toggleModal()}>Close</button>
                </div>
            </React.Fragment>
        :
            null
    )
}

export default Modal;