import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React, { ReactElement, useState } from 'react';

import { BodyShort, Button, Checkbox, CheckboxGroup, ErrorMessage, Heading, Modal } from '@navikt/ds-react';

import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { Arsak, useArsaker } from '@external/sanity';
import { Maybe, Personnavn, Tildeling } from '@io/graphql';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useEndrePåVent, useLeggPåVent } from '@state/påvent';
import { useOperationErrorHandler } from '@state/varsler';
import { DateString } from '@typer/shared';
import { ISO_DATOFORMAT } from '@utils/date';
import { apolloErrorCode } from '@utils/error';
import { getFormatertNavn } from '@utils/string';

import { Frist } from './Frist';
import { Notat } from './Notat';
import { Årsaker } from './Årsaker';

import styles from './PåVentModaler.module.scss';

type SubmitError = { message: string };
type SubmitResult = 'Success' | SubmitError;

interface LeggPåVentModalProps {
    oppgaveId: string;
    behandlingId?: string;
    navn: Personnavn;
    utgangspunktTildeling: Maybe<Tildeling>;
    onClose: () => void;
}

export const LeggPåVentModal = ({
    oppgaveId,
    behandlingId,
    navn,
    utgangspunktTildeling,
    onClose,
}: LeggPåVentModalProps): ReactElement => {
    const [leggPåVent, { loading: leggPåVentLoading, error: leggPåVentError }] = useLeggPåVent(behandlingId);
    const leggPåVentErrorHandler = useOperationErrorHandler('Legg på vent');

    const onSubmit = async (
        årsaker: Arsak[],
        notattekst: Maybe<string>,
        frist: DateString,
        tildelSaksbehandler: boolean,
    ): Promise<SubmitResult> => {
        await leggPåVent(oppgaveId, frist, tildelSaksbehandler, notattekst, årsaker);
        if (leggPåVentError) {
            leggPåVentErrorHandler(leggPåVentError);
            return {
                message:
                    apolloErrorCode(leggPåVentError) === 401 ? 'Du har blitt logget ut' : 'Kunne ikke legge på vent',
            };
        } else {
            return 'Success';
        }
    };

    return (
        <FellesPåVentModal
            tittel="Legg på vent"
            navn={navn}
            utgangspunktÅrsaker={[]}
            utgangspunktNotattekst={null}
            utgangspunktFrist={null}
            utgangspunktTildeling={utgangspunktTildeling}
            closeModal={onClose}
            submitKnappTekst="Legg på vent"
            onSubmit={onSubmit}
            submitInProgress={leggPåVentLoading}
        />
    );
};

interface EndrePåVentModalProps {
    oppgaveId: string;
    behandlingId?: string;
    navn: Personnavn;
    utgangspunktÅrsaker: string[];
    utgangspunktNotattekst: Maybe<string>;
    utgangspunktFrist: DateString;
    utgangspunktTildeling: Maybe<Tildeling>;
    onClose: () => void;
}

export const EndrePåVentModal = ({
    oppgaveId,
    behandlingId,
    navn,
    utgangspunktÅrsaker,
    utgangspunktNotattekst,
    utgangspunktFrist,
    utgangspunktTildeling,
    onClose,
}: EndrePåVentModalProps): ReactElement => {
    const [endrePåVent, { loading: endrePåVentLoading, error: endrePåVentError }] = useEndrePåVent(behandlingId);
    const endrePåVentErrorHandler = useOperationErrorHandler('Endre på vent');

    const onSubmit = async (
        årsaker: Arsak[],
        notattekst: Maybe<string>,
        frist: DateString,
        tildelSaksbehandler: boolean,
    ): Promise<SubmitResult> => {
        await endrePåVent(oppgaveId, frist, tildelSaksbehandler, notattekst, årsaker);
        if (endrePåVentError) {
            endrePåVentErrorHandler(endrePåVentError);
            return {
                message:
                    apolloErrorCode(endrePåVentError) === 401
                        ? 'Du har blitt logget ut'
                        : 'Endringene kunne ikke lagres',
            };
        } else {
            return 'Success';
        }
    };

    return (
        <FellesPåVentModal
            tittel="Legg på vent &ndash; endre"
            navn={navn}
            utgangspunktÅrsaker={utgangspunktÅrsaker}
            utgangspunktNotattekst={utgangspunktNotattekst}
            utgangspunktFrist={utgangspunktFrist}
            utgangspunktTildeling={utgangspunktTildeling}
            closeModal={onClose}
            submitKnappTekst="Endre"
            onSubmit={onSubmit}
            submitInProgress={endrePåVentLoading}
        />
    );
};

