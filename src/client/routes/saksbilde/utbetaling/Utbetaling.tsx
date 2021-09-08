import styled from '@emotion/styled';
import { Dayjs } from 'dayjs';
import { Vedtaksperiode } from 'internal-types';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Feilmelding } from 'nav-frontend-typografi';

import { AgurkErrorBoundary } from '../../../components/AgurkErrorBoundary';
import { FlexColumn } from '../../../components/Flex';
import { OverstyringTimeoutModal } from '../../../components/OverstyringTimeoutModal';
import { Tidslinjeperiode } from '../../../modell/utbetalingshistorikkelement';

import { Utbetalingstabell } from './utbetalingstabell/Utbetalingstabell';
import { usePostOverstyring } from './utbetalingstabell/usePostOverstyring';

const FeilmeldingContainer = styled.div`
    margin-top: 1rem;
`;

const UtbetalingstabellContainer = styled(FlexColumn)`
    position: relative;
    height: 100%;
`;

export interface UtbetalingProps {
    periode: Tidslinjeperiode;
    vedtaksperiode: Vedtaksperiode;
    maksdato?: Dayjs;
    gjenståendeDager?: number;
}

export const Utbetaling = ({ gjenståendeDager, maksdato, periode, vedtaksperiode }: UtbetalingProps) => {
    const form = useForm({ mode: 'onBlur', shouldFocusError: false });

    const [overstyrer, setOverstyrer] = useState(false);
    const { postOverstyring, error, state } = usePostOverstyring();

    return (
        <AgurkErrorBoundary sidenavn="Utbetaling">
            <FlexColumn style={{ paddingBottom: '4rem' }}>
                <UtbetalingstabellContainer>
                    <FormProvider {...form}>
                        <form>
                            <Utbetalingstabell
                                maksdato={maksdato}
                                overstyringer={vedtaksperiode.overstyringer}
                                overstyrer={overstyrer}
                                toggleOverstyring={() => setOverstyrer((old) => !old)}
                                gjenståendeDager={gjenståendeDager}
                                periode={periode}
                            />
                        </form>
                    </FormProvider>
                </UtbetalingstabellContainer>
                {state === 'timedOut' && <OverstyringTimeoutModal onRequestClose={() => null} />}
                {state === 'hasError' && (
                    <FeilmeldingContainer>
                        {error && <Feilmelding role="alert">{error}</Feilmelding>}
                    </FeilmeldingContainer>
                )}
            </FlexColumn>
        </AgurkErrorBoundary>
    );
};
