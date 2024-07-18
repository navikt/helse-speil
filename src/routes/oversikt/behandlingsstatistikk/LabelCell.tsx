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
            Én arb. giver
        </BaseCell>
    );
};

const FlereArbeidsgivere = (): ReactElement => {
    return (
        <BaseCell>
            <Tag color="purple">FA</Tag>
            Flere arb. givere
        </BaseCell>
    );
};

const Førstegangsbehandling = (): ReactElement => {
    return (
        <BaseCell>
            <Tag color="purple">F</Tag>
            Førstegangsbeh.
        </BaseCell>
    );
};

const Forlengelser = (): ReactElement => {
    return (
        <BaseCell>
            <Tag color="blue">FL</Tag>
            Forlengelser
        </BaseCell>
    );
};

const ForlengelseInfotrygd = (): ReactElement => {
    return (
        <BaseCell>
            <Tag color="gray">FI</Tag>
            Forlengelse - IT
        </BaseCell>
    );
};

const Vurderingsoppgaver = (): ReactElement => {
    return (
        <BaseCell>
            <Tag color="orange">QA</Tag>
            Vurderingsoppgaver
        </BaseCell>
    );
};

const FortroligAdresse = (): ReactElement => {
    return (
        <BaseCell>
            <Tag color="red">FA</Tag>
            Fortrolig adresse
        </BaseCell>
    );
};

const Stikkprøver = (): ReactElement => {
    return (
        <BaseCell>
            <Tag color="red">S</Tag>
            Stikkprøver
        </BaseCell>
    );
};

const Revurdering = (): ReactElement => {
    return (
        <BaseCell>
            <Tag color="orange">R</Tag>
            Revurdering
        </BaseCell>
    );
};

const Beslutter = (): ReactElement => {
    return (
        <BaseCell>
            <Tag color="orange">B</Tag>
            Beslutter
        </BaseCell>
    );
};

const EgenAnsatt = (): ReactElement => {
    return (
        <BaseCell>
            <Tag color="orange">E</Tag>
            Egen ansatt
        </BaseCell>
    );
};
const Søknad = (): ReactElement => {
    return (
        <BaseCell>
            <Tag color="orange">SØ</Tag>
            Søknad
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
