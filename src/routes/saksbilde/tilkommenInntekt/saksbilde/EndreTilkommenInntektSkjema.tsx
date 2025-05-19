import { useRouter } from 'next/navigation';
import React, { Dispatch, ReactElement, SetStateAction, useState } from 'react';

import { XMarkIcon } from '@navikt/aksel-icons';
import { Box, Button, HStack } from '@navikt/ds-react';

import { TilkommenInntektSchema } from '@/form-schemas';
import { PersonFragment } from '@io/graphql';
import { TilkommenInntektSkjema } from '@saksbilde/tilkommenInntekt/skjema/TilkommenInntektSkjema';
import { TilkommenInntektMedOrganisasjonsnummer } from '@state/tilkommenInntekt';
import { DateString } from '@typer/shared';

interface Props {
    tilkommenInntekt: TilkommenInntektMedOrganisasjonsnummer;
    andreTilkomneInntekter: TilkommenInntektMedOrganisasjonsnummer[];
    person: PersonFragment;
    ekskluderteUkedager: DateString[];
    setEkskluderteUkedager: Dispatch<SetStateAction<DateString[]>>;
    submit: (values: TilkommenInntektSchema) => Promise<void>;
}

export const EndreTilkommenInntektSkjema = ({
    tilkommenInntekt,
    andreTilkomneInntekter,
    person,
    ekskluderteUkedager,
    setEkskluderteUkedager,
    submit,
}: Props): ReactElement => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const router = useRouter();

    const handleSubmit = async (values: TilkommenInntektSchema) => {
        setIsSubmitting(true);
        await submit(values);
    };
    return (
        <Box marginBlock="4" width="max-content">
            <Box background={'surface-subtle'} borderWidth="0 0 0 3" borderColor="border-action">
                <HStack style={{ paddingLeft: '5px' }} paddingBlock="2 0">
                    <Button
                        icon={<XMarkIcon />}
                        size="xsmall"
                        variant="tertiary"
                        type="button"
                        onClick={() => router.back()}
                        disabled={isSubmitting}
                    >
                        Avbryt
                    </Button>
                </HStack>
            </Box>

            <TilkommenInntektSkjema
                person={person}
                andreTilkomneInntekter={andreTilkomneInntekter}
                startOrganisasjonsnummer={tilkommenInntekt.organisasjonsnummer}
                startFom={tilkommenInntekt.periode.fom}
                startTom={tilkommenInntekt.periode.tom}
                startPeriodebeløp={Number(tilkommenInntekt.periodebelop)}
                ekskluderteUkedager={ekskluderteUkedager}
                setEkskluderteUkedager={setEkskluderteUkedager}
                isSubmitting={isSubmitting}
                handleSubmit={handleSubmit}
            />
        </Box>
    );
};
