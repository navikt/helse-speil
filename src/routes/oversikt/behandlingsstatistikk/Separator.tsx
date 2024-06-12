import React, { ReactElement } from 'react';

import styles from './Separator.module.css';

export const Separator = (): ReactElement => {
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
