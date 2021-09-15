import styled from '@emotion/styled';
import { Periodetype, Tidslinjetilstand } from 'internal-types';
import React from 'react';

import { Tooltip } from './Tooltip';

interface EtikettProps {
    størrelse?: 's' | 'l';
}

const Etikett = styled.div<EtikettProps>`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    text-align: center;
    padding: 0.5rem;
    font-weight: 600;
    border-radius: 0.25rem;
    pointer-events: none;

    width: ${(props) => (props.størrelse === 'l' ? '20px' : '16px')};
    height: ${(props) => (props.størrelse === 'l' ? '20px' : '16px')};
    font-size: ${(props) => (props.størrelse === 'l' ? '14px' : '12px')};

    :before {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
`;

const RevurderingEtikett = styled(Etikett)`
    background: var(--nav-lime-gronn-lighten-80);
    border: 1px solid var(--nav-lime-gronn-darken-40);

    :before {
        content: 'R';
    }
`;

const RevurderesEtikett = styled(Etikett)`
    border: 1px solid #ff9100;
    background: #ffe9cc
        url("data:image/svg+xml,%3Csvg width='20' height='15' viewBox='0 0 20 15' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 14.388V0H4.862C5.61 0 6.30667 0.0733333 6.952 0.22C7.59733 0.366667 8.15467 0.608668 8.624 0.946001C9.09333 1.26867 9.46 1.70133 9.724 2.244C10.0027 2.78667 10.142 3.46133 10.142 4.268C10.142 5.368 9.878 6.25533 9.35 6.93C8.83667 7.60467 8.14733 8.08867 7.282 8.382L9.27401 11.1953L8.54041 13.5563C8.43895 13.8828 8.00109 13.9398 7.8195 13.65L4.752 8.756H2.552V14.388H0ZM2.552 6.732H4.598C5.58067 6.732 6.32867 6.52667 6.842 6.116C7.37 5.70533 7.634 5.08933 7.634 4.268C7.634 3.432 7.37 2.85267 6.842 2.53C6.32867 2.20733 5.58067 2.046 4.598 2.046H2.552V6.732Z' fill='%23262626'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M17.3568 5.40771L19.2764 7.32729C19.3478 7.3987 19.3885 7.49622 19.3885 7.59834C19.3885 7.70046 19.3478 7.79797 19.2764 7.87015L18.0118 9.13401L15.5493 6.67156L16.8139 5.40771C16.9637 5.25798 17.2071 5.25798 17.3568 5.40771ZM14.869 7.35277L11.3255 10.8956L13.7879 13.358L17.4689 9.677L15.0065 7.21456L14.869 7.35277ZM10.1891 14.0205C10.1499 14.1548 10.1875 14.2992 10.2866 14.3975C10.3588 14.4704 10.457 14.5096 10.5576 14.5096C10.593 14.5096 10.6283 14.505 10.6628 14.495L13.1337 13.7894L10.8947 11.5504L10.1891 14.0205Z' fill='%23262626'/%3E%3C/svg%3E%0A")
        no-repeat 70% 50%;
    background-size: 80%;
`;

const ForlengelseEtikett = styled(Etikett)`
    background: var(--speil-etikett-forlengelse-background);
    border: 1px solid var(--speil-etikett-forlengelse-border);

    :before {
        content: 'FL';
    }
`;

const FørstegangsbehandlingEtikett = styled(Etikett)`
    background: var(--speil-etikett-forstegangs-background);
    border: 1px solid var(--speil-etikett-forstegangs-border);

    :before {
        content: 'F';
    }
`;

const InfotrygdforlengelseEtikett = styled(Etikett)`
    background: var(--speil-etikett-forlengelse-it-background);
    border: 1px solid var(--speil-etikett-forlengelse-it-border);
    color: var(--navds-color-text-inverse);

    :before {
        content: 'FI';
    }
`;

const StikkprøveEtikett = styled(Etikett)`
    background: var(--speil-etikett-stikkprove-background);
    border: 1px solid var(--speil-etikett-stikkprove-border);
    color: var(--navds-color-text-inverse);

    :before {
        content: 'S';
    }
`;

const RiskQaEtikett = styled(Etikett)`
    background: var(--speil-etikett-risk-background);
    border: 1px solid var(--speil-etikett-risk-border);
    color: var(--navds-color-text-primary);

    :before {
        content: 'QA';
    }
`;

interface OppgaveetikettProps extends EtikettProps {
    type: Periodetype;
    tilstand?: Tidslinjetilstand;
}

export const Oppgaveetikett = ({ type, tilstand, størrelse = 'l' }: OppgaveetikettProps) => {
    switch (type) {
        case Periodetype.Førstegangsbehandling:
            return <FørstegangsbehandlingEtikett størrelse={størrelse} />;
        case Periodetype.Forlengelse:
            return <ForlengelseEtikett størrelse={størrelse} />;
        case Periodetype.Infotrygdforlengelse:
            return <ForlengelseEtikett størrelse={størrelse} />;
        case Periodetype.OvergangFraInfotrygd:
            return <InfotrygdforlengelseEtikett størrelse={størrelse} />;
        case Periodetype.Stikkprøve:
            return <StikkprøveEtikett størrelse={størrelse} />;
        case Periodetype.RiskQa:
            return <RiskQaEtikett størrelse={størrelse} />;
        case Periodetype.Revurdering: {
            if (tilstand === Tidslinjetilstand.Revurderes) {
                return <RevurderesEtikett størrelse={størrelse} />;
            } else {
                return <RevurderingEtikett størrelse={størrelse} />;
            }
        }
        default:
            return null;
    }
};
