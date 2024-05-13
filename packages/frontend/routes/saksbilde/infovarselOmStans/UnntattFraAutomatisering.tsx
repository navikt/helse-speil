import React, { FormEvent, useRef, useState } from 'react';

import { Alert, BodyShort, Button, Loader, Textarea } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { useOpphevStans } from '@state/opphevStans';
import { useAddToast } from '@state/toasts';
import { getFormattedDatetimeString } from '@utils/date';

import styles from './UnntattFraAutomatisering.module.css';

interface UnntattFraAutomatiseringProps {
    årsaker: string[];
    tidspunkt: string;
    fødselsnummer: string;
}

export const UnntattFraAutomatisering = ({ årsaker, tidspunkt, fødselsnummer }: UnntattFraAutomatiseringProps) => {
    const [opphevStans, { error, loading }] = useOpphevStans();
    const [åpen, setÅpen] = useState(false);
    const textArea = useRef<HTMLTextAreaElement>(null);
    const addToast = useAddToast();

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        await opphevStans(fødselsnummer, textArea.current?.value ?? '').then(() => {
            addToast({ key: 'opphevStans', message: 'Stans opphevet', timeToLiveMs: 3000 });
        });
    };

    return (
        <Alert variant="info" className={styles.unntatt}>
            <Bold>Automatisk behandling stanset av veileder</Bold>
            <div className={styles.luft}>
                <BodyShort>
                    <span style={{ fontWeight: 600 }}>Årsak til stans: </span>
                    {årsakerSomTekst(årsaker)}
                </BodyShort>
                <BodyShort>
                    <span style={{ fontWeight: 600 }}>Dato: </span>
                    {getFormattedDatetimeString(tidspunkt)}
                </BodyShort>
            </div>
            {!åpen && (
                <div>
                    <Button size="xsmall" onClick={() => setÅpen(true)}>
                        Opphev stans
                    </Button>
                </div>
            )}
            {åpen && (
                <form onSubmit={submit}>
                    <Textarea
                        label="Begrunn oppheving av stans"
                        description="Kommer ikke i vedtaksbrevet, men vil bli forevist bruker ved spørsmål om innsyn"
                        ref={textArea}
                    />
                    <div className={styles.knapper}>
                        <Button size="xsmall" onClick={() => setÅpen(true)}>
                            Opphev stans
                            {loading && <Loader size="xsmall" />}
                        </Button>
                        <Button variant="secondary" size="xsmall" onClick={() => setÅpen(false)}>
                            Avbryt
                        </Button>
                    </div>
                </form>
            )}
            {error && (
                <BodyShort as="p" className={styles.feilmelding}>
                    Noe gikk galt. Prøv igjen senere eller kontakt en utvikler.
                </BodyShort>
            )}
        </Alert>
    );
};

const årsakerSomTekst = (årsaker: string[]) => {
    let returString = '';
    årsaker.forEach((årsak, i, arr) => {
        returString += årsakSomTekst(årsak);
        if (i !== arr.length - 1) {
            returString += ', ';
        }
    });
    return returString;
};

const årsakSomTekst = (årsak: string) => {
    switch (årsak) {
        case 'MEDISINSK_VILKAR':
            return 'Medisinsk vilkår';
        case 'AKTIVITETSKRAV':
            return 'Aktivitetskrav';
        case 'MANGLENDE_MEDVIRKNING':
            return 'Manglende medvirkning';
        default:
            return 'Ukjent årsak';
    }
};
