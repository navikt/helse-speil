import React, { FormEvent, useRef, useState } from 'react';

import { Alert, BodyShort, Button, Textarea, Tooltip } from '@navikt/ds-react';

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
    const [submitting, setSubmitting] = useState(false);
    const textArea = useRef<HTMLTextAreaElement>(null);
    const addToast = useAddToast();

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        setSubmitting(true);
        await opphevStans(fødselsnummer, textArea.current?.value ?? '').then(() => {
            addToast({ key: 'opphevStans', message: 'Stans opphevet', timeToLiveMs: 3000 });
        });
    };

    return (
        <Alert variant="info" className={styles.unntatt}>
            <Bold>Automatisk behandling stanset av veileder</Bold>
            <div className={styles.luft}>
                <BodyShort>
                    <Tooltip content={`Stansknappen ble trykket ${getFormattedDatetimeString(tidspunkt)}`}>
                        <span style={{ fontWeight: 600 }}>Årsak til stans: </span>
                    </Tooltip>
                    {årsakerSomTekst(årsaker)}
                </BodyShort>
                <BodyShort>Se i Modia Sykefraværsoppfølging for mer info om denne personen.</BodyShort>
            </div>
            {!åpen && (
                <div>
                    <Button size="small" variant="primary" type="button" onClick={() => setÅpen(true)}>
                        Opphev stans
                    </Button>
                </div>
            )}
            {åpen && (
                <form onSubmit={submit}>
                    <Textarea
                        label="Begrunn oppheving av stans"
                        description="Teksten vises ikke til den sykmeldte, med mindre hen ber om innsyn"
                        ref={textArea}
                    />
                    <div className={styles.buttons}>
                        <Button size="small" variant="primary" type="submit" loading={loading || submitting}>
                            Opphev stans
                        </Button>
                        <Button size="small" variant="tertiary" type="button" onClick={() => setÅpen(false)}>
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
        // Årsakene under er avviklet hos iSyfo, men siden vi skal lese inn gamle stoppknapp-meldinger kan
        // vi få inn noen med disse årsakene også
        case 'BESTRIDELSE_SYKMELDING':
            return 'Bestridelse sykmelding';
        case 'TILBAKEDATERT_SYKMELDING':
            return 'Tilbakedatert sykmelding';
        default:
            return 'Ukjent årsak';
    }
};
