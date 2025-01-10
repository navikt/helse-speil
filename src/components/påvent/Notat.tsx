import React, { ReactElement } from 'react';

import { Textarea } from '@navikt/ds-react';

import styles from './PåVentModaler.module.scss';

interface NotatProps {
    notattekst: string | null;
    setNotattekst: (notattekst: string | null) => void;
    valgfri: boolean;
    error: string | null;
}

export const Notat = ({ notattekst, setNotattekst, valgfri, error }: NotatProps): ReactElement => {
    return (
        <Textarea
            className={styles.textarea}
            error={error}
            value={notattekst ?? ''}
            onChange={(event) => setNotattekst(event.target.value)}
            label={`Notat${valgfri ? ' (valgfri)' : ''}`}
            description="Kommer ikke i vedtaksbrevet, men vil bli forevist bruker ved spørsmål om innsyn"
            maxLength={1_000}
        />
    );
};
