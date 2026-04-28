'use client';

import React, { PropsWithChildren, ReactElement } from 'react';

import { Dokumentvisning } from '@saksbilde/dialogmelding/dokumentvisning/Dokumentvisning';
import { VenstremenyDialogmelding } from '@saksbilde/dialogmelding/venstremeny/VenstremenyDialogmelding';

export default function Layout({ children }: PropsWithChildren): ReactElement {
    return (
        <>
            <VenstremenyDialogmelding
                behandlere={[
                    {
                        behandlernavn: 'Linus',
                        dialoger: [
                            {
                                tittel: 'Forespørsel om dokumentasjon',
                                tid: new Date('2026-04-24T14:36:00'),
                                dialogmeldinger: [
                                    {
                                        tittel: 'Forespørsel om dokumentasjon',
                                        innehold:
                                            'Takk for tilsendt dokumentasjon. Vi trenger noen tilleggsopplysninger om pasientens funksjonsnivå og eventuelle tilretteleggingsmuligheter på arbeidsplassen. Kan dere gi en nærmere vurdering av dette?',
                                        tid: new Date('2026-04-24T14:36:00'),
                                        fraNav: true,
                                        vedlegg: [],
                                    },
                                    {
                                        tittel: 'Svar på forespørsel',
                                        innehold:
                                            'Hei, vedlagt finner dere den forespurte dokumentasjonen. Jeg har lagt ved relevant journaldokumentasjon og vurdering av pasientens tilstand. Ta gjerne kontakt dersom dere trenger ytterligere opplysninger.',
                                        tid: new Date('2026-04-22T07:21:00'),
                                        fraNav: false,
                                        vedlegg: [
                                            { navn: 'Sykmelding.pdf', url: '#' },
                                            { navn: 'Legeerklæring.pdf', url: '#' },
                                            { navn: 'Journal_2024.pdf', url: '#' },
                                        ],
                                    },
                                    {
                                        tittel: 'Ytterligere dokumentasjon',
                                        innehold:
                                            'Hei, vi behandler saken til Mia Cathrine Svendsen og trenger ytterligere dokumentasjon for å kunne fatte et vedtak. Kan dere sende over relevant dokumentasjon som belyser pasientens tilstand og arbeidsevne?',
                                        tid: new Date('2026-04-20T09:15:00'),
                                        fraNav: true,
                                        vedlegg: [],
                                    },
                                ],
                            },
                            {
                                tittel: 'Oppfølging etter sykmelding',
                                tid: new Date('2026-04-20T08:30:00'),
                                dialogmeldinger: [
                                    {
                                        tittel: 'Oppfølging etter sykmelding',
                                        innehold:
                                            'Vi ønsker en oppdatering på pasientens tilstand og forventet varighet på sykmeldingen.',
                                        tid: new Date('2026-04-20T08:30:00'),
                                        fraNav: true,
                                        vedlegg: [],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        behandlernavn: 'Solveig',
                        dialoger: [
                            {
                                tittel: 'Forespørsel om dokumentasjon',
                                tid: new Date('2026-04-24T14:36:00'),
                                dialogmeldinger: [
                                    {
                                        tittel: 'Forespørsel om dokumentasjon',
                                        innehold:
                                            'Vi ber om dokumentasjon knyttet til pasientens diagnose og behandlingsplan.',
                                        tid: new Date('2026-04-24T14:36:00'),
                                        fraNav: true,
                                        vedlegg: [],
                                    },
                                    {
                                        tittel: 'Svar med vedlegg',
                                        innehold: 'Vedlagt sender jeg etterspurt dokumentasjon.',
                                        tid: new Date('2026-04-23T10:49:00'),
                                        fraNav: false,
                                        vedlegg: [{ navn: 'Dokumentasjon.pdf', url: '#' }],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        behandlernavn: 'Christian',
                        dialoger: [
                            {
                                tittel: 'Sykmeldingsopplysninger',
                                tid: new Date('2026-04-10T09:00:00'),
                                dialogmeldinger: [
                                    {
                                        tittel: 'Sykmeldingsopplysninger',
                                        innehold:
                                            'Vi ønsker mer informasjon om diagnosen og prognosen for tilbakekomst til arbeid.',
                                        tid: new Date('2026-04-10T09:00:00'),
                                        fraNav: true,
                                        vedlegg: [],
                                    },
                                    {
                                        tittel: 'Svar',
                                        innehold:
                                            'Pasienten er sykmeldt grunnet rygglidelse. Prognosen er god, forventet tilbakekomst om 6–8 uker.',
                                        tid: new Date('2026-04-08T13:15:00'),
                                        fraNav: false,
                                        vedlegg: [{ navn: 'Sykmelding.pdf', url: '#' }],
                                    },
                                ],
                            },
                            {
                                tittel: 'Vurdering av arbeidsevne',
                                tid: new Date('2026-04-05T11:00:00'),
                                dialogmeldinger: [
                                    {
                                        tittel: 'Vurdering av arbeidsevne',
                                        innehold:
                                            'Kan dere gi en vurdering av pasientens nåværende arbeidsevne og muligheter for gradert sykmelding?',
                                        tid: new Date('2026-04-05T11:00:00'),
                                        fraNav: true,
                                        vedlegg: [],
                                    },
                                    {
                                        tittel: 'Svar på vurdering',
                                        innehold:
                                            'Pasienten kan på det nåværende tidspunkt ikke benytte seg av gradert sykmelding, men vi vil revurdere dette om 2 uker.',
                                        tid: new Date('2026-04-04T10:00:00'),
                                        fraNav: false,
                                        vedlegg: [{ navn: 'Vurdering.pdf', url: '#' }],
                                    },
                                ],
                            },
                            {
                                tittel: 'Bekreftelse på behandlingsplan',
                                tid: new Date('2026-03-28T14:00:00'),
                                dialogmeldinger: [
                                    {
                                        tittel: 'Bekreftelse på behandlingsplan',
                                        innehold: 'Vi ber om bekreftelse på at behandlingsplanen er iverksatt.',
                                        tid: new Date('2026-03-28T14:00:00'),
                                        fraNav: true,
                                        vedlegg: [],
                                    },
                                ],
                            },
                        ],
                    },
                ]}
            />
            {children}
            <Dokumentvisning />
        </>
    );
}
