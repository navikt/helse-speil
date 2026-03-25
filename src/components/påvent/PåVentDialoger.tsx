import dayjs from 'dayjs';
import React, { ReactElement } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';

import { BodyShort, Button, Checkbox, Dialog, ErrorMessage } from '@navikt/ds-react';

import { PåVentSkjema, påVentSkjema } from '@/form-schemas/påVentSkjema';
import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { useArsaker } from '@external/sanity';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePutPåVent } from '@io/rest/generated/oppgaver/oppgaver';
import { ApiPersonnavn, ApiTildeling } from '@io/rest/generated/spesialist.schemas';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { DateString } from '@typer/shared';
import { ISO_DATOFORMAT } from '@utils/date';
import { getFormatertNavn } from '@utils/string';

import { Arsaker } from './Arsaker';
import { Frist } from './Frist';
import { Notat } from './Notat';

interface LeggPåVentDialogProps {
    oppgaveId: string;
    navn: ApiPersonnavn;
    utgangspunktTildeling: ApiTildeling | null;
    onClose: () => void;
    onLeggPåVentSuccess: () => void;
}

export const LeggPåVentDialog = ({
    oppgaveId,
    navn,
    utgangspunktTildeling,
    onClose,
    onLeggPåVentSuccess,
}: LeggPåVentDialogProps): ReactElement => {
    return (
        <Dialog
            open
            onOpenChange={(nextOpen) => {
                if (!nextOpen) onClose();
            }}
        >
            <PåVentDialogInnhold
                tittel="Legg på vent"
                navn={navn}
                utgangspunktÅrsaker={[]}
                utgangspunktNotattekst=""
                utgangspunktFrist={null}
                utgangspunktTildeling={utgangspunktTildeling}
                submitKnappTekst="Legg på vent"
                onSuccess={() => {
                    onLeggPåVentSuccess();
                    onClose();
                }}
                oppgaveId={oppgaveId}
            />
        </Dialog>
    );
};

interface EndrePåVentDialogProps {
    oppgaveId: string;
    navn: ApiPersonnavn;
    utgangspunktÅrsaker: string[];
    utgangspunktNotattekst: string | null;
    utgangspunktFrist: DateString;
    utgangspunktTildeling: ApiTildeling | null;
    onClose: () => void;
    onLeggPåVentSuccess: () => void;
}

export const EndrePåVentDialog = ({
    oppgaveId,
    navn,
    utgangspunktÅrsaker,
    utgangspunktNotattekst,
    utgangspunktFrist,
    utgangspunktTildeling,
    onClose,
    onLeggPåVentSuccess,
}: EndrePåVentDialogProps): ReactElement => {
    return (
        <Dialog
            open
            onOpenChange={(nextOpen) => {
                if (!nextOpen) onClose();
            }}
        >
            <PåVentDialogInnhold
                tittel="Legg på vent &ndash; endre"
                navn={navn}
                utgangspunktÅrsaker={utgangspunktÅrsaker}
                utgangspunktNotattekst={utgangspunktNotattekst ?? ''}
                utgangspunktFrist={utgangspunktFrist}
                utgangspunktTildeling={utgangspunktTildeling}
                submitKnappTekst="Endre"
                onSuccess={() => {
                    onLeggPåVentSuccess();
                    onClose();
                }}
                oppgaveId={oppgaveId}
            />
        </Dialog>
    );
};

interface PåVentDialogInnholdProps {
    tittel: string;
    navn: ApiPersonnavn;
    oppgaveId: string;
    utgangspunktÅrsaker: string[];
    utgangspunktNotattekst: string;
    utgangspunktFrist: DateString | null;
    utgangspunktTildeling: ApiTildeling | null;
    submitKnappTekst: string;
    onSuccess: () => void;
}

