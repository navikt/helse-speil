import React, { CSSProperties } from 'react';

import { AnnullertIkon, UtbetaltAutomatiskIkon, UtbetaltIkon } from '../../../components/ikoner/Tidslinjeperiodeikoner';

interface BehandlingstypeetikettProps {
    type: string;
}

export const Behandlingstypeetikett = ({ type }: BehandlingstypeetikettProps) => {
    const styles: CSSProperties = {
        marginRight: '20px',
    };

    switch (type) {
        case 'MANUELT':
            return <UtbetaltIkon styles={styles} />;
        case 'AUTOMATISK':
            return <UtbetaltAutomatiskIkon styles={styles} />;
        case 'ANNULLERING':
            return <AnnullertIkon styles={styles} />;
        default:
            return null;
    }
};
