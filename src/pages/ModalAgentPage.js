import React from 'react';
import { Transition } from "react-transition-group";
import styles from './Modal.module.css'; // Assuming using CSS modules

const ModalAgentPage = ({ isOpen, onClose, children }) => {

    const onWrapperClick = (event) => {
        if (event.target.classList.contains(styles.modalWrapper)) onClose();
    };

    return (
      <>
      <Transition in={isOpen} timeout={350} unmountOnExit={true}>
      {(state) => (
        <div className={`${styles.modal} ${styles[`modal--${state}`]}`} aria-modal="true" role="dialog">
            <div className={styles.modalWrapper} onClick={onWrapperClick}>
                <div className={styles.modalContent}>
                    <button className={styles.modalCloseButton} onClick={onClose} aria-label="Close modal">
                        გაუქმება
                    </button>
                    {children}
                </div>
            </div>
        </div>
      )}
      </Transition>
      </>
    );
};

export default ModalAgentPage;