const PåVentDialogInnhold = ({
    tittel,
    navn,
    oppgaveId,
    utgangspunktÅrsaker,
    utgangspunktNotattekst,
    utgangspunktFrist,
    utgangspunktTildeling,
    submitKnappTekst,
    onSuccess,
}: PåVentDialogInnholdProps): ReactElement => {
    const søkernavn = navn ? getFormatertNavn(navn, ['E', ',', 'F', 'M']) : undefined;
    const saksbehandler = useInnloggetSaksbehandler();
    const { arsaker: årsaker, loading: årsakerLoading } = useArsaker('paventarsaker');
    const { mutateAsync, error } = usePutPåVent();

    const opprinneligTildeltSaksbehandler = utgangspunktTildeling
        ? utgangspunktTildeling.oid === saksbehandler.oid
        : false;

    const form = useForm<PåVentSkjema>({
        resolver: zodResolver(påVentSkjema),
        defaultValues: {
            årsaker: utgangspunktÅrsaker,
            notattekst: utgangspunktNotattekst,
            frist: utgangspunktFrist ? dayjs(utgangspunktFrist, ISO_DATOFORMAT).toDate() : undefined,
            skalTildeles: true,
        },
    });

    const valgteÅrsaker = useWatch({ name: 'årsaker', control: form.control });
    const skalTildeles = useWatch({ name: 'skalTildeles', control: form.control });

    async function onSubmit(values: PåVentSkjema) {
        const sanityÅrsaker = årsaker?.[0]?.arsaker ?? [];
        const filteredÅrsaker = sanityÅrsaker.filter((it) => values.årsaker.includes(it.arsak));

        await mutateAsync(
            {
                oppgaveId: Number.parseInt(oppgaveId),
                data: {
                    frist: dayjs(values.frist).format(ISO_DATOFORMAT),
                    skalTildeles: values.skalTildeles,
                    notattekst: values.notattekst || null,
                    årsaker: filteredÅrsaker.map((arsak) => ({ key: arsak._key, årsak: arsak.arsak })),
                },
            },
            {
                onSuccess: () => {
                    onSuccess();
                },
            },
        );
    }

    return (
        <Dialog.Popup width="large">
            <Dialog.Header>
                <Dialog.Title>{tittel}</Dialog.Title>
                {søkernavn && <AnonymizableText size="small">{`Søker: ${søkernavn}`}</AnonymizableText>}
            </Dialog.Header>
            <Dialog.Body>
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} id="på-vent-form">
                        <Arsaker årsaker={årsaker?.[0]?.arsaker} årsakerLoading={årsakerLoading} />
                        <Notat valgfri={!valgteÅrsaker.includes('Annet')} />
                        <Frist />
                        <Controller
                            control={form.control}
                            name="skalTildeles"
                            render={({ field }) => (
                                <Checkbox
                                    className="mt-4"
                                    checked={field.value}
                                    onChange={(e) => field.onChange(e.target.checked)}
                                >
                                    {opprinneligTildeltSaksbehandler ? 'Behold tildeling' : 'Tildel meg'}
                                </Checkbox>
                            )}
                        />
                        {!skalTildeles && <BodyShort>Uten tildeling vil oppgaven kunne bli automatisert</BodyShort>}
                    </form>
                </FormProvider>
            </Dialog.Body>
            <Dialog.Footer>
                {error && (
                    <ErrorMessage className="mr-auto self-center">
                        {error.status === 401 ? 'Du har blitt logget ut' : 'Kunne ikke legge på vent'}
                    </ErrorMessage>
                )}
                <Dialog.CloseTrigger>
                    <Button variant="tertiary" type="button" disabled={form.formState.isSubmitting}>
                        Avbryt
                    </Button>
                </Dialog.CloseTrigger>
                <Button variant="primary" type="submit" form="på-vent-form" loading={form.formState.isSubmitting}>
                    {submitKnappTekst}
                </Button>
            </Dialog.Footer>
        </Dialog.Popup>
    );
};
