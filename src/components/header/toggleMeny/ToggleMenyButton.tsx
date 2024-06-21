import React, { useState } from 'react';

import { ToggleMeny } from '@components/header/toggleMeny/ToggleMeny';

import styles from './ToggleMenyButton.module.css';

export const ToggleMenyButton = () => {
    const [showModal, setShowModal] = useState(false);
    return (
        <div className={styles.Button}>
            <p onClick={() => setShowModal(!showModal)}>Toggles</p>
            {showModal && <ToggleMeny onClose={() => setShowModal(false)} showModal={showModal} />}
        </div>
    );
};
