import React from 'react';

import styles from './Separator.module.css';

export const Separator: React.FC = () => {
    return (
        <tbody className={styles.Separator}>
            <tr>
                <td colSpan={4}>
                    <hr />
                </td>
            </tr>
        </tbody>
    );
};
