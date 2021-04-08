import { Periodetype } from 'internal-types';
import React, { CSSProperties } from 'react';
import { Forlengelse, Førstegangsbehandling, Infotrygdforlengelse } from '../Oppgaveetikett';
import { AnnullertIkon, UtbetaltAutomatiskIkon, UtbetaltIkon } from '../../../components/ikoner/Tidslinjeperiodeikoner';

interface PeriodetypeetikettProps {
    type: Periodetype;
}

export const Periodetypeetikett = ({ type }: PeriodetypeetikettProps) => {
    const styles: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        width: '1rem',
        height: '1rem',
        padding: '0.5rem',
        fontSize: '12px',
        fontWeight: 600,
        textAlign: 'center',
        marginRight: '20px',
    };

    switch (type) {
        case Periodetype.Forlengelse:
        case Periodetype.Infotrygdforlengelse:
            return <Forlengelse style={styles}>FL</Forlengelse>;
        case Periodetype.Førstegangsbehandling:
            return <Førstegangsbehandling style={{ ...styles, fontSize: '14px' }}>F</Førstegangsbehandling>;
        case Periodetype.OvergangFraInfotrygd:
            return <Infotrygdforlengelse style={styles}>FI</Infotrygdforlengelse>;
        default:
            return null;
    }
};

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