interface FellesPåVentModalProps {
    tittel: string;
    navn: Personnavn;
    utgangspunktÅrsaker: string[];
    utgangspunktNotattekst: Maybe<string>;
    utgangspunktFrist: Maybe<DateString>;
    utgangspunktTildeling: Maybe<Tildeling>;
    submitKnappTekst: string;
    onSubmit: (
        årsaker: Arsak[],
        notattekst: Maybe<string>,
        frist: DateString,
        tildelSaksbehandler: boolean,
    ) => Promise<SubmitResult>;
    submitInProgress: boolean;
    closeModal: () => void;
}

const FellesPåVentModal = ({
    tittel,
    navn,
    utgangspunktÅrsaker,
    utgangspunktNotattekst,
    utgangspunktFrist,
    utgangspunktTildeling,
    submitKnappTekst,
    onSubmit,
    submitInProgress,
    closeModal,
}: FellesPåVentModalProps): ReactElement => {
    const søkernavn = navn ? getFormatertNavn(navn, ['E', ',', 'F', 'M']) : undefined;
    const router = useRouter();
    const saksbehandler = useInnloggetSaksbehandler();
    const { arsaker: årsaker, loading: årsakerLoading } = useArsaker('paventarsaker');

    const [valgteÅrsaker, setValgteÅrsaker] = useState<Array<string>>(utgangspunktÅrsaker);
    const [valgteÅrsakerError, setValgteÅrsakerError] = useState<Maybe<string>>(null);
    const [notattekst, setNotattekst] = useState<Maybe<string>>(utgangspunktNotattekst);
    const [notatError, setNotatError] = useState<Maybe<string>>(null);
    const [fristDato, setFristDato] = useState<Maybe<Date>>(
        utgangspunktFrist ? dayjs(utgangspunktFrist, ISO_DATOFORMAT).toDate() : null,
    );
    const [fristError, setFristError] = useState<Maybe<string>>(null);
    const [tildelSaksbehandler, setTildelSaksbehandler] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<Maybe<string>>(null);

    const opprinneligTildeltSaksbehandler = utgangspunktTildeling
        ? utgangspunktTildeling.oid === saksbehandler.oid
        : false;

    const validateNotat = (notattekst: Maybe<string>, valgteÅrsaker: Array<string>) => {
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
            setFristError('Frist må være satt');
            error = true;
        }
        return error;
    };

    const validate = () => {
        const årsakerInvalid = validateÅrsaker(valgteÅrsaker);
        const notatInvalid = validateNotat(notattekst, valgteÅrsaker);
        const fristInvalid = validateFrist();
        return årsakerInvalid || notatInvalid || fristInvalid;
    };

    const submit = async () => {
        const error = validate();
        if (error) {
            return;
        }
        const result = await onSubmit(
            årsaker[0]!.arsaker!.filter((it) => valgteÅrsaker.includes(it.arsak)),
            notattekst,
            dayjs(fristDato).format(ISO_DATOFORMAT),
            tildelSaksbehandler,
        );
        if (result === 'Success') {
            router.push('/');
        } else {
            setErrorMessage(result.message);
        }
        closeModal();
    };

    const årsakAnnetErValgt = (valgteÅrsaker: Array<string>) => valgteÅrsaker.includes('Annet');

    return (
        <Modal aria-label="På vent-modal" portal closeOnBackdropClick open={true} onClose={closeModal}>
            <Modal.Header>
                <Heading level="1" size="medium" className={styles.tittel}>
                    {tittel}
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
                <Frist
                    fristDato={fristDato}
                    setFristDato={(fristDato) => {
                        setFristDato(fristDato);
                        if (fristError) validateFrist();
                    }}
                    error={fristError}
                    setError={setFristError}
                />
                <CheckboxGroup
                    legend="Tildeling"
                    hideLegend
                    onChange={(values) => setTildelSaksbehandler(values.length > 0)}
                    value={tildelSaksbehandler ? ['tildel_saksbehandler'] : []}
                >
                    <Checkbox className={styles.tildeling} value="tildel_saksbehandler">
                        {opprinneligTildeltSaksbehandler ? 'Behold tildeling' : 'Tildel meg'}
                    </Checkbox>
                </CheckboxGroup>
                {!tildelSaksbehandler && <BodyShort>Uten tildeling vil oppgaven kunne bli automatisert</BodyShort>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" type="button" loading={submitInProgress} onClick={submit}>
                    {submitKnappTekst}
                </Button>
                <Button variant="tertiary" type="button" onClick={closeModal}>
                    Avbryt
                </Button>
                {errorMessage && <ErrorMessage className={styles.errormessage}>{errorMessage}</ErrorMessage>}
            </Modal.Footer>
        </Modal>
    );
};
