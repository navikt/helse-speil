import React, { Dispatch, ReactNode, SetStateAction, useRef, useState } from 'react';
import { HeaderView } from '../Oversikt.styles';
import { Undertekst } from 'nav-frontend-typografi';
import styled from '@emotion/styled';
import { Chevron } from '../../../components/Chevron';
import { Checkbox } from 'nav-frontend-skjema';
import { Oppgavefilter } from '../Oversikt';
import { useInteractOutside } from '../../../hooks/useInteractOutside';

const Filterknapp = styled.button`
    position: relative;
    display: flex;
    align-items: center;
    height: 2rem;
    border: 1px solid #78706a;
    border-radius: 0.25rem;
    background: #fff;
    padding: 0.25rem 2rem 0.25rem 0.5rem;
    transition: box-shadow 0.2s ease;

    &:hover {
        border-color: #0067c5;
    }

    &:focus,
    &:active {
        box-shadow: 0 0 0 3px #254b6d;
        outline: none;
    }
`;

const FilterknappChevron = styled(Chevron)`
    position: absolute;
    right: 0.375rem;
`;

const Filtermeny = styled.ul`
    position: absolute;
    list-style: none;
    margin: 0;
    background: #fff;
    border: 1px solid #c6c2bf;
    border-radius: 0.25rem;
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.3);
    padding: 1rem 0.75rem;

    hr {
        border: none;
        border-top: 1px solid #c6c2bf;
        margin: 1rem -0.75rem 1rem -0.75rem;
    }
`;

const Filtervalg = styled.li`
    &:not(:last-of-type) {
        margin-bottom: 6px;
    }
`;

const Sjekkboks = styled(Checkbox)`
    label.skjemaelement__label {
        padding-left: 2.25rem;
        &:before {
            width: 20px;
            height: 20px;
            top: 50%;
            transform: translateY(-50%);
        }
    }
`;

interface SammensattOppgavefilter {
    label: string;
    oppgavefilter: Oppgavefilter;
    active: boolean;
}

interface FiltrerbarHeaderProps {
    children: ReactNode | ReactNode[];
    widthInPixels?: number;
    filtere: SammensattOppgavefilter[];
    onSetFiltere: Dispatch<SetStateAction<Oppgavefilter[]>>;
}

export const FiltrerbarHeader = ({ children, widthInPixels, onSetFiltere, filtere }: FiltrerbarHeaderProps) => {
    const [visFiltermeny, setVisFiltermeny] = useState(false);
    const menyRef = useRef<HTMLUListElement>(null);

    useInteractOutside({
        ref: menyRef,
        active: visFiltermeny,
        onInteractOutside: () => setVisFiltermeny(false),
    });

    const toggleFilter = (filter: Oppgavefilter) =>
        onSetFiltere((currentFilters) =>
            currentFilters.includes(filter) ? currentFilters.filter((it) => it !== filter) : [...currentFilters, filter]
        );

    const aktiverAlleFiltere = () => {
        onSetFiltere((currentFilters) => {
            const missingFilters = filtere
                .map((filter) => filter.oppgavefilter)
                .filter((filter) => !currentFilters.includes(filter));
            return [...currentFilters, ...missingFilters];
        });
    };

    const deaktiverAlleFiltere = () => {
        const oppgavefiltere = filtere.map((filter) => filter.oppgavefilter);
        onSetFiltere((currentFilters) => currentFilters.filter((filter) => !oppgavefiltere.includes(filter)));
    };

    const alleFiltereAktive = filtere.every((filter) => filter.active);

    return (
        <HeaderView widthInPixels={widthInPixels}>
            <Filterknapp onClick={() => setVisFiltermeny((value) => !value)}>
                <Undertekst>{children}</Undertekst>
                <FilterknappChevron direction={visFiltermeny ? 'up' : 'down'} />
            </Filterknapp>
            {visFiltermeny && (
                <Filtermeny ref={menyRef}>
                    <Filtervalg>
                        <Sjekkboks
                            label={alleFiltereAktive ? 'Opphev alle' : 'Velg alle'}
                            onChange={(event) => {
                                if (event.target.checked) {
                                    aktiverAlleFiltere();
                                } else {
                                    deaktiverAlleFiltere();
                                }
                            }}
                            checked={alleFiltereAktive}
                        />
                    </Filtervalg>
                    <hr />
                    {filtere.map((filter) => (
                        <Filtervalg key={filter.label}>
                            <Sjekkboks
                                checked={filter.active}
                                onChange={() => toggleFilter(filter.oppgavefilter)}
                                label={filter.label}
                            />
                        </Filtervalg>
                    ))}
                </Filtermeny>
            )}
        </HeaderView>
    );
};
