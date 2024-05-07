import styles from './BegrunnelseVedtak.module.scss';
import classNames from 'classnames';
import React, { Dispatch, SetStateAction } from 'react';

import { DocPencilIcon, XMarkIcon } from '@navikt/aksel-icons';
import { BodyShort, Textarea } from '@navikt/ds-react';

import { Avslagstype } from '@io/graphql';

interface BegrunnelseVedtakProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    avslagstype: Avslagstype;
    begrunnelse: string;
    setBegrunnelse: Dispatch<SetStateAction<string>>;
}

export const BegrunnelseVedtak = ({
    open,
    setOpen,
    avslagstype,
    begrunnelse,
    setBegrunnelse,
}: BegrunnelseVedtakProps) => {
    return (
        <div className={classNames(styles.container, open && styles.open)}>
            {open && (
                <div className={styles.top}>
                    <button className={styles.lukk} onClick={() => setOpen(false)}>
                        <XMarkIcon />
                    </button>
                </div>
            )}
            <div className={styles.header} onClick={() => !open && setOpen(true)}>
                <div className={classNames(styles['ikon-container'], open && styles.open)}>
                    <DocPencilIcon title="Skriv begrunnelse" />
                </div>
                <BodyShort
                    className={classNames(styles.tekst, open && styles.open)}
                    onClick={() => !open && setOpen(true)}
                >
                    {knappetekst(avslagstype)}
                </BodyShort>
            </div>

            {open && (
                <Textarea
                    label=""
                    id="begrunnelse"
                    value={begrunnelse}
                    onChange={(event) => {
                        setBegrunnelse(event.target.value);
                    }}
                    description="(Teksten vises til brukeren i melding om vedtak)"
                    aria-labelledby="begrunnelse-label begrunnelse-feil"
                    style={{ whiteSpace: 'pre-line' }}
                    className={styles.begrunnelse}
                />
            )}
        </div>
    );
};

const knappetekst = (avslagstype: Avslagstype) => {
    switch (avslagstype) {
        case Avslagstype.DelvisAvslag:
            return 'Skriv begrunnelse for delvis innvilgelse';
        case Avslagstype.Avslag:
            return 'Skriv begrunnelse for avslag';
    }
};
