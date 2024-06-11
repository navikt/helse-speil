import React, { PropsWithChildren, ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Tag } from '@components/Tag';

const BaseCell = ({ children }: PropsWithChildren): ReactElement => {
    return <BodyShort size="small">{children}</BodyShort>;
};

const EnArbeidsgiver = (): ReactElement => {
    return (
        <BaseCell>
            <Tag color="purple">EA</Tag>
            ÉN ARB. GIVER
        </BaseCell>
    );
};

const FlereArbeidsgivere = (): ReactElement => {
    return (
        <BaseCell>
            <Tag color="purple">FA</Tag>
            FLERE ARB. GIVERE
        </BaseCell>
    );
};

const Førstegangsbehandling = (): ReactElement => {
    return (
        <BaseCell>
            <Tag color="purple">F</Tag>
            FØRSTEGANGSBEH.
        </BaseCell>
    );
};

const Forlengelser = (): ReactElement => {
    return (
        <BaseCell>
            <Tag color="blue">FL</Tag>
            FORLENGELSER
        </BaseCell>
    );
};

const ForlengelseInfotrygd = (): ReactElement => {
    return (
        <BaseCell>
            <Tag color="gray">FI</Tag>
            FORLENGELSE - IT
        </BaseCell>
    );
};

const Vurderingsoppgaver = (): ReactElement => {
    return (
        <BaseCell>
            <Tag color="orange">QA</Tag>
            VURDERINGSOPPGAVER
        </BaseCell>
    );
};

const FortroligAdresse = (): ReactElement => {
    return (
        <BaseCell>
            <Tag color="red">FA</Tag>
            FORTROLIG ADRESSE
        </BaseCell>
    );
};

const Stikkprøver = (): ReactElement => {
    return (
        <BaseCell>
            <Tag color="red">S</Tag>
            STIKKPRØVER
        </BaseCell>
    );
};

const Revurdering = (): ReactElement => {
    return (
        <BaseCell>
            <Tag color="orange">R</Tag>
            REVURDERING
        </BaseCell>
    );
};

const Beslutter = (): ReactElement => {
    return (
        <BaseCell>
            <Tag color="orange">B</Tag>
            BESLUTTER
        </BaseCell>
    );
};

const EgenAnsatt = (): ReactElement => {
    return (
        <BaseCell>
            <Tag color="orange">E</Tag>
            EGEN ANSATT
        </BaseCell>
    );
};
const Søknad = (): ReactElement => {
    return (
        <BaseCell>
            <Tag color="orange">SØ</Tag>
            SØKNAD
        </BaseCell>
    );
};

export const LabelCell = {
    EnArbeidsgiver,
    FlereArbeidsgivere,
    Førstegangsbehandling,
    Forlengelser,
    ForlengelseInfotrygd,
    Vurderingsoppgaver,
    FortroligAdresse,
    Stikkprøver,
    Revurdering,
    Beslutter,
    EgenAnsatt,
    Søknad,
};
