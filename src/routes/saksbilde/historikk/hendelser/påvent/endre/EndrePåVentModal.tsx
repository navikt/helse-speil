import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React, { ReactElement, useState } from 'react';

import { BodyShort, Button, Checkbox, CheckboxGroup, ErrorMessage, Heading, Modal } from '@navikt/ds-react';

import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { useArsaker } from '@external/sanity';
import { Maybe, Personnavn, Tildeling } from '@io/graphql';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useOppdaterPåVentFrist } from '@state/påvent';
import { useOperationErrorHandler } from '@state/varsler';
import { DateString } from '@typer/shared';
import { ISO_DATOFORMAT } from '@utils/date';
import { apolloErrorCode } from '@utils/error';
import { getFormatertNavn } from '@utils/string';

import { Frist } from './Frist';
import { Notat } from './Notat';
import { Årsaker } from './Årsaker';

import styles from './EndrePåVentModal.module.scss';

interface EndrePåVentModalProps {
    onClose: () => void;
    navn: Personnavn;
    oppgaveId: string;
    tildeling: Maybe<Tildeling>;
    periodeId?: string;
    opprinneligeÅrsaker: string[];
    opprinneligNotattekst: Maybe<string>;
    opprinneligFrist: Maybe<DateString>;
}

export const EndrePåVentModal = ({
    onClose,
    navn,
    oppgaveId,
    tildeling,
    periodeId,
    opprinneligeÅrsaker,
    opprinneligNotattekst,
    opprinneligFrist,
}: EndrePåVentModalProps): ReactElement => {
    const søkernavn = navn ? getFormatertNavn(navn, ['E', ',', 'F', 'M']) : undefined;
    const [oppdaterPåVentFrist, { loading, error: oppdaterPåVentFristError }] = useOppdaterPåVentFrist(periodeId);
    const errorHandler = useOperationErrorHandler('Endre på vent');
    const router = useRouter();
    const saksbehandler = useInnloggetSaksbehandler();
    const { arsaker: årsaker, loading: årsakerLoading } = useArsaker('paventarsaker');

    const [valgteÅrsaker, setValgteÅrsaker] = useState<Array<string>>(opprinneligeÅrsaker);
    const [valgteÅrsakerError, setValgteÅrsakerError] = useState<string | null>(null);
    const [notattekst, setNotattekst] = useState<string | null>(opprinneligNotattekst);
    const [notatError, setNotatError] = useState<string | null>(null);
    const [fristDato, setFristDato] = useState<Date | null>(dayjs(opprinneligFrist, ISO_DATOFORMAT).toDate());
    const [tildelSaksbehandler, setTildelSaksbehandler] = useState<boolean>(true);
    const opprinneligTildeltSaksbehandler = tildeling ? tildeling.oid === saksbehandler.oid : false;

    const validateNotat = (notattekst: string | null, valgteÅrsaker: Array<string>) => {
        let error = false;
        if (årsakAnnetErValgt(valgteÅrsaker) && (notattekst === null || notattekst?.length == 0)) {
            setNotatError('Notat må fylles ut');
            error = true;
        }
        if (notattekst && notattekst.length > 1000) {
            setNotatError('Det er kun tillatt med 1000 tegn');
            error = true;
        }
        if (!error) {
            setNotatError(null);
        }
        return error;
    };

    const validateÅrsaker = (valgteÅrsaker: Array<string>) => {
        let error = false;
        if (!årsaker?.[0]?.arsaker?.some((it) => valgteÅrsaker.includes(it.arsak))) {
            setValgteÅrsakerError('Velg minst én årsak');
            error = true;
        }
        if (!error) {
            setValgteÅrsakerError(null);
        }
        return error;
    };

    const validateFrist = () => {
        let error = false;
        if (!fristDato) {
            error = true;
        }
        return error;
    };

    const validate = () => {
        return validateÅrsaker(valgteÅrsaker) || validateNotat(notattekst, valgteÅrsaker) || validateFrist();
    };

    const onLeggPåVent = async () => {
        let error = validate();
        if (error) {
            return;
        }
        await oppdaterPåVentFrist(
            oppgaveId,
            dayjs(fristDato).format(ISO_DATOFORMAT),
            tildelSaksbehandler,
            notattekst,
            årsaker[0]!.arsaker!.filter((it) => valgteÅrsaker.includes(it.arsak)),
        );
        if (oppdaterPåVentFristError) {
            errorHandler(oppdaterPåVentFristError);
        } else {
            router.push('/');
        }
        onClose();
    };

    const errorMessage: string | undefined =
        oppdaterPåVentFristError !== undefined
            ? apolloErrorCode(oppdaterPåVentFristError) === 401
                ? 'Du har blitt logget ut'
                : 'Endringene kunne ikke lagres'
            : undefined;

    const årsakAnnetErValgt = (valgteÅrsaker: Array<string>) => valgteÅrsaker.includes('Annet');

    return (
        <Modal aria-label="Endre på vent modal" portal closeOnBackdropClick open={true} onClose={onClose}>
            <Modal.Header>
                <Heading level="1" size="medium" className={styles.tittel}>
                    Legg på vent &ndash; endre
                </Heading>
                {søkernavn && <AnonymizableText size="small">{`Søker: ${søkernavn}`}</AnonymizableText>}
            </Modal.Header>
            <Modal.Body>
                <div className={styles.påventårsak}>
                    <Årsaker
                        årsaker={årsaker?.[0]?.arsaker}
                        årsakerLoading={årsakerLoading}
                        valgteÅrsaker={valgteÅrsaker}
                        setValgteÅrsaker={(valgteÅrsaker) => {
                            setValgteÅrsaker(valgteÅrsaker);
                            if (valgteÅrsakerError) validateÅrsaker(valgteÅrsaker);
                            if (notatError) validateNotat(notattekst, valgteÅrsaker);
                        }}
                        error={valgteÅrsakerError}
                    />
                    <Notat
                        notattekst={notattekst}
                        setNotattekst={(notattekst) => {
                            setNotattekst(notattekst);
                            if (notatError) validateNotat(notattekst, valgteÅrsaker);
                        }}
                        valgfri={!årsakAnnetErValgt(valgteÅrsaker)}
                        error={notatError}
                    />
                </div>
                <Frist fristDato={fristDato} setFristDato={setFristDato} />
                <CheckboxGroup
                    legend="Tildeling"
                    hideLegend
                    onChange={(values) => setTildelSaksbehandler(values.length > 0)}
                    value={tildelSaksbehandler ? ['tildel_saksbehandler'] : []}
                >
                    <Checkbox defaultChecked className={styles.tildeling} value="tildel_saksbehandler">
                        {opprinneligTildeltSaksbehandler ? 'Behold tildeling' : 'Tildel meg'}
                    </Checkbox>
                </CheckboxGroup>
                {!tildelSaksbehandler && <BodyShort>Uten tildeling vil saken kunne bli automatisert</BodyShort>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" type="button" loading={loading} onClick={onLeggPåVent}>
                    Endre
                </Button>
                <Button variant="tertiary" type="button" onClick={onClose}>
                    Avbryt
                </Button>
                {errorMessage && <ErrorMessage className={styles.errormessage}>{errorMessage}</ErrorMessage>}
            </Modal.Footer>
        </Modal>
    );
};
