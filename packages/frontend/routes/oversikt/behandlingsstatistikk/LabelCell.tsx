import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Tag } from '@components/Tag';

const BaseCell: React.FC<ChildrenProps> = ({ children }) => {
    return <BodyShort size="small">{children}</BodyShort>;
};

const EnArbeidsgiver: React.FC = () => {
    return (
        <BaseCell>
            <Tag color="purple">EA</Tag>
            ÉN ARB. GIVER
        </BaseCell>
    );
};

const FlereArbeidsgivere: React.FC = () => {
    return (
        <BaseCell>
            <Tag color="purple">FA</Tag>
            FLERE ARB. GIVERE
        </BaseCell>
    );
};

const Førstegangsbehandling: React.FC = () => {
    return (
        <BaseCell>
            <Tag color="purple">F</Tag>
            FØRSTEGANGSBEH.
        </BaseCell>
    );
};

const Forlengelser: React.FC = () => {
    return (
        <BaseCell>
            <Tag color="blue">FL</Tag>
            FORLENGELSER
        </BaseCell>
    );
};

const ForlengelseInfotrygd: React.FC = () => {
    return (
        <BaseCell>
            <Tag color="gray">FI</Tag>
            FORLENGELSE - IT
        </BaseCell>
    );
};

const UtbetalingTilArbeidsgiver: React.FC = () => {
    return (
        <BaseCell>
            <Tag color="green">UA</Tag>
            UTBET. TIL ARBEIDSGIVER
        </BaseCell>
    );
};

const UtbetalingTilSykmeldt: React.FC = () => {
    return (
        <BaseCell>
            <Tag color="green">US</Tag>
            UTBET. TIL SYKMELDT
        </BaseCell>
    );
};

const DelvisRefusjon: React.FC = () => {
    return (
        <BaseCell>
            <Tag color="green">DR</Tag>
            DELVIS REFUSJON
        </BaseCell>
    );
};

const Vurderingsoppgaver: React.FC = () => {
    return (
        <BaseCell>
            <Tag color="orange">QA</Tag>
            VURDERINGSOPPGAVER
        </BaseCell>
    );
};

const FortroligAdresse: React.FC = () => {
    return (
        <BaseCell>
            <Tag color="red">FA</Tag>
            FORTROLIG ADRESSE
        </BaseCell>
    );
};

const Stikkprøver: React.FC = () => {
    return (
        <BaseCell>
            <Tag color="red">S</Tag>
            STIKKPRØVER
        </BaseCell>
    );
};

const Revurdering: React.FC = () => {
    return (
        <BaseCell>
            <Tag color="orange">R</Tag>
            REVURDERING
        </BaseCell>
    );
};

const Beslutter: React.FC = () => {
    return (
        <BaseCell>
            <Tag color="orange">B</Tag>
            BESLUTTER
        </BaseCell>
    );
};
const Søknad: React.FC = () => {
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
    UtbetalingTilArbeidsgiver,
    UtbetalingTilSykmeldt,
    DelvisRefusjon,
    Vurderingsoppgaver,
    FortroligAdresse,
    Stikkprøver,
    Revurdering,
    Beslutter,
    Søknad,
};
