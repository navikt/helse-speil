import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

import type * as Types from './schema';

/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };

export type SimuleringFragment = {
    __typename: 'Simulering';
    fagsystemId: string;
    totalbelop: number | null;
    tidsstempel: string;
    utbetalingslinjer: Array<{
        __typename: 'Simuleringslinje';
        fom: string;
        tom: string;
        dagsats: number;
        grad: number;
    }>;
    perioder: Array<{
        __typename: 'Simuleringsperiode';
        fom: string;
        tom: string;
        utbetalinger: Array<{
            __typename: 'Simuleringsutbetaling';
            mottakerId: string;
            mottakerNavn: string;
            forfall: string;
            feilkonto: boolean;
            detaljer: Array<{
                __typename: 'Simuleringsdetaljer';
                fom: string;
                tom: string;
                utbetalingstype: string;
                uforegrad: number;
                typeSats: string;
                tilbakeforing: boolean;
                sats: number;
                refunderesOrgNr: string;
                konto: string;
                klassekode: string;
                antallSats: number;
                belop: number;
                klassekodebeskrivelse: string;
            }>;
        }>;
    }> | null;
};

export type Overstyring_Arbeidsforholdoverstyring_Fragment = {
    __typename: 'Arbeidsforholdoverstyring';
    begrunnelse: string;
    deaktivert: boolean;
    skjaeringstidspunkt: string;
    forklaring: string;
    hendelseId: string;
    timestamp: string;
    ferdigstilt: boolean;
    vedtaksperiodeId: string;
    saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
};

export type Overstyring_Dagoverstyring_Fragment = {
    __typename: 'Dagoverstyring';
    begrunnelse: string;
    hendelseId: string;
    timestamp: string;
    ferdigstilt: boolean;
    vedtaksperiodeId: string;
    dager: Array<{
        __typename: 'OverstyrtDag';
        grad: number | null;
        fraGrad: number | null;
        dato: string;
        type: Types.Dagtype;
        fraType: Types.Dagtype | null;
    }>;
    saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
};

export type Overstyring_Inntektoverstyring_Fragment = {
    __typename: 'Inntektoverstyring';
    hendelseId: string;
    timestamp: string;
    ferdigstilt: boolean;
    vedtaksperiodeId: string;
    inntekt: {
        __typename: 'OverstyrtInntekt';
        skjaeringstidspunkt: string;
        forklaring: string;
        begrunnelse: string;
        manedligInntekt: number;
        fraManedligInntekt: number | null;
        refusjonsopplysninger: Array<{
            __typename: 'Refusjonsopplysning';
            fom: string;
            tom: string | null;
            belop: number;
        }> | null;
        fraRefusjonsopplysninger: Array<{
            __typename: 'Refusjonsopplysning';
            fom: string;
            tom: string | null;
            belop: number;
        }> | null;
    };
    saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
};

export type Overstyring_MinimumSykdomsgradOverstyring_Fragment = {
    __typename: 'MinimumSykdomsgradOverstyring';
    hendelseId: string;
    timestamp: string;
    ferdigstilt: boolean;
    vedtaksperiodeId: string;
    minimumSykdomsgrad: {
        __typename: 'OverstyrtMinimumSykdomsgrad';
        begrunnelse: string;
        initierendeVedtaksperiodeId: string;
        perioderVurdertOk: Array<{ __typename: 'OverstyrtMinimumSykdomsgradPeriode'; fom: string; tom: string }>;
        perioderVurdertIkkeOk: Array<{ __typename: 'OverstyrtMinimumSykdomsgradPeriode'; fom: string; tom: string }>;
    };
    saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
};

export type Overstyring_Sykepengegrunnlagskjonnsfastsetting_Fragment = {
    __typename: 'Sykepengegrunnlagskjonnsfastsetting';
    hendelseId: string;
    timestamp: string;
    ferdigstilt: boolean;
    vedtaksperiodeId: string;
    skjonnsfastsatt: {
        __typename: 'SkjonnsfastsattSykepengegrunnlag';
        arsak: string;
        type: Types.Skjonnsfastsettingstype | null;
        begrunnelse: string | null;
        begrunnelseMal: string | null;
        begrunnelseFritekst: string | null;
        begrunnelseKonklusjon: string | null;
        arlig: number;
        fraArlig: number | null;
        skjaeringstidspunkt: string;
    };
    saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
};

export type OverstyringFragment =
    | Overstyring_Arbeidsforholdoverstyring_Fragment
    | Overstyring_Dagoverstyring_Fragment
    | Overstyring_Inntektoverstyring_Fragment
    | Overstyring_MinimumSykdomsgradOverstyring_Fragment
    | Overstyring_Sykepengegrunnlagskjonnsfastsetting_Fragment;

export type TilleggsinfoForInntektskildeFragment = {
    __typename: 'TilleggsinfoForInntektskilde';
    orgnummer: string;
    navn: string;
};

export type ArbeidsgiverFragment = {
    __typename: 'Arbeidsgiver';
    navn: string;
    organisasjonsnummer: string;
    arbeidsforhold: Array<{
        __typename: 'Arbeidsforhold';
        sluttdato: string | null;
        startdato: string;
        stillingsprosent: number;
        stillingstittel: string;
    }>;
    ghostPerioder: Array<{
        __typename: 'GhostPeriode';
        id: string;
        deaktivert: boolean;
        vilkarsgrunnlagId: string | null;
        skjaeringstidspunkt: string;
        fom: string;
        tom: string;
        organisasjonsnummer: string;
    }>;
    behandlinger: Array<{
        __typename: 'Behandling';
        id: string;
        perioder: Array<
            | {
                  __typename: 'BeregnetPeriode';
                  id: string;
                  forbrukteSykedager: number | null;
                  gjenstaendeSykedager: number | null;
                  vedtaksperiodeId: string;
                  maksdato: string;
                  vilkarsgrunnlagId: string | null;
                  grunnbelopsjustertGjennomsnitt: string | null;
                  behandlingId: string;
                  fom: string;
                  tom: string;
                  erForkastet: boolean;
                  inntektstype: Types.Inntektstype;
                  opprettet: string;
                  periodetype: Types.Periodetype;
                  periodetilstand: Types.Periodetilstand;
                  skjaeringstidspunkt: string;
                  handlinger: Array<{
                      __typename: 'Handling';
                      type: Types.Periodehandling;
                      tillatt: boolean;
                      begrunnelse: string | null;
                  }>;
                  historikkinnslag: Array<
                      | {
                            __typename: 'EndrePaVent';
                            frist: string | null;
                            arsaker: Array<string>;
                            notattekst: string | null;
                            id: number;
                            type: Types.PeriodehistorikkType;
                            timestamp: string;
                            saksbehandlerIdent: string | null;
                            dialogRef: number | null;
                            kommentarer: Array<{
                                __typename: 'Kommentar';
                                id: number;
                                tekst: string;
                                opprettet: string;
                                saksbehandlerident: string;
                                feilregistrert_tidspunkt: string | null;
                            }>;
                        }
                      | {
                            __typename: 'FjernetFraPaVent';
                            id: number;
                            type: Types.PeriodehistorikkType;
                            timestamp: string;
                            saksbehandlerIdent: string | null;
                            dialogRef: number | null;
                        }
                      | {
                            __typename: 'LagtPaVent';
                            frist: string | null;
                            arsaker: Array<string>;
                            notattekst: string | null;
                            id: number;
                            type: Types.PeriodehistorikkType;
                            timestamp: string;
                            saksbehandlerIdent: string | null;
                            dialogRef: number | null;
                            kommentarer: Array<{
                                __typename: 'Kommentar';
                                id: number;
                                tekst: string;
                                opprettet: string;
                                saksbehandlerident: string;
                                feilregistrert_tidspunkt: string | null;
                            }>;
                        }
                      | {
                            __typename: 'OpphevStansAutomatiskBehandlingSaksbehandler';
                            notattekst: string | null;
                            id: number;
                            type: Types.PeriodehistorikkType;
                            timestamp: string;
                            saksbehandlerIdent: string | null;
                            dialogRef: number | null;
                            kommentarer: Array<{
                                __typename: 'Kommentar';
                                id: number;
                                tekst: string;
                                opprettet: string;
                                saksbehandlerident: string;
                                feilregistrert_tidspunkt: string | null;
                            }>;
                        }
                      | {
                            __typename: 'PeriodeHistorikkElementNy';
                            id: number;
                            type: Types.PeriodehistorikkType;
                            timestamp: string;
                            saksbehandlerIdent: string | null;
                            dialogRef: number | null;
                        }
                      | {
                            __typename: 'StansAutomatiskBehandlingSaksbehandler';
                            notattekst: string | null;
                            id: number;
                            type: Types.PeriodehistorikkType;
                            timestamp: string;
                            saksbehandlerIdent: string | null;
                            dialogRef: number | null;
                            kommentarer: Array<{
                                __typename: 'Kommentar';
                                id: number;
                                tekst: string;
                                opprettet: string;
                                saksbehandlerident: string;
                                feilregistrert_tidspunkt: string | null;
                            }>;
                        }
                      | {
                            __typename: 'TotrinnsvurderingRetur';
                            notattekst: string | null;
                            id: number;
                            type: Types.PeriodehistorikkType;
                            timestamp: string;
                            saksbehandlerIdent: string | null;
                            dialogRef: number | null;
                            kommentarer: Array<{
                                __typename: 'Kommentar';
                                id: number;
                                tekst: string;
                                opprettet: string;
                                saksbehandlerident: string;
                                feilregistrert_tidspunkt: string | null;
                            }>;
                        }
                  >;
                  periodevilkar: {
                      __typename: 'Periodevilkar';
                      alder: { __typename: 'Alder'; alderSisteSykedag: number; oppfylt: boolean };
                      sykepengedager: {
                          __typename: 'Sykepengedager';
                          forbrukteSykedager: number | null;
                          gjenstaendeSykedager: number | null;
                          maksdato: string;
                          oppfylt: boolean;
                          skjaeringstidspunkt: string;
                      };
                  };
                  risikovurdering: {
                      __typename: 'Risikovurdering';
                      funn: Array<{ __typename: 'Faresignal'; beskrivelse: string; kategori: Array<string> }> | null;
                      kontrollertOk: Array<{ __typename: 'Faresignal'; beskrivelse: string; kategori: Array<string> }>;
                  } | null;
                  utbetaling: {
                      __typename: 'Utbetaling';
                      id: string;
                      arbeidsgiverFagsystemId: string;
                      arbeidsgiverNettoBelop: number;
                      personFagsystemId: string;
                      personNettoBelop: number;
                      status: Types.Utbetalingstatus;
                      type: Types.Utbetalingtype;
                      vurdering: {
                          __typename: 'Vurdering';
                          automatisk: boolean;
                          godkjent: boolean;
                          ident: string;
                          tidsstempel: string;
                      } | null;
                      arbeidsgiversimulering: {
                          __typename: 'Simulering';
                          fagsystemId: string;
                          totalbelop: number | null;
                          tidsstempel: string;
                          utbetalingslinjer: Array<{
                              __typename: 'Simuleringslinje';
                              fom: string;
                              tom: string;
                              dagsats: number;
                              grad: number;
                          }>;
                          perioder: Array<{
                              __typename: 'Simuleringsperiode';
                              fom: string;
                              tom: string;
                              utbetalinger: Array<{
                                  __typename: 'Simuleringsutbetaling';
                                  mottakerId: string;
                                  mottakerNavn: string;
                                  forfall: string;
                                  feilkonto: boolean;
                                  detaljer: Array<{
                                      __typename: 'Simuleringsdetaljer';
                                      fom: string;
                                      tom: string;
                                      utbetalingstype: string;
                                      uforegrad: number;
                                      typeSats: string;
                                      tilbakeforing: boolean;
                                      sats: number;
                                      refunderesOrgNr: string;
                                      konto: string;
                                      klassekode: string;
                                      antallSats: number;
                                      belop: number;
                                      klassekodebeskrivelse: string;
                                  }>;
                              }>;
                          }> | null;
                      } | null;
                      personsimulering: {
                          __typename: 'Simulering';
                          fagsystemId: string;
                          totalbelop: number | null;
                          tidsstempel: string;
                          utbetalingslinjer: Array<{
                              __typename: 'Simuleringslinje';
                              fom: string;
                              tom: string;
                              dagsats: number;
                              grad: number;
                          }>;
                          perioder: Array<{
                              __typename: 'Simuleringsperiode';
                              fom: string;
                              tom: string;
                              utbetalinger: Array<{
                                  __typename: 'Simuleringsutbetaling';
                                  mottakerId: string;
                                  mottakerNavn: string;
                                  forfall: string;
                                  feilkonto: boolean;
                                  detaljer: Array<{
                                      __typename: 'Simuleringsdetaljer';
                                      fom: string;
                                      tom: string;
                                      utbetalingstype: string;
                                      uforegrad: number;
                                      typeSats: string;
                                      tilbakeforing: boolean;
                                      sats: number;
                                      refunderesOrgNr: string;
                                      konto: string;
                                      klassekode: string;
                                      antallSats: number;
                                      belop: number;
                                      klassekodebeskrivelse: string;
                                  }>;
                              }>;
                          }> | null;
                      } | null;
                  };
                  oppgave: { __typename: 'OppgaveForPeriodevisning'; id: string } | null;
                  paVent: { __typename: 'PaVent'; frist: string | null; oid: string } | null;
                  totrinnsvurdering: {
                      __typename: 'Totrinnsvurdering';
                      erBeslutteroppgave: boolean;
                      erRetur: boolean;
                      saksbehandler: string | null;
                      beslutter: string | null;
                  } | null;
                  egenskaper: Array<{
                      __typename: 'Oppgaveegenskap';
                      egenskap: Types.Egenskap;
                      kategori: Types.Kategori;
                  }>;
                  avslag: Array<{
                      __typename: 'Avslag';
                      type: Types.Avslagstype;
                      begrunnelse: string;
                      opprettet: string;
                      saksbehandlerIdent: string;
                      invalidert: boolean;
                  }>;
                  vedtakBegrunnelser: Array<{
                      __typename: 'VedtakBegrunnelse';
                      utfall: Types.VedtakUtfall;
                      begrunnelse: string | null;
                      opprettet: string;
                      saksbehandlerIdent: string;
                  }>;
                  annullering: {
                      __typename: 'Annullering';
                      saksbehandlerIdent: string;
                      arbeidsgiverFagsystemId: string | null;
                      personFagsystemId: string | null;
                      tidspunkt: string;
                      arsaker: Array<string>;
                      begrunnelse: string | null;
                      vedtaksperiodeId: string;
                  } | null;
                  pensjonsgivendeInntekter: Array<{
                      __typename: 'PensjonsgivendeInntekt';
                      arligBelop: string;
                      inntektsar: number;
                  }>;
                  annulleringskandidater: Array<{
                      __typename: 'Annulleringskandidat';
                      fom: string;
                      organisasjonsnummer: string;
                      tom: string;
                      vedtaksperiodeId: string;
                  }>;
                  tidslinje: Array<{
                      __typename: 'Dag';
                      dato: string;
                      grad: number | null;
                      sykdomsdagtype: Types.Sykdomsdagtype;
                      utbetalingsdagtype: Types.Utbetalingsdagtype;
                      begrunnelser: Array<Types.Begrunnelse> | null;
                      kilde: { __typename: 'Kilde'; id: string; type: Types.Kildetype };
                      utbetalingsinfo: {
                          __typename: 'Utbetalingsinfo';
                          arbeidsgiverbelop: number | null;
                          inntekt: number | null;
                          personbelop: number | null;
                          refusjonsbelop: number | null;
                          totalGrad: number | null;
                          utbetaling: number | null;
                      } | null;
                  }>;
                  varsler: Array<{
                      __typename: 'VarselDTO';
                      id: string;
                      behandlingId: string;
                      definisjonId: string;
                      opprettet: string;
                      kode: string;
                      tittel: string;
                      forklaring: string | null;
                      handling: string | null;
                      vurdering: {
                          __typename: 'VarselvurderingDTO';
                          ident: string;
                          status: Types.Varselstatus;
                          tidsstempel: string;
                      } | null;
                  }>;
                  hendelser: Array<
                      | {
                            __typename: 'InntektHentetFraAOrdningen';
                            mottattDato: string;
                            id: string;
                            type: Types.Hendelsetype;
                        }
                      | {
                            __typename: 'Inntektsmelding';
                            beregnetInntekt: number;
                            mottattDato: string;
                            eksternDokumentId: string | null;
                            id: string;
                            type: Types.Hendelsetype;
                        }
                      | {
                            __typename: 'SoknadArbeidsgiver';
                            fom: string;
                            tom: string;
                            rapportertDato: string;
                            sendtArbeidsgiver: string;
                            eksternDokumentId: string | null;
                            id: string;
                            type: Types.Hendelsetype;
                        }
                      | {
                            __typename: 'SoknadArbeidsledig';
                            fom: string;
                            tom: string;
                            rapportertDato: string;
                            sendtNav: string;
                            eksternDokumentId: string | null;
                            id: string;
                            type: Types.Hendelsetype;
                        }
                      | {
                            __typename: 'SoknadFrilans';
                            fom: string;
                            tom: string;
                            rapportertDato: string;
                            sendtNav: string;
                            eksternDokumentId: string | null;
                            id: string;
                            type: Types.Hendelsetype;
                        }
                      | {
                            __typename: 'SoknadNav';
                            fom: string;
                            tom: string;
                            rapportertDato: string;
                            sendtNav: string;
                            eksternDokumentId: string | null;
                            id: string;
                            type: Types.Hendelsetype;
                        }
                      | {
                            __typename: 'SoknadSelvstendig';
                            fom: string;
                            tom: string;
                            rapportertDato: string;
                            sendtNav: string;
                            eksternDokumentId: string | null;
                            id: string;
                            type: Types.Hendelsetype;
                        }
                      | {
                            __typename: 'Sykmelding';
                            fom: string;
                            tom: string;
                            rapportertDato: string;
                            id: string;
                            type: Types.Hendelsetype;
                        }
                  >;
              }
            | {
                  __typename: 'UberegnetPeriode';
                  id: string;
                  behandlingId: string;
                  fom: string;
                  tom: string;
                  erForkastet: boolean;
                  inntektstype: Types.Inntektstype;
                  opprettet: string;
                  periodetype: Types.Periodetype;
                  vedtaksperiodeId: string;
                  periodetilstand: Types.Periodetilstand;
                  skjaeringstidspunkt: string;
                  historikkinnslag: Array<
                      | {
                            __typename: 'EndrePaVent';
                            frist: string | null;
                            arsaker: Array<string>;
                            notattekst: string | null;
                            id: number;
                            type: Types.PeriodehistorikkType;
                            timestamp: string;
                            saksbehandlerIdent: string | null;
                            dialogRef: number | null;
                            kommentarer: Array<{
                                __typename: 'Kommentar';
                                id: number;
                                tekst: string;
                                opprettet: string;
                                saksbehandlerident: string;
                                feilregistrert_tidspunkt: string | null;
                            }>;
                        }
                      | {
                            __typename: 'FjernetFraPaVent';
                            id: number;
                            type: Types.PeriodehistorikkType;
                            timestamp: string;
                            saksbehandlerIdent: string | null;
                            dialogRef: number | null;
                        }
                      | {
                            __typename: 'LagtPaVent';
                            frist: string | null;
                            arsaker: Array<string>;
                            notattekst: string | null;
                            id: number;
                            type: Types.PeriodehistorikkType;
                            timestamp: string;
                            saksbehandlerIdent: string | null;
                            dialogRef: number | null;
                            kommentarer: Array<{
                                __typename: 'Kommentar';
                                id: number;
                                tekst: string;
                                opprettet: string;
                                saksbehandlerident: string;
                                feilregistrert_tidspunkt: string | null;
                            }>;
                        }
                      | {
                            __typename: 'OpphevStansAutomatiskBehandlingSaksbehandler';
                            notattekst: string | null;
                            id: number;
                            type: Types.PeriodehistorikkType;
                            timestamp: string;
                            saksbehandlerIdent: string | null;
                            dialogRef: number | null;
                            kommentarer: Array<{
                                __typename: 'Kommentar';
                                id: number;
                                tekst: string;
                                opprettet: string;
                                saksbehandlerident: string;
                                feilregistrert_tidspunkt: string | null;
                            }>;
                        }
                      | {
                            __typename: 'PeriodeHistorikkElementNy';
                            id: number;
                            type: Types.PeriodehistorikkType;
                            timestamp: string;
                            saksbehandlerIdent: string | null;
                            dialogRef: number | null;
                        }
                      | {
                            __typename: 'StansAutomatiskBehandlingSaksbehandler';
                            notattekst: string | null;
                            id: number;
                            type: Types.PeriodehistorikkType;
                            timestamp: string;
                            saksbehandlerIdent: string | null;
                            dialogRef: number | null;
                            kommentarer: Array<{
                                __typename: 'Kommentar';
                                id: number;
                                tekst: string;
                                opprettet: string;
                                saksbehandlerident: string;
                                feilregistrert_tidspunkt: string | null;
                            }>;
                        }
                      | {
                            __typename: 'TotrinnsvurderingRetur';
                            notattekst: string | null;
                            id: number;
                            type: Types.PeriodehistorikkType;
                            timestamp: string;
                            saksbehandlerIdent: string | null;
                            dialogRef: number | null;
                            kommentarer: Array<{
                                __typename: 'Kommentar';
                                id: number;
                                tekst: string;
                                opprettet: string;
                                saksbehandlerident: string;
                                feilregistrert_tidspunkt: string | null;
                            }>;
                        }
                  >;
                  tidslinje: Array<{
                      __typename: 'Dag';
                      dato: string;
                      grad: number | null;
                      sykdomsdagtype: Types.Sykdomsdagtype;
                      utbetalingsdagtype: Types.Utbetalingsdagtype;
                      begrunnelser: Array<Types.Begrunnelse> | null;
                      kilde: { __typename: 'Kilde'; id: string; type: Types.Kildetype };
                      utbetalingsinfo: {
                          __typename: 'Utbetalingsinfo';
                          arbeidsgiverbelop: number | null;
                          inntekt: number | null;
                          personbelop: number | null;
                          refusjonsbelop: number | null;
                          totalGrad: number | null;
                          utbetaling: number | null;
                      } | null;
                  }>;
                  varsler: Array<{
                      __typename: 'VarselDTO';
                      id: string;
                      behandlingId: string;
                      definisjonId: string;
                      opprettet: string;
                      kode: string;
                      tittel: string;
                      forklaring: string | null;
                      handling: string | null;
                      vurdering: {
                          __typename: 'VarselvurderingDTO';
                          ident: string;
                          status: Types.Varselstatus;
                          tidsstempel: string;
                      } | null;
                  }>;
                  hendelser: Array<
                      | {
                            __typename: 'InntektHentetFraAOrdningen';
                            mottattDato: string;
                            id: string;
                            type: Types.Hendelsetype;
                        }
                      | {
                            __typename: 'Inntektsmelding';
                            beregnetInntekt: number;
                            mottattDato: string;
                            eksternDokumentId: string | null;
                            id: string;
                            type: Types.Hendelsetype;
                        }
                      | {
                            __typename: 'SoknadArbeidsgiver';
                            fom: string;
                            tom: string;
                            rapportertDato: string;
                            sendtArbeidsgiver: string;
                            eksternDokumentId: string | null;
                            id: string;
                            type: Types.Hendelsetype;
                        }
                      | {
                            __typename: 'SoknadArbeidsledig';
                            fom: string;
                            tom: string;
                            rapportertDato: string;
                            sendtNav: string;
                            eksternDokumentId: string | null;
                            id: string;
                            type: Types.Hendelsetype;
                        }
                      | {
                            __typename: 'SoknadFrilans';
                            fom: string;
                            tom: string;
                            rapportertDato: string;
                            sendtNav: string;
                            eksternDokumentId: string | null;
                            id: string;
                            type: Types.Hendelsetype;
                        }
                      | {
                            __typename: 'SoknadNav';
                            fom: string;
                            tom: string;
                            rapportertDato: string;
                            sendtNav: string;
                            eksternDokumentId: string | null;
                            id: string;
                            type: Types.Hendelsetype;
                        }
                      | {
                            __typename: 'SoknadSelvstendig';
                            fom: string;
                            tom: string;
                            rapportertDato: string;
                            sendtNav: string;
                            eksternDokumentId: string | null;
                            id: string;
                            type: Types.Hendelsetype;
                        }
                      | {
                            __typename: 'Sykmelding';
                            fom: string;
                            tom: string;
                            rapportertDato: string;
                            id: string;
                            type: Types.Hendelsetype;
                        }
                  >;
              }
        >;
    }>;
    overstyringer: Array<
        | {
              __typename: 'Arbeidsforholdoverstyring';
              begrunnelse: string;
              deaktivert: boolean;
              skjaeringstidspunkt: string;
              forklaring: string;
              hendelseId: string;
              timestamp: string;
              ferdigstilt: boolean;
              vedtaksperiodeId: string;
              saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
          }
        | {
              __typename: 'Dagoverstyring';
              begrunnelse: string;
              hendelseId: string;
              timestamp: string;
              ferdigstilt: boolean;
              vedtaksperiodeId: string;
              dager: Array<{
                  __typename: 'OverstyrtDag';
                  grad: number | null;
                  fraGrad: number | null;
                  dato: string;
                  type: Types.Dagtype;
                  fraType: Types.Dagtype | null;
              }>;
              saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
          }
        | {
              __typename: 'Inntektoverstyring';
              hendelseId: string;
              timestamp: string;
              ferdigstilt: boolean;
              vedtaksperiodeId: string;
              inntekt: {
                  __typename: 'OverstyrtInntekt';
                  skjaeringstidspunkt: string;
                  forklaring: string;
                  begrunnelse: string;
                  manedligInntekt: number;
                  fraManedligInntekt: number | null;
                  refusjonsopplysninger: Array<{
                      __typename: 'Refusjonsopplysning';
                      fom: string;
                      tom: string | null;
                      belop: number;
                  }> | null;
                  fraRefusjonsopplysninger: Array<{
                      __typename: 'Refusjonsopplysning';
                      fom: string;
                      tom: string | null;
                      belop: number;
                  }> | null;
              };
              saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
          }
        | {
              __typename: 'MinimumSykdomsgradOverstyring';
              hendelseId: string;
              timestamp: string;
              ferdigstilt: boolean;
              vedtaksperiodeId: string;
              minimumSykdomsgrad: {
                  __typename: 'OverstyrtMinimumSykdomsgrad';
                  begrunnelse: string;
                  initierendeVedtaksperiodeId: string;
                  perioderVurdertOk: Array<{
                      __typename: 'OverstyrtMinimumSykdomsgradPeriode';
                      fom: string;
                      tom: string;
                  }>;
                  perioderVurdertIkkeOk: Array<{
                      __typename: 'OverstyrtMinimumSykdomsgradPeriode';
                      fom: string;
                      tom: string;
                  }>;
              };
              saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
          }
        | {
              __typename: 'Sykepengegrunnlagskjonnsfastsetting';
              hendelseId: string;
              timestamp: string;
              ferdigstilt: boolean;
              vedtaksperiodeId: string;
              skjonnsfastsatt: {
                  __typename: 'SkjonnsfastsattSykepengegrunnlag';
                  arsak: string;
                  type: Types.Skjonnsfastsettingstype | null;
                  begrunnelse: string | null;
                  begrunnelseMal: string | null;
                  begrunnelseFritekst: string | null;
                  begrunnelseKonklusjon: string | null;
                  arlig: number;
                  fraArlig: number | null;
                  skjaeringstidspunkt: string;
              };
              saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
          }
    >;
    inntekterFraAordningen: Array<{
        __typename: 'ArbeidsgiverInntekterFraAOrdningen';
        skjaeringstidspunkt: string;
        inntekter: Array<{ __typename: 'InntektFraAOrdningen'; maned: string; sum: number }>;
    }>;
};

export type VilkarsgrunnlagV2_VilkarsgrunnlagInfotrygdV2_Fragment = {
    __typename: 'VilkarsgrunnlagInfotrygdV2';
    omregnetArsinntekt: number;
    opptjeningsvurderingId: string;
    id: string;
    sykepengegrunnlag: number;
    skjaeringstidspunkt: string;
    inntekter: Array<{
        __typename: 'Arbeidsgiverinntekt';
        arbeidsgiver: string;
        deaktivert: boolean | null;
        fom: string | null;
        tom: string | null;
        sammenligningsgrunnlag: {
            __typename: 'Sammenligningsgrunnlag';
            belop: number;
            inntektFraAOrdningen: Array<{ __typename: 'InntektFraAOrdningen'; maned: string; sum: number }>;
        } | null;
        omregnetArsinntekt: {
            __typename: 'OmregnetArsinntekt';
            belop: number;
            manedsbelop: number;
            kilde: Types.Inntektskilde;
            inntektFraAOrdningen: Array<{ __typename: 'InntektFraAOrdningen'; maned: string; sum: number }> | null;
        } | null;
        skjonnsmessigFastsatt: {
            __typename: 'OmregnetArsinntekt';
            belop: number;
            manedsbelop: number;
            kilde: Types.Inntektskilde;
            inntektFraAOrdningen: Array<{ __typename: 'InntektFraAOrdningen'; maned: string; sum: number }> | null;
        } | null;
    }>;
    arbeidsgiverrefusjoner: Array<{
        __typename: 'Arbeidsgiverrefusjon';
        arbeidsgiver: string;
        refusjonsopplysninger: Array<{
            __typename: 'Refusjonselement';
            fom: string;
            tom: string | null;
            belop: number;
            meldingsreferanseId: string;
        }>;
    }>;
};

export type VilkarsgrunnlagV2_VilkarsgrunnlagSpleisV2_Fragment = {
    __typename: 'VilkarsgrunnlagSpleisV2';
    skjonnsmessigFastsattAarlig: number | null;
    vurderingAvKravOmMedlemskap: Types.VilkarsgrunnlagVurdering;
    oppfyllerKravOmMinstelonn: boolean;
    oppfyllerKravOmOpptjening: boolean;
    antallOpptjeningsdagerErMinst: number;
    grunnbelop: number;
    opptjeningFra: string;
    opptjeningsvurderingId: string;
    beregningsgrunnlag: string;
    forsikringsvurderingId: string | null;
    id: string;
    sykepengegrunnlag: number;
    skjaeringstidspunkt: string;
    sykepengegrunnlagsgrense: {
        __typename: 'Sykepengegrunnlagsgrense';
        grunnbelop: number;
        grense: number;
        virkningstidspunkt: string;
    };
    avviksvurdering: {
        __typename: 'VilkarsgrunnlagAvviksvurdering';
        avviksprosent: string;
        beregningsgrunnlag: string;
        sammenligningsgrunnlag: string;
    } | null;
    inntekter: Array<{
        __typename: 'Arbeidsgiverinntekt';
        arbeidsgiver: string;
        deaktivert: boolean | null;
        fom: string | null;
        tom: string | null;
        sammenligningsgrunnlag: {
            __typename: 'Sammenligningsgrunnlag';
            belop: number;
            inntektFraAOrdningen: Array<{ __typename: 'InntektFraAOrdningen'; maned: string; sum: number }>;
        } | null;
        omregnetArsinntekt: {
            __typename: 'OmregnetArsinntekt';
            belop: number;
            manedsbelop: number;
            kilde: Types.Inntektskilde;
            inntektFraAOrdningen: Array<{ __typename: 'InntektFraAOrdningen'; maned: string; sum: number }> | null;
        } | null;
        skjonnsmessigFastsatt: {
            __typename: 'OmregnetArsinntekt';
            belop: number;
            manedsbelop: number;
            kilde: Types.Inntektskilde;
            inntektFraAOrdningen: Array<{ __typename: 'InntektFraAOrdningen'; maned: string; sum: number }> | null;
        } | null;
    }>;
    arbeidsgiverrefusjoner: Array<{
        __typename: 'Arbeidsgiverrefusjon';
        arbeidsgiver: string;
        refusjonsopplysninger: Array<{
            __typename: 'Refusjonselement';
            fom: string;
            tom: string | null;
            belop: number;
            meldingsreferanseId: string;
        }>;
    }>;
};

export type VilkarsgrunnlagV2Fragment =
    VilkarsgrunnlagV2_VilkarsgrunnlagInfotrygdV2_Fragment | VilkarsgrunnlagV2_VilkarsgrunnlagSpleisV2_Fragment;

export type KommentarFragment = {
    __typename: 'Kommentar';
    id: number;
    tekst: string;
    opprettet: string;
    saksbehandlerident: string;
    feilregistrert_tidspunkt: string | null;
};

export type GhostPeriodeFragment = {
    __typename: 'GhostPeriode';
    id: string;
    deaktivert: boolean;
    vilkarsgrunnlagId: string | null;
    skjaeringstidspunkt: string;
    fom: string;
    tom: string;
    organisasjonsnummer: string;
};

export type UberegnetPeriodeFragment = {
    __typename: 'UberegnetPeriode';
    id: string;
    behandlingId: string;
    fom: string;
    tom: string;
    erForkastet: boolean;
    inntektstype: Types.Inntektstype;
    opprettet: string;
    periodetype: Types.Periodetype;
    vedtaksperiodeId: string;
    periodetilstand: Types.Periodetilstand;
    skjaeringstidspunkt: string;
    historikkinnslag: Array<
        | {
              __typename: 'EndrePaVent';
              frist: string | null;
              arsaker: Array<string>;
              notattekst: string | null;
              id: number;
              type: Types.PeriodehistorikkType;
              timestamp: string;
              saksbehandlerIdent: string | null;
              dialogRef: number | null;
              kommentarer: Array<{
                  __typename: 'Kommentar';
                  id: number;
                  tekst: string;
                  opprettet: string;
                  saksbehandlerident: string;
                  feilregistrert_tidspunkt: string | null;
              }>;
          }
        | {
              __typename: 'FjernetFraPaVent';
              id: number;
              type: Types.PeriodehistorikkType;
              timestamp: string;
              saksbehandlerIdent: string | null;
              dialogRef: number | null;
          }
        | {
              __typename: 'LagtPaVent';
              frist: string | null;
              arsaker: Array<string>;
              notattekst: string | null;
              id: number;
              type: Types.PeriodehistorikkType;
              timestamp: string;
              saksbehandlerIdent: string | null;
              dialogRef: number | null;
              kommentarer: Array<{
                  __typename: 'Kommentar';
                  id: number;
                  tekst: string;
                  opprettet: string;
                  saksbehandlerident: string;
                  feilregistrert_tidspunkt: string | null;
              }>;
          }
        | {
              __typename: 'OpphevStansAutomatiskBehandlingSaksbehandler';
              notattekst: string | null;
              id: number;
              type: Types.PeriodehistorikkType;
              timestamp: string;
              saksbehandlerIdent: string | null;
              dialogRef: number | null;
              kommentarer: Array<{
                  __typename: 'Kommentar';
                  id: number;
                  tekst: string;
                  opprettet: string;
                  saksbehandlerident: string;
                  feilregistrert_tidspunkt: string | null;
              }>;
          }
        | {
              __typename: 'PeriodeHistorikkElementNy';
              id: number;
              type: Types.PeriodehistorikkType;
              timestamp: string;
              saksbehandlerIdent: string | null;
              dialogRef: number | null;
          }
        | {
              __typename: 'StansAutomatiskBehandlingSaksbehandler';
              notattekst: string | null;
              id: number;
              type: Types.PeriodehistorikkType;
              timestamp: string;
              saksbehandlerIdent: string | null;
              dialogRef: number | null;
              kommentarer: Array<{
                  __typename: 'Kommentar';
                  id: number;
                  tekst: string;
                  opprettet: string;
                  saksbehandlerident: string;
                  feilregistrert_tidspunkt: string | null;
              }>;
          }
        | {
              __typename: 'TotrinnsvurderingRetur';
              notattekst: string | null;
              id: number;
              type: Types.PeriodehistorikkType;
              timestamp: string;
              saksbehandlerIdent: string | null;
              dialogRef: number | null;
              kommentarer: Array<{
                  __typename: 'Kommentar';
                  id: number;
                  tekst: string;
                  opprettet: string;
                  saksbehandlerident: string;
                  feilregistrert_tidspunkt: string | null;
              }>;
          }
    >;
    tidslinje: Array<{
        __typename: 'Dag';
        dato: string;
        grad: number | null;
        sykdomsdagtype: Types.Sykdomsdagtype;
        utbetalingsdagtype: Types.Utbetalingsdagtype;
        begrunnelser: Array<Types.Begrunnelse> | null;
        kilde: { __typename: 'Kilde'; id: string; type: Types.Kildetype };
        utbetalingsinfo: {
            __typename: 'Utbetalingsinfo';
            arbeidsgiverbelop: number | null;
            inntekt: number | null;
            personbelop: number | null;
            refusjonsbelop: number | null;
            totalGrad: number | null;
            utbetaling: number | null;
        } | null;
    }>;
    varsler: Array<{
        __typename: 'VarselDTO';
        id: string;
        behandlingId: string;
        definisjonId: string;
        opprettet: string;
        kode: string;
        tittel: string;
        forklaring: string | null;
        handling: string | null;
        vurdering: {
            __typename: 'VarselvurderingDTO';
            ident: string;
            status: Types.Varselstatus;
            tidsstempel: string;
        } | null;
    }>;
    hendelser: Array<
        | { __typename: 'InntektHentetFraAOrdningen'; mottattDato: string; id: string; type: Types.Hendelsetype }
        | {
              __typename: 'Inntektsmelding';
              beregnetInntekt: number;
              mottattDato: string;
              eksternDokumentId: string | null;
              id: string;
              type: Types.Hendelsetype;
          }
        | {
              __typename: 'SoknadArbeidsgiver';
              fom: string;
              tom: string;
              rapportertDato: string;
              sendtArbeidsgiver: string;
              eksternDokumentId: string | null;
              id: string;
              type: Types.Hendelsetype;
          }
        | {
              __typename: 'SoknadArbeidsledig';
              fom: string;
              tom: string;
              rapportertDato: string;
              sendtNav: string;
              eksternDokumentId: string | null;
              id: string;
              type: Types.Hendelsetype;
          }
        | {
              __typename: 'SoknadFrilans';
              fom: string;
              tom: string;
              rapportertDato: string;
              sendtNav: string;
              eksternDokumentId: string | null;
              id: string;
              type: Types.Hendelsetype;
          }
        | {
              __typename: 'SoknadNav';
              fom: string;
              tom: string;
              rapportertDato: string;
              sendtNav: string;
              eksternDokumentId: string | null;
              id: string;
              type: Types.Hendelsetype;
          }
        | {
              __typename: 'SoknadSelvstendig';
              fom: string;
              tom: string;
              rapportertDato: string;
              sendtNav: string;
              eksternDokumentId: string | null;
              id: string;
              type: Types.Hendelsetype;
          }
        | {
              __typename: 'Sykmelding';
              fom: string;
              tom: string;
              rapportertDato: string;
              id: string;
              type: Types.Hendelsetype;
          }
    >;
};

export type BeregnetPeriodeFragment = {
    __typename: 'BeregnetPeriode';
    id: string;
    forbrukteSykedager: number | null;
    gjenstaendeSykedager: number | null;
    vedtaksperiodeId: string;
    maksdato: string;
    vilkarsgrunnlagId: string | null;
    grunnbelopsjustertGjennomsnitt: string | null;
    behandlingId: string;
    fom: string;
    tom: string;
    erForkastet: boolean;
    inntektstype: Types.Inntektstype;
    opprettet: string;
    periodetype: Types.Periodetype;
    periodetilstand: Types.Periodetilstand;
    skjaeringstidspunkt: string;
    handlinger: Array<{
        __typename: 'Handling';
        type: Types.Periodehandling;
        tillatt: boolean;
        begrunnelse: string | null;
    }>;
    historikkinnslag: Array<
        | {
              __typename: 'EndrePaVent';
              frist: string | null;
              arsaker: Array<string>;
              notattekst: string | null;
              id: number;
              type: Types.PeriodehistorikkType;
              timestamp: string;
              saksbehandlerIdent: string | null;
              dialogRef: number | null;
              kommentarer: Array<{
                  __typename: 'Kommentar';
                  id: number;
                  tekst: string;
                  opprettet: string;
                  saksbehandlerident: string;
                  feilregistrert_tidspunkt: string | null;
              }>;
          }
        | {
              __typename: 'FjernetFraPaVent';
              id: number;
              type: Types.PeriodehistorikkType;
              timestamp: string;
              saksbehandlerIdent: string | null;
              dialogRef: number | null;
          }
        | {
              __typename: 'LagtPaVent';
              frist: string | null;
              arsaker: Array<string>;
              notattekst: string | null;
              id: number;
              type: Types.PeriodehistorikkType;
              timestamp: string;
              saksbehandlerIdent: string | null;
              dialogRef: number | null;
              kommentarer: Array<{
                  __typename: 'Kommentar';
                  id: number;
                  tekst: string;
                  opprettet: string;
                  saksbehandlerident: string;
                  feilregistrert_tidspunkt: string | null;
              }>;
          }
        | {
              __typename: 'OpphevStansAutomatiskBehandlingSaksbehandler';
              notattekst: string | null;
              id: number;
              type: Types.PeriodehistorikkType;
              timestamp: string;
              saksbehandlerIdent: string | null;
              dialogRef: number | null;
              kommentarer: Array<{
                  __typename: 'Kommentar';
                  id: number;
                  tekst: string;
                  opprettet: string;
                  saksbehandlerident: string;
                  feilregistrert_tidspunkt: string | null;
              }>;
          }
        | {
              __typename: 'PeriodeHistorikkElementNy';
              id: number;
              type: Types.PeriodehistorikkType;
              timestamp: string;
              saksbehandlerIdent: string | null;
              dialogRef: number | null;
          }
        | {
              __typename: 'StansAutomatiskBehandlingSaksbehandler';
              notattekst: string | null;
              id: number;
              type: Types.PeriodehistorikkType;
              timestamp: string;
              saksbehandlerIdent: string | null;
              dialogRef: number | null;
              kommentarer: Array<{
                  __typename: 'Kommentar';
                  id: number;
                  tekst: string;
                  opprettet: string;
                  saksbehandlerident: string;
                  feilregistrert_tidspunkt: string | null;
              }>;
          }
        | {
              __typename: 'TotrinnsvurderingRetur';
              notattekst: string | null;
              id: number;
              type: Types.PeriodehistorikkType;
              timestamp: string;
              saksbehandlerIdent: string | null;
              dialogRef: number | null;
              kommentarer: Array<{
                  __typename: 'Kommentar';
                  id: number;
                  tekst: string;
                  opprettet: string;
                  saksbehandlerident: string;
                  feilregistrert_tidspunkt: string | null;
              }>;
          }
    >;
    periodevilkar: {
        __typename: 'Periodevilkar';
        alder: { __typename: 'Alder'; alderSisteSykedag: number; oppfylt: boolean };
        sykepengedager: {
            __typename: 'Sykepengedager';
            forbrukteSykedager: number | null;
            gjenstaendeSykedager: number | null;
            maksdato: string;
            oppfylt: boolean;
            skjaeringstidspunkt: string;
        };
    };
    risikovurdering: {
        __typename: 'Risikovurdering';
        funn: Array<{ __typename: 'Faresignal'; beskrivelse: string; kategori: Array<string> }> | null;
        kontrollertOk: Array<{ __typename: 'Faresignal'; beskrivelse: string; kategori: Array<string> }>;
    } | null;
    utbetaling: {
        __typename: 'Utbetaling';
        id: string;
        arbeidsgiverFagsystemId: string;
        arbeidsgiverNettoBelop: number;
        personFagsystemId: string;
        personNettoBelop: number;
        status: Types.Utbetalingstatus;
        type: Types.Utbetalingtype;
        vurdering: {
            __typename: 'Vurdering';
            automatisk: boolean;
            godkjent: boolean;
            ident: string;
            tidsstempel: string;
        } | null;
        arbeidsgiversimulering: {
            __typename: 'Simulering';
            fagsystemId: string;
            totalbelop: number | null;
            tidsstempel: string;
            utbetalingslinjer: Array<{
                __typename: 'Simuleringslinje';
                fom: string;
                tom: string;
                dagsats: number;
                grad: number;
            }>;
            perioder: Array<{
                __typename: 'Simuleringsperiode';
                fom: string;
                tom: string;
                utbetalinger: Array<{
                    __typename: 'Simuleringsutbetaling';
                    mottakerId: string;
                    mottakerNavn: string;
                    forfall: string;
                    feilkonto: boolean;
                    detaljer: Array<{
                        __typename: 'Simuleringsdetaljer';
                        fom: string;
                        tom: string;
                        utbetalingstype: string;
                        uforegrad: number;
                        typeSats: string;
                        tilbakeforing: boolean;
                        sats: number;
                        refunderesOrgNr: string;
                        konto: string;
                        klassekode: string;
                        antallSats: number;
                        belop: number;
                        klassekodebeskrivelse: string;
                    }>;
                }>;
            }> | null;
        } | null;
        personsimulering: {
            __typename: 'Simulering';
            fagsystemId: string;
            totalbelop: number | null;
            tidsstempel: string;
            utbetalingslinjer: Array<{
                __typename: 'Simuleringslinje';
                fom: string;
                tom: string;
                dagsats: number;
                grad: number;
            }>;
            perioder: Array<{
                __typename: 'Simuleringsperiode';
                fom: string;
                tom: string;
                utbetalinger: Array<{
                    __typename: 'Simuleringsutbetaling';
                    mottakerId: string;
                    mottakerNavn: string;
                    forfall: string;
                    feilkonto: boolean;
                    detaljer: Array<{
                        __typename: 'Simuleringsdetaljer';
                        fom: string;
                        tom: string;
                        utbetalingstype: string;
                        uforegrad: number;
                        typeSats: string;
                        tilbakeforing: boolean;
                        sats: number;
                        refunderesOrgNr: string;
                        konto: string;
                        klassekode: string;
                        antallSats: number;
                        belop: number;
                        klassekodebeskrivelse: string;
                    }>;
                }>;
            }> | null;
        } | null;
    };
    oppgave: { __typename: 'OppgaveForPeriodevisning'; id: string } | null;
    paVent: { __typename: 'PaVent'; frist: string | null; oid: string } | null;
    totrinnsvurdering: {
        __typename: 'Totrinnsvurdering';
        erBeslutteroppgave: boolean;
        erRetur: boolean;
        saksbehandler: string | null;
        beslutter: string | null;
    } | null;
    egenskaper: Array<{ __typename: 'Oppgaveegenskap'; egenskap: Types.Egenskap; kategori: Types.Kategori }>;
    avslag: Array<{
        __typename: 'Avslag';
        type: Types.Avslagstype;
        begrunnelse: string;
        opprettet: string;
        saksbehandlerIdent: string;
        invalidert: boolean;
    }>;
    vedtakBegrunnelser: Array<{
        __typename: 'VedtakBegrunnelse';
        utfall: Types.VedtakUtfall;
        begrunnelse: string | null;
        opprettet: string;
        saksbehandlerIdent: string;
    }>;
    annullering: {
        __typename: 'Annullering';
        saksbehandlerIdent: string;
        arbeidsgiverFagsystemId: string | null;
        personFagsystemId: string | null;
        tidspunkt: string;
        arsaker: Array<string>;
        begrunnelse: string | null;
        vedtaksperiodeId: string;
    } | null;
    pensjonsgivendeInntekter: Array<{ __typename: 'PensjonsgivendeInntekt'; arligBelop: string; inntektsar: number }>;
    annulleringskandidater: Array<{
        __typename: 'Annulleringskandidat';
        fom: string;
        organisasjonsnummer: string;
        tom: string;
        vedtaksperiodeId: string;
    }>;
    tidslinje: Array<{
        __typename: 'Dag';
        dato: string;
        grad: number | null;
        sykdomsdagtype: Types.Sykdomsdagtype;
        utbetalingsdagtype: Types.Utbetalingsdagtype;
        begrunnelser: Array<Types.Begrunnelse> | null;
        kilde: { __typename: 'Kilde'; id: string; type: Types.Kildetype };
        utbetalingsinfo: {
            __typename: 'Utbetalingsinfo';
            arbeidsgiverbelop: number | null;
            inntekt: number | null;
            personbelop: number | null;
            refusjonsbelop: number | null;
            totalGrad: number | null;
            utbetaling: number | null;
        } | null;
    }>;
    varsler: Array<{
        __typename: 'VarselDTO';
        id: string;
        behandlingId: string;
        definisjonId: string;
        opprettet: string;
        kode: string;
        tittel: string;
        forklaring: string | null;
        handling: string | null;
        vurdering: {
            __typename: 'VarselvurderingDTO';
            ident: string;
            status: Types.Varselstatus;
            tidsstempel: string;
        } | null;
    }>;
    hendelser: Array<
        | { __typename: 'InntektHentetFraAOrdningen'; mottattDato: string; id: string; type: Types.Hendelsetype }
        | {
              __typename: 'Inntektsmelding';
              beregnetInntekt: number;
              mottattDato: string;
              eksternDokumentId: string | null;
              id: string;
              type: Types.Hendelsetype;
          }
        | {
              __typename: 'SoknadArbeidsgiver';
              fom: string;
              tom: string;
              rapportertDato: string;
              sendtArbeidsgiver: string;
              eksternDokumentId: string | null;
              id: string;
              type: Types.Hendelsetype;
          }
        | {
              __typename: 'SoknadArbeidsledig';
              fom: string;
              tom: string;
              rapportertDato: string;
              sendtNav: string;
              eksternDokumentId: string | null;
              id: string;
              type: Types.Hendelsetype;
          }
        | {
              __typename: 'SoknadFrilans';
              fom: string;
              tom: string;
              rapportertDato: string;
              sendtNav: string;
              eksternDokumentId: string | null;
              id: string;
              type: Types.Hendelsetype;
          }
        | {
              __typename: 'SoknadNav';
              fom: string;
              tom: string;
              rapportertDato: string;
              sendtNav: string;
              eksternDokumentId: string | null;
              id: string;
              type: Types.Hendelsetype;
          }
        | {
              __typename: 'SoknadSelvstendig';
              fom: string;
              tom: string;
              rapportertDato: string;
              sendtNav: string;
              eksternDokumentId: string | null;
              id: string;
              type: Types.Hendelsetype;
          }
        | {
              __typename: 'Sykmelding';
              fom: string;
              tom: string;
              rapportertDato: string;
              id: string;
              type: Types.Hendelsetype;
          }
    >;
};

export type Periode_BeregnetPeriode_Fragment = {
    __typename: 'BeregnetPeriode';
    behandlingId: string;
    fom: string;
    tom: string;
    erForkastet: boolean;
    inntektstype: Types.Inntektstype;
    opprettet: string;
    periodetype: Types.Periodetype;
    vedtaksperiodeId: string;
    periodetilstand: Types.Periodetilstand;
    skjaeringstidspunkt: string;
    tidslinje: Array<{
        __typename: 'Dag';
        dato: string;
        grad: number | null;
        sykdomsdagtype: Types.Sykdomsdagtype;
        utbetalingsdagtype: Types.Utbetalingsdagtype;
        begrunnelser: Array<Types.Begrunnelse> | null;
        kilde: { __typename: 'Kilde'; id: string; type: Types.Kildetype };
        utbetalingsinfo: {
            __typename: 'Utbetalingsinfo';
            arbeidsgiverbelop: number | null;
            inntekt: number | null;
            personbelop: number | null;
            refusjonsbelop: number | null;
            totalGrad: number | null;
            utbetaling: number | null;
        } | null;
    }>;
    varsler: Array<{
        __typename: 'VarselDTO';
        id: string;
        behandlingId: string;
        definisjonId: string;
        opprettet: string;
        kode: string;
        tittel: string;
        forklaring: string | null;
        handling: string | null;
        vurdering: {
            __typename: 'VarselvurderingDTO';
            ident: string;
            status: Types.Varselstatus;
            tidsstempel: string;
        } | null;
    }>;
    hendelser: Array<
        | { __typename: 'InntektHentetFraAOrdningen'; mottattDato: string; id: string; type: Types.Hendelsetype }
        | {
              __typename: 'Inntektsmelding';
              beregnetInntekt: number;
              mottattDato: string;
              eksternDokumentId: string | null;
              id: string;
              type: Types.Hendelsetype;
          }
        | {
              __typename: 'SoknadArbeidsgiver';
              fom: string;
              tom: string;
              rapportertDato: string;
              sendtArbeidsgiver: string;
              eksternDokumentId: string | null;
              id: string;
              type: Types.Hendelsetype;
          }
        | {
              __typename: 'SoknadArbeidsledig';
              fom: string;
              tom: string;
              rapportertDato: string;
              sendtNav: string;
              eksternDokumentId: string | null;
              id: string;
              type: Types.Hendelsetype;
          }
        | {
              __typename: 'SoknadFrilans';
              fom: string;
              tom: string;
              rapportertDato: string;
              sendtNav: string;
              eksternDokumentId: string | null;
              id: string;
              type: Types.Hendelsetype;
          }
        | {
              __typename: 'SoknadNav';
              fom: string;
              tom: string;
              rapportertDato: string;
              sendtNav: string;
              eksternDokumentId: string | null;
              id: string;
              type: Types.Hendelsetype;
          }
        | {
              __typename: 'SoknadSelvstendig';
              fom: string;
              tom: string;
              rapportertDato: string;
              sendtNav: string;
              eksternDokumentId: string | null;
              id: string;
              type: Types.Hendelsetype;
          }
        | {
              __typename: 'Sykmelding';
              fom: string;
              tom: string;
              rapportertDato: string;
              id: string;
              type: Types.Hendelsetype;
          }
    >;
};

export type Periode_UberegnetPeriode_Fragment = {
    __typename: 'UberegnetPeriode';
    behandlingId: string;
    fom: string;
    tom: string;
    erForkastet: boolean;
    inntektstype: Types.Inntektstype;
    opprettet: string;
    periodetype: Types.Periodetype;
    vedtaksperiodeId: string;
    periodetilstand: Types.Periodetilstand;
    skjaeringstidspunkt: string;
    tidslinje: Array<{
        __typename: 'Dag';
        dato: string;
        grad: number | null;
        sykdomsdagtype: Types.Sykdomsdagtype;
        utbetalingsdagtype: Types.Utbetalingsdagtype;
        begrunnelser: Array<Types.Begrunnelse> | null;
        kilde: { __typename: 'Kilde'; id: string; type: Types.Kildetype };
        utbetalingsinfo: {
            __typename: 'Utbetalingsinfo';
            arbeidsgiverbelop: number | null;
            inntekt: number | null;
            personbelop: number | null;
            refusjonsbelop: number | null;
            totalGrad: number | null;
            utbetaling: number | null;
        } | null;
    }>;
    varsler: Array<{
        __typename: 'VarselDTO';
        id: string;
        behandlingId: string;
        definisjonId: string;
        opprettet: string;
        kode: string;
        tittel: string;
        forklaring: string | null;
        handling: string | null;
        vurdering: {
            __typename: 'VarselvurderingDTO';
            ident: string;
            status: Types.Varselstatus;
            tidsstempel: string;
        } | null;
    }>;
    hendelser: Array<
        | { __typename: 'InntektHentetFraAOrdningen'; mottattDato: string; id: string; type: Types.Hendelsetype }
        | {
              __typename: 'Inntektsmelding';
              beregnetInntekt: number;
              mottattDato: string;
              eksternDokumentId: string | null;
              id: string;
              type: Types.Hendelsetype;
          }
        | {
              __typename: 'SoknadArbeidsgiver';
              fom: string;
              tom: string;
              rapportertDato: string;
              sendtArbeidsgiver: string;
              eksternDokumentId: string | null;
              id: string;
              type: Types.Hendelsetype;
          }
        | {
              __typename: 'SoknadArbeidsledig';
              fom: string;
              tom: string;
              rapportertDato: string;
              sendtNav: string;
              eksternDokumentId: string | null;
              id: string;
              type: Types.Hendelsetype;
          }
        | {
              __typename: 'SoknadFrilans';
              fom: string;
              tom: string;
              rapportertDato: string;
              sendtNav: string;
              eksternDokumentId: string | null;
              id: string;
              type: Types.Hendelsetype;
          }
        | {
              __typename: 'SoknadNav';
              fom: string;
              tom: string;
              rapportertDato: string;
              sendtNav: string;
              eksternDokumentId: string | null;
              id: string;
              type: Types.Hendelsetype;
          }
        | {
              __typename: 'SoknadSelvstendig';
              fom: string;
              tom: string;
              rapportertDato: string;
              sendtNav: string;
              eksternDokumentId: string | null;
              id: string;
              type: Types.Hendelsetype;
          }
        | {
              __typename: 'Sykmelding';
              fom: string;
              tom: string;
              rapportertDato: string;
              id: string;
              type: Types.Hendelsetype;
          }
    >;
};

export type PeriodeFragment = Periode_BeregnetPeriode_Fragment | Periode_UberegnetPeriode_Fragment;

export type PersonFragment = {
    __typename: 'Person';
    fodselsnummer: string;
    dodsdato: string | null;
    aktorId: string;
    andreFodselsnummer: Array<{ __typename: 'AnnetFodselsnummer'; fodselsnummer: string; personPseudoId: string }>;
    selvstendigNaering: {
        __typename: 'SelvstendigNaering';
        behandlinger: Array<{
            __typename: 'Behandling';
            id: string;
            perioder: Array<
                | {
                      __typename: 'BeregnetPeriode';
                      id: string;
                      forbrukteSykedager: number | null;
                      gjenstaendeSykedager: number | null;
                      vedtaksperiodeId: string;
                      maksdato: string;
                      vilkarsgrunnlagId: string | null;
                      grunnbelopsjustertGjennomsnitt: string | null;
                      behandlingId: string;
                      fom: string;
                      tom: string;
                      erForkastet: boolean;
                      inntektstype: Types.Inntektstype;
                      opprettet: string;
                      periodetype: Types.Periodetype;
                      periodetilstand: Types.Periodetilstand;
                      skjaeringstidspunkt: string;
                      handlinger: Array<{
                          __typename: 'Handling';
                          type: Types.Periodehandling;
                          tillatt: boolean;
                          begrunnelse: string | null;
                      }>;
                      historikkinnslag: Array<
                          | {
                                __typename: 'EndrePaVent';
                                frist: string | null;
                                arsaker: Array<string>;
                                notattekst: string | null;
                                id: number;
                                type: Types.PeriodehistorikkType;
                                timestamp: string;
                                saksbehandlerIdent: string | null;
                                dialogRef: number | null;
                                kommentarer: Array<{
                                    __typename: 'Kommentar';
                                    id: number;
                                    tekst: string;
                                    opprettet: string;
                                    saksbehandlerident: string;
                                    feilregistrert_tidspunkt: string | null;
                                }>;
                            }
                          | {
                                __typename: 'FjernetFraPaVent';
                                id: number;
                                type: Types.PeriodehistorikkType;
                                timestamp: string;
                                saksbehandlerIdent: string | null;
                                dialogRef: number | null;
                            }
                          | {
                                __typename: 'LagtPaVent';
                                frist: string | null;
                                arsaker: Array<string>;
                                notattekst: string | null;
                                id: number;
                                type: Types.PeriodehistorikkType;
                                timestamp: string;
                                saksbehandlerIdent: string | null;
                                dialogRef: number | null;
                                kommentarer: Array<{
                                    __typename: 'Kommentar';
                                    id: number;
                                    tekst: string;
                                    opprettet: string;
                                    saksbehandlerident: string;
                                    feilregistrert_tidspunkt: string | null;
                                }>;
                            }
                          | {
                                __typename: 'OpphevStansAutomatiskBehandlingSaksbehandler';
                                notattekst: string | null;
                                id: number;
                                type: Types.PeriodehistorikkType;
                                timestamp: string;
                                saksbehandlerIdent: string | null;
                                dialogRef: number | null;
                                kommentarer: Array<{
                                    __typename: 'Kommentar';
                                    id: number;
                                    tekst: string;
                                    opprettet: string;
                                    saksbehandlerident: string;
                                    feilregistrert_tidspunkt: string | null;
                                }>;
                            }
                          | {
                                __typename: 'PeriodeHistorikkElementNy';
                                id: number;
                                type: Types.PeriodehistorikkType;
                                timestamp: string;
                                saksbehandlerIdent: string | null;
                                dialogRef: number | null;
                            }
                          | {
                                __typename: 'StansAutomatiskBehandlingSaksbehandler';
                                notattekst: string | null;
                                id: number;
                                type: Types.PeriodehistorikkType;
                                timestamp: string;
                                saksbehandlerIdent: string | null;
                                dialogRef: number | null;
                                kommentarer: Array<{
                                    __typename: 'Kommentar';
                                    id: number;
                                    tekst: string;
                                    opprettet: string;
                                    saksbehandlerident: string;
                                    feilregistrert_tidspunkt: string | null;
                                }>;
                            }
                          | {
                                __typename: 'TotrinnsvurderingRetur';
                                notattekst: string | null;
                                id: number;
                                type: Types.PeriodehistorikkType;
                                timestamp: string;
                                saksbehandlerIdent: string | null;
                                dialogRef: number | null;
                                kommentarer: Array<{
                                    __typename: 'Kommentar';
                                    id: number;
                                    tekst: string;
                                    opprettet: string;
                                    saksbehandlerident: string;
                                    feilregistrert_tidspunkt: string | null;
                                }>;
                            }
                      >;
                      periodevilkar: {
                          __typename: 'Periodevilkar';
                          alder: { __typename: 'Alder'; alderSisteSykedag: number; oppfylt: boolean };
                          sykepengedager: {
                              __typename: 'Sykepengedager';
                              forbrukteSykedager: number | null;
                              gjenstaendeSykedager: number | null;
                              maksdato: string;
                              oppfylt: boolean;
                              skjaeringstidspunkt: string;
                          };
                      };
                      risikovurdering: {
                          __typename: 'Risikovurdering';
                          funn: Array<{
                              __typename: 'Faresignal';
                              beskrivelse: string;
                              kategori: Array<string>;
                          }> | null;
                          kontrollertOk: Array<{
                              __typename: 'Faresignal';
                              beskrivelse: string;
                              kategori: Array<string>;
                          }>;
                      } | null;
                      utbetaling: {
                          __typename: 'Utbetaling';
                          id: string;
                          arbeidsgiverFagsystemId: string;
                          arbeidsgiverNettoBelop: number;
                          personFagsystemId: string;
                          personNettoBelop: number;
                          status: Types.Utbetalingstatus;
                          type: Types.Utbetalingtype;
                          vurdering: {
                              __typename: 'Vurdering';
                              automatisk: boolean;
                              godkjent: boolean;
                              ident: string;
                              tidsstempel: string;
                          } | null;
                          arbeidsgiversimulering: {
                              __typename: 'Simulering';
                              fagsystemId: string;
                              totalbelop: number | null;
                              tidsstempel: string;
                              utbetalingslinjer: Array<{
                                  __typename: 'Simuleringslinje';
                                  fom: string;
                                  tom: string;
                                  dagsats: number;
                                  grad: number;
                              }>;
                              perioder: Array<{
                                  __typename: 'Simuleringsperiode';
                                  fom: string;
                                  tom: string;
                                  utbetalinger: Array<{
                                      __typename: 'Simuleringsutbetaling';
                                      mottakerId: string;
                                      mottakerNavn: string;
                                      forfall: string;
                                      feilkonto: boolean;
                                      detaljer: Array<{
                                          __typename: 'Simuleringsdetaljer';
                                          fom: string;
                                          tom: string;
                                          utbetalingstype: string;
                                          uforegrad: number;
                                          typeSats: string;
                                          tilbakeforing: boolean;
                                          sats: number;
                                          refunderesOrgNr: string;
                                          konto: string;
                                          klassekode: string;
                                          antallSats: number;
                                          belop: number;
                                          klassekodebeskrivelse: string;
                                      }>;
                                  }>;
                              }> | null;
                          } | null;
                          personsimulering: {
                              __typename: 'Simulering';
                              fagsystemId: string;
                              totalbelop: number | null;
                              tidsstempel: string;
                              utbetalingslinjer: Array<{
                                  __typename: 'Simuleringslinje';
                                  fom: string;
                                  tom: string;
                                  dagsats: number;
                                  grad: number;
                              }>;
                              perioder: Array<{
                                  __typename: 'Simuleringsperiode';
                                  fom: string;
                                  tom: string;
                                  utbetalinger: Array<{
                                      __typename: 'Simuleringsutbetaling';
                                      mottakerId: string;
                                      mottakerNavn: string;
                                      forfall: string;
                                      feilkonto: boolean;
                                      detaljer: Array<{
                                          __typename: 'Simuleringsdetaljer';
                                          fom: string;
                                          tom: string;
                                          utbetalingstype: string;
                                          uforegrad: number;
                                          typeSats: string;
                                          tilbakeforing: boolean;
                                          sats: number;
                                          refunderesOrgNr: string;
                                          konto: string;
                                          klassekode: string;
                                          antallSats: number;
                                          belop: number;
                                          klassekodebeskrivelse: string;
                                      }>;
                                  }>;
                              }> | null;
                          } | null;
                      };
                      oppgave: { __typename: 'OppgaveForPeriodevisning'; id: string } | null;
                      paVent: { __typename: 'PaVent'; frist: string | null; oid: string } | null;
                      totrinnsvurdering: {
                          __typename: 'Totrinnsvurdering';
                          erBeslutteroppgave: boolean;
                          erRetur: boolean;
                          saksbehandler: string | null;
                          beslutter: string | null;
                      } | null;
                      egenskaper: Array<{
                          __typename: 'Oppgaveegenskap';
                          egenskap: Types.Egenskap;
                          kategori: Types.Kategori;
                      }>;
                      avslag: Array<{
                          __typename: 'Avslag';
                          type: Types.Avslagstype;
                          begrunnelse: string;
                          opprettet: string;
                          saksbehandlerIdent: string;
                          invalidert: boolean;
                      }>;
                      vedtakBegrunnelser: Array<{
                          __typename: 'VedtakBegrunnelse';
                          utfall: Types.VedtakUtfall;
                          begrunnelse: string | null;
                          opprettet: string;
                          saksbehandlerIdent: string;
                      }>;
                      annullering: {
                          __typename: 'Annullering';
                          saksbehandlerIdent: string;
                          arbeidsgiverFagsystemId: string | null;
                          personFagsystemId: string | null;
                          tidspunkt: string;
                          arsaker: Array<string>;
                          begrunnelse: string | null;
                          vedtaksperiodeId: string;
                      } | null;
                      pensjonsgivendeInntekter: Array<{
                          __typename: 'PensjonsgivendeInntekt';
                          arligBelop: string;
                          inntektsar: number;
                      }>;
                      annulleringskandidater: Array<{
                          __typename: 'Annulleringskandidat';
                          fom: string;
                          organisasjonsnummer: string;
                          tom: string;
                          vedtaksperiodeId: string;
                      }>;
                      tidslinje: Array<{
                          __typename: 'Dag';
                          dato: string;
                          grad: number | null;
                          sykdomsdagtype: Types.Sykdomsdagtype;
                          utbetalingsdagtype: Types.Utbetalingsdagtype;
                          begrunnelser: Array<Types.Begrunnelse> | null;
                          kilde: { __typename: 'Kilde'; id: string; type: Types.Kildetype };
                          utbetalingsinfo: {
                              __typename: 'Utbetalingsinfo';
                              arbeidsgiverbelop: number | null;
                              inntekt: number | null;
                              personbelop: number | null;
                              refusjonsbelop: number | null;
                              totalGrad: number | null;
                              utbetaling: number | null;
                          } | null;
                      }>;
                      varsler: Array<{
                          __typename: 'VarselDTO';
                          id: string;
                          behandlingId: string;
                          definisjonId: string;
                          opprettet: string;
                          kode: string;
                          tittel: string;
                          forklaring: string | null;
                          handling: string | null;
                          vurdering: {
                              __typename: 'VarselvurderingDTO';
                              ident: string;
                              status: Types.Varselstatus;
                              tidsstempel: string;
                          } | null;
                      }>;
                      hendelser: Array<
                          | {
                                __typename: 'InntektHentetFraAOrdningen';
                                mottattDato: string;
                                id: string;
                                type: Types.Hendelsetype;
                            }
                          | {
                                __typename: 'Inntektsmelding';
                                beregnetInntekt: number;
                                mottattDato: string;
                                eksternDokumentId: string | null;
                                id: string;
                                type: Types.Hendelsetype;
                            }
                          | {
                                __typename: 'SoknadArbeidsgiver';
                                fom: string;
                                tom: string;
                                rapportertDato: string;
                                sendtArbeidsgiver: string;
                                eksternDokumentId: string | null;
                                id: string;
                                type: Types.Hendelsetype;
                            }
                          | {
                                __typename: 'SoknadArbeidsledig';
                                fom: string;
                                tom: string;
                                rapportertDato: string;
                                sendtNav: string;
                                eksternDokumentId: string | null;
                                id: string;
                                type: Types.Hendelsetype;
                            }
                          | {
                                __typename: 'SoknadFrilans';
                                fom: string;
                                tom: string;
                                rapportertDato: string;
                                sendtNav: string;
                                eksternDokumentId: string | null;
                                id: string;
                                type: Types.Hendelsetype;
                            }
                          | {
                                __typename: 'SoknadNav';
                                fom: string;
                                tom: string;
                                rapportertDato: string;
                                sendtNav: string;
                                eksternDokumentId: string | null;
                                id: string;
                                type: Types.Hendelsetype;
                            }
                          | {
                                __typename: 'SoknadSelvstendig';
                                fom: string;
                                tom: string;
                                rapportertDato: string;
                                sendtNav: string;
                                eksternDokumentId: string | null;
                                id: string;
                                type: Types.Hendelsetype;
                            }
                          | {
                                __typename: 'Sykmelding';
                                fom: string;
                                tom: string;
                                rapportertDato: string;
                                id: string;
                                type: Types.Hendelsetype;
                            }
                      >;
                  }
                | {
                      __typename: 'UberegnetPeriode';
                      id: string;
                      behandlingId: string;
                      fom: string;
                      tom: string;
                      erForkastet: boolean;
                      inntektstype: Types.Inntektstype;
                      opprettet: string;
                      periodetype: Types.Periodetype;
                      vedtaksperiodeId: string;
                      periodetilstand: Types.Periodetilstand;
                      skjaeringstidspunkt: string;
                      historikkinnslag: Array<
                          | {
                                __typename: 'EndrePaVent';
                                frist: string | null;
                                arsaker: Array<string>;
                                notattekst: string | null;
                                id: number;
                                type: Types.PeriodehistorikkType;
                                timestamp: string;
                                saksbehandlerIdent: string | null;
                                dialogRef: number | null;
                                kommentarer: Array<{
                                    __typename: 'Kommentar';
                                    id: number;
                                    tekst: string;
                                    opprettet: string;
                                    saksbehandlerident: string;
                                    feilregistrert_tidspunkt: string | null;
                                }>;
                            }
                          | {
                                __typename: 'FjernetFraPaVent';
                                id: number;
                                type: Types.PeriodehistorikkType;
                                timestamp: string;
                                saksbehandlerIdent: string | null;
                                dialogRef: number | null;
                            }
                          | {
                                __typename: 'LagtPaVent';
                                frist: string | null;
                                arsaker: Array<string>;
                                notattekst: string | null;
                                id: number;
                                type: Types.PeriodehistorikkType;
                                timestamp: string;
                                saksbehandlerIdent: string | null;
                                dialogRef: number | null;
                                kommentarer: Array<{
                                    __typename: 'Kommentar';
                                    id: number;
                                    tekst: string;
                                    opprettet: string;
                                    saksbehandlerident: string;
                                    feilregistrert_tidspunkt: string | null;
                                }>;
                            }
                          | {
                                __typename: 'OpphevStansAutomatiskBehandlingSaksbehandler';
                                notattekst: string | null;
                                id: number;
                                type: Types.PeriodehistorikkType;
                                timestamp: string;
                                saksbehandlerIdent: string | null;
                                dialogRef: number | null;
                                kommentarer: Array<{
                                    __typename: 'Kommentar';
                                    id: number;
                                    tekst: string;
                                    opprettet: string;
                                    saksbehandlerident: string;
                                    feilregistrert_tidspunkt: string | null;
                                }>;
                            }
                          | {
                                __typename: 'PeriodeHistorikkElementNy';
                                id: number;
                                type: Types.PeriodehistorikkType;
                                timestamp: string;
                                saksbehandlerIdent: string | null;
                                dialogRef: number | null;
                            }
                          | {
                                __typename: 'StansAutomatiskBehandlingSaksbehandler';
                                notattekst: string | null;
                                id: number;
                                type: Types.PeriodehistorikkType;
                                timestamp: string;
                                saksbehandlerIdent: string | null;
                                dialogRef: number | null;
                                kommentarer: Array<{
                                    __typename: 'Kommentar';
                                    id: number;
                                    tekst: string;
                                    opprettet: string;
                                    saksbehandlerident: string;
                                    feilregistrert_tidspunkt: string | null;
                                }>;
                            }
                          | {
                                __typename: 'TotrinnsvurderingRetur';
                                notattekst: string | null;
                                id: number;
                                type: Types.PeriodehistorikkType;
                                timestamp: string;
                                saksbehandlerIdent: string | null;
                                dialogRef: number | null;
                                kommentarer: Array<{
                                    __typename: 'Kommentar';
                                    id: number;
                                    tekst: string;
                                    opprettet: string;
                                    saksbehandlerident: string;
                                    feilregistrert_tidspunkt: string | null;
                                }>;
                            }
                      >;
                      tidslinje: Array<{
                          __typename: 'Dag';
                          dato: string;
                          grad: number | null;
                          sykdomsdagtype: Types.Sykdomsdagtype;
                          utbetalingsdagtype: Types.Utbetalingsdagtype;
                          begrunnelser: Array<Types.Begrunnelse> | null;
                          kilde: { __typename: 'Kilde'; id: string; type: Types.Kildetype };
                          utbetalingsinfo: {
                              __typename: 'Utbetalingsinfo';
                              arbeidsgiverbelop: number | null;
                              inntekt: number | null;
                              personbelop: number | null;
                              refusjonsbelop: number | null;
                              totalGrad: number | null;
                              utbetaling: number | null;
                          } | null;
                      }>;
                      varsler: Array<{
                          __typename: 'VarselDTO';
                          id: string;
                          behandlingId: string;
                          definisjonId: string;
                          opprettet: string;
                          kode: string;
                          tittel: string;
                          forklaring: string | null;
                          handling: string | null;
                          vurdering: {
                              __typename: 'VarselvurderingDTO';
                              ident: string;
                              status: Types.Varselstatus;
                              tidsstempel: string;
                          } | null;
                      }>;
                      hendelser: Array<
                          | {
                                __typename: 'InntektHentetFraAOrdningen';
                                mottattDato: string;
                                id: string;
                                type: Types.Hendelsetype;
                            }
                          | {
                                __typename: 'Inntektsmelding';
                                beregnetInntekt: number;
                                mottattDato: string;
                                eksternDokumentId: string | null;
                                id: string;
                                type: Types.Hendelsetype;
                            }
                          | {
                                __typename: 'SoknadArbeidsgiver';
                                fom: string;
                                tom: string;
                                rapportertDato: string;
                                sendtArbeidsgiver: string;
                                eksternDokumentId: string | null;
                                id: string;
                                type: Types.Hendelsetype;
                            }
                          | {
                                __typename: 'SoknadArbeidsledig';
                                fom: string;
                                tom: string;
                                rapportertDato: string;
                                sendtNav: string;
                                eksternDokumentId: string | null;
                                id: string;
                                type: Types.Hendelsetype;
                            }
                          | {
                                __typename: 'SoknadFrilans';
                                fom: string;
                                tom: string;
                                rapportertDato: string;
                                sendtNav: string;
                                eksternDokumentId: string | null;
                                id: string;
                                type: Types.Hendelsetype;
                            }
                          | {
                                __typename: 'SoknadNav';
                                fom: string;
                                tom: string;
                                rapportertDato: string;
                                sendtNav: string;
                                eksternDokumentId: string | null;
                                id: string;
                                type: Types.Hendelsetype;
                            }
                          | {
                                __typename: 'SoknadSelvstendig';
                                fom: string;
                                tom: string;
                                rapportertDato: string;
                                sendtNav: string;
                                eksternDokumentId: string | null;
                                id: string;
                                type: Types.Hendelsetype;
                            }
                          | {
                                __typename: 'Sykmelding';
                                fom: string;
                                tom: string;
                                rapportertDato: string;
                                id: string;
                                type: Types.Hendelsetype;
                            }
                      >;
                  }
            >;
        }>;
        overstyringer: Array<
            | {
                  __typename: 'Arbeidsforholdoverstyring';
                  begrunnelse: string;
                  deaktivert: boolean;
                  skjaeringstidspunkt: string;
                  forklaring: string;
                  hendelseId: string;
                  timestamp: string;
                  ferdigstilt: boolean;
                  vedtaksperiodeId: string;
                  saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
              }
            | {
                  __typename: 'Dagoverstyring';
                  begrunnelse: string;
                  hendelseId: string;
                  timestamp: string;
                  ferdigstilt: boolean;
                  vedtaksperiodeId: string;
                  dager: Array<{
                      __typename: 'OverstyrtDag';
                      grad: number | null;
                      fraGrad: number | null;
                      dato: string;
                      type: Types.Dagtype;
                      fraType: Types.Dagtype | null;
                  }>;
                  saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
              }
            | {
                  __typename: 'Inntektoverstyring';
                  hendelseId: string;
                  timestamp: string;
                  ferdigstilt: boolean;
                  vedtaksperiodeId: string;
                  inntekt: {
                      __typename: 'OverstyrtInntekt';
                      skjaeringstidspunkt: string;
                      forklaring: string;
                      begrunnelse: string;
                      manedligInntekt: number;
                      fraManedligInntekt: number | null;
                      refusjonsopplysninger: Array<{
                          __typename: 'Refusjonsopplysning';
                          fom: string;
                          tom: string | null;
                          belop: number;
                      }> | null;
                      fraRefusjonsopplysninger: Array<{
                          __typename: 'Refusjonsopplysning';
                          fom: string;
                          tom: string | null;
                          belop: number;
                      }> | null;
                  };
                  saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
              }
            | {
                  __typename: 'MinimumSykdomsgradOverstyring';
                  hendelseId: string;
                  timestamp: string;
                  ferdigstilt: boolean;
                  vedtaksperiodeId: string;
                  minimumSykdomsgrad: {
                      __typename: 'OverstyrtMinimumSykdomsgrad';
                      begrunnelse: string;
                      initierendeVedtaksperiodeId: string;
                      perioderVurdertOk: Array<{
                          __typename: 'OverstyrtMinimumSykdomsgradPeriode';
                          fom: string;
                          tom: string;
                      }>;
                      perioderVurdertIkkeOk: Array<{
                          __typename: 'OverstyrtMinimumSykdomsgradPeriode';
                          fom: string;
                          tom: string;
                      }>;
                  };
                  saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
              }
            | {
                  __typename: 'Sykepengegrunnlagskjonnsfastsetting';
                  hendelseId: string;
                  timestamp: string;
                  ferdigstilt: boolean;
                  vedtaksperiodeId: string;
                  skjonnsfastsatt: {
                      __typename: 'SkjonnsfastsattSykepengegrunnlag';
                      arsak: string;
                      type: Types.Skjonnsfastsettingstype | null;
                      begrunnelse: string | null;
                      begrunnelseMal: string | null;
                      begrunnelseFritekst: string | null;
                      begrunnelseKonklusjon: string | null;
                      arlig: number;
                      fraArlig: number | null;
                      skjaeringstidspunkt: string;
                  };
                  saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
              }
        >;
    } | null;
    tildeling: { __typename: 'Tildeling'; navn: string; epost: string; oid: string } | null;
    vilkarsgrunnlagV2: Array<
        | {
              __typename: 'VilkarsgrunnlagInfotrygdV2';
              omregnetArsinntekt: number;
              opptjeningsvurderingId: string;
              id: string;
              sykepengegrunnlag: number;
              skjaeringstidspunkt: string;
              inntekter: Array<{
                  __typename: 'Arbeidsgiverinntekt';
                  arbeidsgiver: string;
                  deaktivert: boolean | null;
                  fom: string | null;
                  tom: string | null;
                  sammenligningsgrunnlag: {
                      __typename: 'Sammenligningsgrunnlag';
                      belop: number;
                      inntektFraAOrdningen: Array<{ __typename: 'InntektFraAOrdningen'; maned: string; sum: number }>;
                  } | null;
                  omregnetArsinntekt: {
                      __typename: 'OmregnetArsinntekt';
                      belop: number;
                      manedsbelop: number;
                      kilde: Types.Inntektskilde;
                      inntektFraAOrdningen: Array<{
                          __typename: 'InntektFraAOrdningen';
                          maned: string;
                          sum: number;
                      }> | null;
                  } | null;
                  skjonnsmessigFastsatt: {
                      __typename: 'OmregnetArsinntekt';
                      belop: number;
                      manedsbelop: number;
                      kilde: Types.Inntektskilde;
                      inntektFraAOrdningen: Array<{
                          __typename: 'InntektFraAOrdningen';
                          maned: string;
                          sum: number;
                      }> | null;
                  } | null;
              }>;
              arbeidsgiverrefusjoner: Array<{
                  __typename: 'Arbeidsgiverrefusjon';
                  arbeidsgiver: string;
                  refusjonsopplysninger: Array<{
                      __typename: 'Refusjonselement';
                      fom: string;
                      tom: string | null;
                      belop: number;
                      meldingsreferanseId: string;
                  }>;
              }>;
          }
        | {
              __typename: 'VilkarsgrunnlagSpleisV2';
              skjonnsmessigFastsattAarlig: number | null;
              vurderingAvKravOmMedlemskap: Types.VilkarsgrunnlagVurdering;
              oppfyllerKravOmMinstelonn: boolean;
              oppfyllerKravOmOpptjening: boolean;
              antallOpptjeningsdagerErMinst: number;
              grunnbelop: number;
              opptjeningFra: string;
              opptjeningsvurderingId: string;
              beregningsgrunnlag: string;
              forsikringsvurderingId: string | null;
              id: string;
              sykepengegrunnlag: number;
              skjaeringstidspunkt: string;
              sykepengegrunnlagsgrense: {
                  __typename: 'Sykepengegrunnlagsgrense';
                  grunnbelop: number;
                  grense: number;
                  virkningstidspunkt: string;
              };
              avviksvurdering: {
                  __typename: 'VilkarsgrunnlagAvviksvurdering';
                  avviksprosent: string;
                  beregningsgrunnlag: string;
                  sammenligningsgrunnlag: string;
              } | null;
              inntekter: Array<{
                  __typename: 'Arbeidsgiverinntekt';
                  arbeidsgiver: string;
                  deaktivert: boolean | null;
                  fom: string | null;
                  tom: string | null;
                  sammenligningsgrunnlag: {
                      __typename: 'Sammenligningsgrunnlag';
                      belop: number;
                      inntektFraAOrdningen: Array<{ __typename: 'InntektFraAOrdningen'; maned: string; sum: number }>;
                  } | null;
                  omregnetArsinntekt: {
                      __typename: 'OmregnetArsinntekt';
                      belop: number;
                      manedsbelop: number;
                      kilde: Types.Inntektskilde;
                      inntektFraAOrdningen: Array<{
                          __typename: 'InntektFraAOrdningen';
                          maned: string;
                          sum: number;
                      }> | null;
                  } | null;
                  skjonnsmessigFastsatt: {
                      __typename: 'OmregnetArsinntekt';
                      belop: number;
                      manedsbelop: number;
                      kilde: Types.Inntektskilde;
                      inntektFraAOrdningen: Array<{
                          __typename: 'InntektFraAOrdningen';
                          maned: string;
                          sum: number;
                      }> | null;
                  } | null;
              }>;
              arbeidsgiverrefusjoner: Array<{
                  __typename: 'Arbeidsgiverrefusjon';
                  arbeidsgiver: string;
                  refusjonsopplysninger: Array<{
                      __typename: 'Refusjonselement';
                      fom: string;
                      tom: string | null;
                      belop: number;
                      meldingsreferanseId: string;
                  }>;
              }>;
          }
    >;
    arbeidsgivere: Array<{
        __typename: 'Arbeidsgiver';
        navn: string;
        organisasjonsnummer: string;
        arbeidsforhold: Array<{
            __typename: 'Arbeidsforhold';
            sluttdato: string | null;
            startdato: string;
            stillingsprosent: number;
            stillingstittel: string;
        }>;
        ghostPerioder: Array<{
            __typename: 'GhostPeriode';
            id: string;
            deaktivert: boolean;
            vilkarsgrunnlagId: string | null;
            skjaeringstidspunkt: string;
            fom: string;
            tom: string;
            organisasjonsnummer: string;
        }>;
        behandlinger: Array<{
            __typename: 'Behandling';
            id: string;
            perioder: Array<
                | {
                      __typename: 'BeregnetPeriode';
                      id: string;
                      forbrukteSykedager: number | null;
                      gjenstaendeSykedager: number | null;
                      vedtaksperiodeId: string;
                      maksdato: string;
                      vilkarsgrunnlagId: string | null;
                      grunnbelopsjustertGjennomsnitt: string | null;
                      behandlingId: string;
                      fom: string;
                      tom: string;
                      erForkastet: boolean;
                      inntektstype: Types.Inntektstype;
                      opprettet: string;
                      periodetype: Types.Periodetype;
                      periodetilstand: Types.Periodetilstand;
                      skjaeringstidspunkt: string;
                      handlinger: Array<{
                          __typename: 'Handling';
                          type: Types.Periodehandling;
                          tillatt: boolean;
                          begrunnelse: string | null;
                      }>;
                      historikkinnslag: Array<
                          | {
                                __typename: 'EndrePaVent';
                                frist: string | null;
                                arsaker: Array<string>;
                                notattekst: string | null;
                                id: number;
                                type: Types.PeriodehistorikkType;
                                timestamp: string;
                                saksbehandlerIdent: string | null;
                                dialogRef: number | null;
                                kommentarer: Array<{
                                    __typename: 'Kommentar';
                                    id: number;
                                    tekst: string;
                                    opprettet: string;
                                    saksbehandlerident: string;
                                    feilregistrert_tidspunkt: string | null;
                                }>;
                            }
                          | {
                                __typename: 'FjernetFraPaVent';
                                id: number;
                                type: Types.PeriodehistorikkType;
                                timestamp: string;
                                saksbehandlerIdent: string | null;
                                dialogRef: number | null;
                            }
                          | {
                                __typename: 'LagtPaVent';
                                frist: string | null;
                                arsaker: Array<string>;
                                notattekst: string | null;
                                id: number;
                                type: Types.PeriodehistorikkType;
                                timestamp: string;
                                saksbehandlerIdent: string | null;
                                dialogRef: number | null;
                                kommentarer: Array<{
                                    __typename: 'Kommentar';
                                    id: number;
                                    tekst: string;
                                    opprettet: string;
                                    saksbehandlerident: string;
                                    feilregistrert_tidspunkt: string | null;
                                }>;
                            }
                          | {
                                __typename: 'OpphevStansAutomatiskBehandlingSaksbehandler';
                                notattekst: string | null;
                                id: number;
                                type: Types.PeriodehistorikkType;
                                timestamp: string;
                                saksbehandlerIdent: string | null;
                                dialogRef: number | null;
                                kommentarer: Array<{
                                    __typename: 'Kommentar';
                                    id: number;
                                    tekst: string;
                                    opprettet: string;
                                    saksbehandlerident: string;
                                    feilregistrert_tidspunkt: string | null;
                                }>;
                            }
                          | {
                                __typename: 'PeriodeHistorikkElementNy';
                                id: number;
                                type: Types.PeriodehistorikkType;
                                timestamp: string;
                                saksbehandlerIdent: string | null;
                                dialogRef: number | null;
                            }
                          | {
                                __typename: 'StansAutomatiskBehandlingSaksbehandler';
                                notattekst: string | null;
                                id: number;
                                type: Types.PeriodehistorikkType;
                                timestamp: string;
                                saksbehandlerIdent: string | null;
                                dialogRef: number | null;
                                kommentarer: Array<{
                                    __typename: 'Kommentar';
                                    id: number;
                                    tekst: string;
                                    opprettet: string;
                                    saksbehandlerident: string;
                                    feilregistrert_tidspunkt: string | null;
                                }>;
                            }
                          | {
                                __typename: 'TotrinnsvurderingRetur';
                                notattekst: string | null;
                                id: number;
                                type: Types.PeriodehistorikkType;
                                timestamp: string;
                                saksbehandlerIdent: string | null;
                                dialogRef: number | null;
                                kommentarer: Array<{
                                    __typename: 'Kommentar';
                                    id: number;
                                    tekst: string;
                                    opprettet: string;
                                    saksbehandlerident: string;
                                    feilregistrert_tidspunkt: string | null;
                                }>;
                            }
                      >;
                      periodevilkar: {
                          __typename: 'Periodevilkar';
                          alder: { __typename: 'Alder'; alderSisteSykedag: number; oppfylt: boolean };
                          sykepengedager: {
                              __typename: 'Sykepengedager';
                              forbrukteSykedager: number | null;
                              gjenstaendeSykedager: number | null;
                              maksdato: string;
                              oppfylt: boolean;
                              skjaeringstidspunkt: string;
                          };
                      };
                      risikovurdering: {
                          __typename: 'Risikovurdering';
                          funn: Array<{
                              __typename: 'Faresignal';
                              beskrivelse: string;
                              kategori: Array<string>;
                          }> | null;
                          kontrollertOk: Array<{
                              __typename: 'Faresignal';
                              beskrivelse: string;
                              kategori: Array<string>;
                          }>;
                      } | null;
                      utbetaling: {
                          __typename: 'Utbetaling';
                          id: string;
                          arbeidsgiverFagsystemId: string;
                          arbeidsgiverNettoBelop: number;
                          personFagsystemId: string;
                          personNettoBelop: number;
                          status: Types.Utbetalingstatus;
                          type: Types.Utbetalingtype;
                          vurdering: {
                              __typename: 'Vurdering';
                              automatisk: boolean;
                              godkjent: boolean;
                              ident: string;
                              tidsstempel: string;
                          } | null;
                          arbeidsgiversimulering: {
                              __typename: 'Simulering';
                              fagsystemId: string;
                              totalbelop: number | null;
                              tidsstempel: string;
                              utbetalingslinjer: Array<{
                                  __typename: 'Simuleringslinje';
                                  fom: string;
                                  tom: string;
                                  dagsats: number;
                                  grad: number;
                              }>;
                              perioder: Array<{
                                  __typename: 'Simuleringsperiode';
                                  fom: string;
                                  tom: string;
                                  utbetalinger: Array<{
                                      __typename: 'Simuleringsutbetaling';
                                      mottakerId: string;
                                      mottakerNavn: string;
                                      forfall: string;
                                      feilkonto: boolean;
                                      detaljer: Array<{
                                          __typename: 'Simuleringsdetaljer';
                                          fom: string;
                                          tom: string;
                                          utbetalingstype: string;
                                          uforegrad: number;
                                          typeSats: string;
                                          tilbakeforing: boolean;
                                          sats: number;
                                          refunderesOrgNr: string;
                                          konto: string;
                                          klassekode: string;
                                          antallSats: number;
                                          belop: number;
                                          klassekodebeskrivelse: string;
                                      }>;
                                  }>;
                              }> | null;
                          } | null;
                          personsimulering: {
                              __typename: 'Simulering';
                              fagsystemId: string;
                              totalbelop: number | null;
                              tidsstempel: string;
                              utbetalingslinjer: Array<{
                                  __typename: 'Simuleringslinje';
                                  fom: string;
                                  tom: string;
                                  dagsats: number;
                                  grad: number;
                              }>;
                              perioder: Array<{
                                  __typename: 'Simuleringsperiode';
                                  fom: string;
                                  tom: string;
                                  utbetalinger: Array<{
                                      __typename: 'Simuleringsutbetaling';
                                      mottakerId: string;
                                      mottakerNavn: string;
                                      forfall: string;
                                      feilkonto: boolean;
                                      detaljer: Array<{
                                          __typename: 'Simuleringsdetaljer';
                                          fom: string;
                                          tom: string;
                                          utbetalingstype: string;
                                          uforegrad: number;
                                          typeSats: string;
                                          tilbakeforing: boolean;
                                          sats: number;
                                          refunderesOrgNr: string;
                                          konto: string;
                                          klassekode: string;
                                          antallSats: number;
                                          belop: number;
                                          klassekodebeskrivelse: string;
                                      }>;
                                  }>;
                              }> | null;
                          } | null;
                      };
                      oppgave: { __typename: 'OppgaveForPeriodevisning'; id: string } | null;
                      paVent: { __typename: 'PaVent'; frist: string | null; oid: string } | null;
                      totrinnsvurdering: {
                          __typename: 'Totrinnsvurdering';
                          erBeslutteroppgave: boolean;
                          erRetur: boolean;
                          saksbehandler: string | null;
                          beslutter: string | null;
                      } | null;
                      egenskaper: Array<{
                          __typename: 'Oppgaveegenskap';
                          egenskap: Types.Egenskap;
                          kategori: Types.Kategori;
                      }>;
                      avslag: Array<{
                          __typename: 'Avslag';
                          type: Types.Avslagstype;
                          begrunnelse: string;
                          opprettet: string;
                          saksbehandlerIdent: string;
                          invalidert: boolean;
                      }>;
                      vedtakBegrunnelser: Array<{
                          __typename: 'VedtakBegrunnelse';
                          utfall: Types.VedtakUtfall;
                          begrunnelse: string | null;
                          opprettet: string;
                          saksbehandlerIdent: string;
                      }>;
                      annullering: {
                          __typename: 'Annullering';
                          saksbehandlerIdent: string;
                          arbeidsgiverFagsystemId: string | null;
                          personFagsystemId: string | null;
                          tidspunkt: string;
                          arsaker: Array<string>;
                          begrunnelse: string | null;
                          vedtaksperiodeId: string;
                      } | null;
                      pensjonsgivendeInntekter: Array<{
                          __typename: 'PensjonsgivendeInntekt';
                          arligBelop: string;
                          inntektsar: number;
                      }>;
                      annulleringskandidater: Array<{
                          __typename: 'Annulleringskandidat';
                          fom: string;
                          organisasjonsnummer: string;
                          tom: string;
                          vedtaksperiodeId: string;
                      }>;
                      tidslinje: Array<{
                          __typename: 'Dag';
                          dato: string;
                          grad: number | null;
                          sykdomsdagtype: Types.Sykdomsdagtype;
                          utbetalingsdagtype: Types.Utbetalingsdagtype;
                          begrunnelser: Array<Types.Begrunnelse> | null;
                          kilde: { __typename: 'Kilde'; id: string; type: Types.Kildetype };
                          utbetalingsinfo: {
                              __typename: 'Utbetalingsinfo';
                              arbeidsgiverbelop: number | null;
                              inntekt: number | null;
                              personbelop: number | null;
                              refusjonsbelop: number | null;
                              totalGrad: number | null;
                              utbetaling: number | null;
                          } | null;
                      }>;
                      varsler: Array<{
                          __typename: 'VarselDTO';
                          id: string;
                          behandlingId: string;
                          definisjonId: string;
                          opprettet: string;
                          kode: string;
                          tittel: string;
                          forklaring: string | null;
                          handling: string | null;
                          vurdering: {
                              __typename: 'VarselvurderingDTO';
                              ident: string;
                              status: Types.Varselstatus;
                              tidsstempel: string;
                          } | null;
                      }>;
                      hendelser: Array<
                          | {
                                __typename: 'InntektHentetFraAOrdningen';
                                mottattDato: string;
                                id: string;
                                type: Types.Hendelsetype;
                            }
                          | {
                                __typename: 'Inntektsmelding';
                                beregnetInntekt: number;
                                mottattDato: string;
                                eksternDokumentId: string | null;
                                id: string;
                                type: Types.Hendelsetype;
                            }
                          | {
                                __typename: 'SoknadArbeidsgiver';
                                fom: string;
                                tom: string;
                                rapportertDato: string;
                                sendtArbeidsgiver: string;
                                eksternDokumentId: string | null;
                                id: string;
                                type: Types.Hendelsetype;
                            }
                          | {
                                __typename: 'SoknadArbeidsledig';
                                fom: string;
                                tom: string;
                                rapportertDato: string;
                                sendtNav: string;
                                eksternDokumentId: string | null;
                                id: string;
                                type: Types.Hendelsetype;
                            }
                          | {
                                __typename: 'SoknadFrilans';
                                fom: string;
                                tom: string;
                                rapportertDato: string;
                                sendtNav: string;
                                eksternDokumentId: string | null;
                                id: string;
                                type: Types.Hendelsetype;
                            }
                          | {
                                __typename: 'SoknadNav';
                                fom: string;
                                tom: string;
                                rapportertDato: string;
                                sendtNav: string;
                                eksternDokumentId: string | null;
                                id: string;
                                type: Types.Hendelsetype;
                            }
                          | {
                                __typename: 'SoknadSelvstendig';
                                fom: string;
                                tom: string;
                                rapportertDato: string;
                                sendtNav: string;
                                eksternDokumentId: string | null;
                                id: string;
                                type: Types.Hendelsetype;
                            }
                          | {
                                __typename: 'Sykmelding';
                                fom: string;
                                tom: string;
                                rapportertDato: string;
                                id: string;
                                type: Types.Hendelsetype;
                            }
                      >;
                  }
                | {
                      __typename: 'UberegnetPeriode';
                      id: string;
                      behandlingId: string;
                      fom: string;
                      tom: string;
                      erForkastet: boolean;
                      inntektstype: Types.Inntektstype;
                      opprettet: string;
                      periodetype: Types.Periodetype;
                      vedtaksperiodeId: string;
                      periodetilstand: Types.Periodetilstand;
                      skjaeringstidspunkt: string;
                      historikkinnslag: Array<
                          | {
                                __typename: 'EndrePaVent';
                                frist: string | null;
                                arsaker: Array<string>;
                                notattekst: string | null;
                                id: number;
                                type: Types.PeriodehistorikkType;
                                timestamp: string;
                                saksbehandlerIdent: string | null;
                                dialogRef: number | null;
                                kommentarer: Array<{
                                    __typename: 'Kommentar';
                                    id: number;
                                    tekst: string;
                                    opprettet: string;
                                    saksbehandlerident: string;
                                    feilregistrert_tidspunkt: string | null;
                                }>;
                            }
                          | {
                                __typename: 'FjernetFraPaVent';
                                id: number;
                                type: Types.PeriodehistorikkType;
                                timestamp: string;
                                saksbehandlerIdent: string | null;
                                dialogRef: number | null;
                            }
                          | {
                                __typename: 'LagtPaVent';
                                frist: string | null;
                                arsaker: Array<string>;
                                notattekst: string | null;
                                id: number;
                                type: Types.PeriodehistorikkType;
                                timestamp: string;
                                saksbehandlerIdent: string | null;
                                dialogRef: number | null;
                                kommentarer: Array<{
                                    __typename: 'Kommentar';
                                    id: number;
                                    tekst: string;
                                    opprettet: string;
                                    saksbehandlerident: string;
                                    feilregistrert_tidspunkt: string | null;
                                }>;
                            }
                          | {
                                __typename: 'OpphevStansAutomatiskBehandlingSaksbehandler';
                                notattekst: string | null;
                                id: number;
                                type: Types.PeriodehistorikkType;
                                timestamp: string;
                                saksbehandlerIdent: string | null;
                                dialogRef: number | null;
                                kommentarer: Array<{
                                    __typename: 'Kommentar';
                                    id: number;
                                    tekst: string;
                                    opprettet: string;
                                    saksbehandlerident: string;
                                    feilregistrert_tidspunkt: string | null;
                                }>;
                            }
                          | {
                                __typename: 'PeriodeHistorikkElementNy';
                                id: number;
                                type: Types.PeriodehistorikkType;
                                timestamp: string;
                                saksbehandlerIdent: string | null;
                                dialogRef: number | null;
                            }
                          | {
                                __typename: 'StansAutomatiskBehandlingSaksbehandler';
                                notattekst: string | null;
                                id: number;
                                type: Types.PeriodehistorikkType;
                                timestamp: string;
                                saksbehandlerIdent: string | null;
                                dialogRef: number | null;
                                kommentarer: Array<{
                                    __typename: 'Kommentar';
                                    id: number;
                                    tekst: string;
                                    opprettet: string;
                                    saksbehandlerident: string;
                                    feilregistrert_tidspunkt: string | null;
                                }>;
                            }
                          | {
                                __typename: 'TotrinnsvurderingRetur';
                                notattekst: string | null;
                                id: number;
                                type: Types.PeriodehistorikkType;
                                timestamp: string;
                                saksbehandlerIdent: string | null;
                                dialogRef: number | null;
                                kommentarer: Array<{
                                    __typename: 'Kommentar';
                                    id: number;
                                    tekst: string;
                                    opprettet: string;
                                    saksbehandlerident: string;
                                    feilregistrert_tidspunkt: string | null;
                                }>;
                            }
                      >;
                      tidslinje: Array<{
                          __typename: 'Dag';
                          dato: string;
                          grad: number | null;
                          sykdomsdagtype: Types.Sykdomsdagtype;
                          utbetalingsdagtype: Types.Utbetalingsdagtype;
                          begrunnelser: Array<Types.Begrunnelse> | null;
                          kilde: { __typename: 'Kilde'; id: string; type: Types.Kildetype };
                          utbetalingsinfo: {
                              __typename: 'Utbetalingsinfo';
                              arbeidsgiverbelop: number | null;
                              inntekt: number | null;
                              personbelop: number | null;
                              refusjonsbelop: number | null;
                              totalGrad: number | null;
                              utbetaling: number | null;
                          } | null;
                      }>;
                      varsler: Array<{
                          __typename: 'VarselDTO';
                          id: string;
                          behandlingId: string;
                          definisjonId: string;
                          opprettet: string;
                          kode: string;
                          tittel: string;
                          forklaring: string | null;
                          handling: string | null;
                          vurdering: {
                              __typename: 'VarselvurderingDTO';
                              ident: string;
                              status: Types.Varselstatus;
                              tidsstempel: string;
                          } | null;
                      }>;
                      hendelser: Array<
                          | {
                                __typename: 'InntektHentetFraAOrdningen';
                                mottattDato: string;
                                id: string;
                                type: Types.Hendelsetype;
                            }
                          | {
                                __typename: 'Inntektsmelding';
                                beregnetInntekt: number;
                                mottattDato: string;
                                eksternDokumentId: string | null;
                                id: string;
                                type: Types.Hendelsetype;
                            }
                          | {
                                __typename: 'SoknadArbeidsgiver';
                                fom: string;
                                tom: string;
                                rapportertDato: string;
                                sendtArbeidsgiver: string;
                                eksternDokumentId: string | null;
                                id: string;
                                type: Types.Hendelsetype;
                            }
                          | {
                                __typename: 'SoknadArbeidsledig';
                                fom: string;
                                tom: string;
                                rapportertDato: string;
                                sendtNav: string;
                                eksternDokumentId: string | null;
                                id: string;
                                type: Types.Hendelsetype;
                            }
                          | {
                                __typename: 'SoknadFrilans';
                                fom: string;
                                tom: string;
                                rapportertDato: string;
                                sendtNav: string;
                                eksternDokumentId: string | null;
                                id: string;
                                type: Types.Hendelsetype;
                            }
                          | {
                                __typename: 'SoknadNav';
                                fom: string;
                                tom: string;
                                rapportertDato: string;
                                sendtNav: string;
                                eksternDokumentId: string | null;
                                id: string;
                                type: Types.Hendelsetype;
                            }
                          | {
                                __typename: 'SoknadSelvstendig';
                                fom: string;
                                tom: string;
                                rapportertDato: string;
                                sendtNav: string;
                                eksternDokumentId: string | null;
                                id: string;
                                type: Types.Hendelsetype;
                            }
                          | {
                                __typename: 'Sykmelding';
                                fom: string;
                                tom: string;
                                rapportertDato: string;
                                id: string;
                                type: Types.Hendelsetype;
                            }
                      >;
                  }
            >;
        }>;
        overstyringer: Array<
            | {
                  __typename: 'Arbeidsforholdoverstyring';
                  begrunnelse: string;
                  deaktivert: boolean;
                  skjaeringstidspunkt: string;
                  forklaring: string;
                  hendelseId: string;
                  timestamp: string;
                  ferdigstilt: boolean;
                  vedtaksperiodeId: string;
                  saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
              }
            | {
                  __typename: 'Dagoverstyring';
                  begrunnelse: string;
                  hendelseId: string;
                  timestamp: string;
                  ferdigstilt: boolean;
                  vedtaksperiodeId: string;
                  dager: Array<{
                      __typename: 'OverstyrtDag';
                      grad: number | null;
                      fraGrad: number | null;
                      dato: string;
                      type: Types.Dagtype;
                      fraType: Types.Dagtype | null;
                  }>;
                  saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
              }
            | {
                  __typename: 'Inntektoverstyring';
                  hendelseId: string;
                  timestamp: string;
                  ferdigstilt: boolean;
                  vedtaksperiodeId: string;
                  inntekt: {
                      __typename: 'OverstyrtInntekt';
                      skjaeringstidspunkt: string;
                      forklaring: string;
                      begrunnelse: string;
                      manedligInntekt: number;
                      fraManedligInntekt: number | null;
                      refusjonsopplysninger: Array<{
                          __typename: 'Refusjonsopplysning';
                          fom: string;
                          tom: string | null;
                          belop: number;
                      }> | null;
                      fraRefusjonsopplysninger: Array<{
                          __typename: 'Refusjonsopplysning';
                          fom: string;
                          tom: string | null;
                          belop: number;
                      }> | null;
                  };
                  saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
              }
            | {
                  __typename: 'MinimumSykdomsgradOverstyring';
                  hendelseId: string;
                  timestamp: string;
                  ferdigstilt: boolean;
                  vedtaksperiodeId: string;
                  minimumSykdomsgrad: {
                      __typename: 'OverstyrtMinimumSykdomsgrad';
                      begrunnelse: string;
                      initierendeVedtaksperiodeId: string;
                      perioderVurdertOk: Array<{
                          __typename: 'OverstyrtMinimumSykdomsgradPeriode';
                          fom: string;
                          tom: string;
                      }>;
                      perioderVurdertIkkeOk: Array<{
                          __typename: 'OverstyrtMinimumSykdomsgradPeriode';
                          fom: string;
                          tom: string;
                      }>;
                  };
                  saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
              }
            | {
                  __typename: 'Sykepengegrunnlagskjonnsfastsetting';
                  hendelseId: string;
                  timestamp: string;
                  ferdigstilt: boolean;
                  vedtaksperiodeId: string;
                  skjonnsfastsatt: {
                      __typename: 'SkjonnsfastsattSykepengegrunnlag';
                      arsak: string;
                      type: Types.Skjonnsfastsettingstype | null;
                      begrunnelse: string | null;
                      begrunnelseMal: string | null;
                      begrunnelseFritekst: string | null;
                      begrunnelseKonklusjon: string | null;
                      arlig: number;
                      fraArlig: number | null;
                      skjaeringstidspunkt: string;
                  };
                  saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
              }
        >;
        inntekterFraAordningen: Array<{
            __typename: 'ArbeidsgiverInntekterFraAOrdningen';
            skjaeringstidspunkt: string;
            inntekter: Array<{ __typename: 'InntektFraAOrdningen'; maned: string; sum: number }>;
        }>;
    }>;
    tilleggsinfoForInntektskilder: Array<{
        __typename: 'TilleggsinfoForInntektskilde';
        orgnummer: string;
        navn: string;
    }>;
};

export type FetchPersonQueryVariables = Exact<{
    personPseudoId: string;
}>;

export type FetchPersonQuery = {
    __typename: 'Query';
    person: {
        __typename: 'Person';
        fodselsnummer: string;
        dodsdato: string | null;
        aktorId: string;
        andreFodselsnummer: Array<{ __typename: 'AnnetFodselsnummer'; fodselsnummer: string; personPseudoId: string }>;
        selvstendigNaering: {
            __typename: 'SelvstendigNaering';
            behandlinger: Array<{
                __typename: 'Behandling';
                id: string;
                perioder: Array<
                    | {
                          __typename: 'BeregnetPeriode';
                          id: string;
                          forbrukteSykedager: number | null;
                          gjenstaendeSykedager: number | null;
                          vedtaksperiodeId: string;
                          maksdato: string;
                          vilkarsgrunnlagId: string | null;
                          grunnbelopsjustertGjennomsnitt: string | null;
                          behandlingId: string;
                          fom: string;
                          tom: string;
                          erForkastet: boolean;
                          inntektstype: Types.Inntektstype;
                          opprettet: string;
                          periodetype: Types.Periodetype;
                          periodetilstand: Types.Periodetilstand;
                          skjaeringstidspunkt: string;
                          handlinger: Array<{
                              __typename: 'Handling';
                              type: Types.Periodehandling;
                              tillatt: boolean;
                              begrunnelse: string | null;
                          }>;
                          historikkinnslag: Array<
                              | {
                                    __typename: 'EndrePaVent';
                                    frist: string | null;
                                    arsaker: Array<string>;
                                    notattekst: string | null;
                                    id: number;
                                    type: Types.PeriodehistorikkType;
                                    timestamp: string;
                                    saksbehandlerIdent: string | null;
                                    dialogRef: number | null;
                                    kommentarer: Array<{
                                        __typename: 'Kommentar';
                                        id: number;
                                        tekst: string;
                                        opprettet: string;
                                        saksbehandlerident: string;
                                        feilregistrert_tidspunkt: string | null;
                                    }>;
                                }
                              | {
                                    __typename: 'FjernetFraPaVent';
                                    id: number;
                                    type: Types.PeriodehistorikkType;
                                    timestamp: string;
                                    saksbehandlerIdent: string | null;
                                    dialogRef: number | null;
                                }
                              | {
                                    __typename: 'LagtPaVent';
                                    frist: string | null;
                                    arsaker: Array<string>;
                                    notattekst: string | null;
                                    id: number;
                                    type: Types.PeriodehistorikkType;
                                    timestamp: string;
                                    saksbehandlerIdent: string | null;
                                    dialogRef: number | null;
                                    kommentarer: Array<{
                                        __typename: 'Kommentar';
                                        id: number;
                                        tekst: string;
                                        opprettet: string;
                                        saksbehandlerident: string;
                                        feilregistrert_tidspunkt: string | null;
                                    }>;
                                }
                              | {
                                    __typename: 'OpphevStansAutomatiskBehandlingSaksbehandler';
                                    notattekst: string | null;
                                    id: number;
                                    type: Types.PeriodehistorikkType;
                                    timestamp: string;
                                    saksbehandlerIdent: string | null;
                                    dialogRef: number | null;
                                    kommentarer: Array<{
                                        __typename: 'Kommentar';
                                        id: number;
                                        tekst: string;
                                        opprettet: string;
                                        saksbehandlerident: string;
                                        feilregistrert_tidspunkt: string | null;
                                    }>;
                                }
                              | {
                                    __typename: 'PeriodeHistorikkElementNy';
                                    id: number;
                                    type: Types.PeriodehistorikkType;
                                    timestamp: string;
                                    saksbehandlerIdent: string | null;
                                    dialogRef: number | null;
                                }
                              | {
                                    __typename: 'StansAutomatiskBehandlingSaksbehandler';
                                    notattekst: string | null;
                                    id: number;
                                    type: Types.PeriodehistorikkType;
                                    timestamp: string;
                                    saksbehandlerIdent: string | null;
                                    dialogRef: number | null;
                                    kommentarer: Array<{
                                        __typename: 'Kommentar';
                                        id: number;
                                        tekst: string;
                                        opprettet: string;
                                        saksbehandlerident: string;
                                        feilregistrert_tidspunkt: string | null;
                                    }>;
                                }
                              | {
                                    __typename: 'TotrinnsvurderingRetur';
                                    notattekst: string | null;
                                    id: number;
                                    type: Types.PeriodehistorikkType;
                                    timestamp: string;
                                    saksbehandlerIdent: string | null;
                                    dialogRef: number | null;
                                    kommentarer: Array<{
                                        __typename: 'Kommentar';
                                        id: number;
                                        tekst: string;
                                        opprettet: string;
                                        saksbehandlerident: string;
                                        feilregistrert_tidspunkt: string | null;
                                    }>;
                                }
                          >;
                          periodevilkar: {
                              __typename: 'Periodevilkar';
                              alder: { __typename: 'Alder'; alderSisteSykedag: number; oppfylt: boolean };
                              sykepengedager: {
                                  __typename: 'Sykepengedager';
                                  forbrukteSykedager: number | null;
                                  gjenstaendeSykedager: number | null;
                                  maksdato: string;
                                  oppfylt: boolean;
                                  skjaeringstidspunkt: string;
                              };
                          };
                          risikovurdering: {
                              __typename: 'Risikovurdering';
                              funn: Array<{
                                  __typename: 'Faresignal';
                                  beskrivelse: string;
                                  kategori: Array<string>;
                              }> | null;
                              kontrollertOk: Array<{
                                  __typename: 'Faresignal';
                                  beskrivelse: string;
                                  kategori: Array<string>;
                              }>;
                          } | null;
                          utbetaling: {
                              __typename: 'Utbetaling';
                              id: string;
                              arbeidsgiverFagsystemId: string;
                              arbeidsgiverNettoBelop: number;
                              personFagsystemId: string;
                              personNettoBelop: number;
                              status: Types.Utbetalingstatus;
                              type: Types.Utbetalingtype;
                              vurdering: {
                                  __typename: 'Vurdering';
                                  automatisk: boolean;
                                  godkjent: boolean;
                                  ident: string;
                                  tidsstempel: string;
                              } | null;
                              arbeidsgiversimulering: {
                                  __typename: 'Simulering';
                                  fagsystemId: string;
                                  totalbelop: number | null;
                                  tidsstempel: string;
                                  utbetalingslinjer: Array<{
                                      __typename: 'Simuleringslinje';
                                      fom: string;
                                      tom: string;
                                      dagsats: number;
                                      grad: number;
                                  }>;
                                  perioder: Array<{
                                      __typename: 'Simuleringsperiode';
                                      fom: string;
                                      tom: string;
                                      utbetalinger: Array<{
                                          __typename: 'Simuleringsutbetaling';
                                          mottakerId: string;
                                          mottakerNavn: string;
                                          forfall: string;
                                          feilkonto: boolean;
                                          detaljer: Array<{
                                              __typename: 'Simuleringsdetaljer';
                                              fom: string;
                                              tom: string;
                                              utbetalingstype: string;
                                              uforegrad: number;
                                              typeSats: string;
                                              tilbakeforing: boolean;
                                              sats: number;
                                              refunderesOrgNr: string;
                                              konto: string;
                                              klassekode: string;
                                              antallSats: number;
                                              belop: number;
                                              klassekodebeskrivelse: string;
                                          }>;
                                      }>;
                                  }> | null;
                              } | null;
                              personsimulering: {
                                  __typename: 'Simulering';
                                  fagsystemId: string;
                                  totalbelop: number | null;
                                  tidsstempel: string;
                                  utbetalingslinjer: Array<{
                                      __typename: 'Simuleringslinje';
                                      fom: string;
                                      tom: string;
                                      dagsats: number;
                                      grad: number;
                                  }>;
                                  perioder: Array<{
                                      __typename: 'Simuleringsperiode';
                                      fom: string;
                                      tom: string;
                                      utbetalinger: Array<{
                                          __typename: 'Simuleringsutbetaling';
                                          mottakerId: string;
                                          mottakerNavn: string;
                                          forfall: string;
                                          feilkonto: boolean;
                                          detaljer: Array<{
                                              __typename: 'Simuleringsdetaljer';
                                              fom: string;
                                              tom: string;
                                              utbetalingstype: string;
                                              uforegrad: number;
                                              typeSats: string;
                                              tilbakeforing: boolean;
                                              sats: number;
                                              refunderesOrgNr: string;
                                              konto: string;
                                              klassekode: string;
                                              antallSats: number;
                                              belop: number;
                                              klassekodebeskrivelse: string;
                                          }>;
                                      }>;
                                  }> | null;
                              } | null;
                          };
                          oppgave: { __typename: 'OppgaveForPeriodevisning'; id: string } | null;
                          paVent: { __typename: 'PaVent'; frist: string | null; oid: string } | null;
                          totrinnsvurdering: {
                              __typename: 'Totrinnsvurdering';
                              erBeslutteroppgave: boolean;
                              erRetur: boolean;
                              saksbehandler: string | null;
                              beslutter: string | null;
                          } | null;
                          egenskaper: Array<{
                              __typename: 'Oppgaveegenskap';
                              egenskap: Types.Egenskap;
                              kategori: Types.Kategori;
                          }>;
                          avslag: Array<{
                              __typename: 'Avslag';
                              type: Types.Avslagstype;
                              begrunnelse: string;
                              opprettet: string;
                              saksbehandlerIdent: string;
                              invalidert: boolean;
                          }>;
                          vedtakBegrunnelser: Array<{
                              __typename: 'VedtakBegrunnelse';
                              utfall: Types.VedtakUtfall;
                              begrunnelse: string | null;
                              opprettet: string;
                              saksbehandlerIdent: string;
                          }>;
                          annullering: {
                              __typename: 'Annullering';
                              saksbehandlerIdent: string;
                              arbeidsgiverFagsystemId: string | null;
                              personFagsystemId: string | null;
                              tidspunkt: string;
                              arsaker: Array<string>;
                              begrunnelse: string | null;
                              vedtaksperiodeId: string;
                          } | null;
                          pensjonsgivendeInntekter: Array<{
                              __typename: 'PensjonsgivendeInntekt';
                              arligBelop: string;
                              inntektsar: number;
                          }>;
                          annulleringskandidater: Array<{
                              __typename: 'Annulleringskandidat';
                              fom: string;
                              organisasjonsnummer: string;
                              tom: string;
                              vedtaksperiodeId: string;
                          }>;
                          tidslinje: Array<{
                              __typename: 'Dag';
                              dato: string;
                              grad: number | null;
                              sykdomsdagtype: Types.Sykdomsdagtype;
                              utbetalingsdagtype: Types.Utbetalingsdagtype;
                              begrunnelser: Array<Types.Begrunnelse> | null;
                              kilde: { __typename: 'Kilde'; id: string; type: Types.Kildetype };
                              utbetalingsinfo: {
                                  __typename: 'Utbetalingsinfo';
                                  arbeidsgiverbelop: number | null;
                                  inntekt: number | null;
                                  personbelop: number | null;
                                  refusjonsbelop: number | null;
                                  totalGrad: number | null;
                                  utbetaling: number | null;
                              } | null;
                          }>;
                          varsler: Array<{
                              __typename: 'VarselDTO';
                              id: string;
                              behandlingId: string;
                              definisjonId: string;
                              opprettet: string;
                              kode: string;
                              tittel: string;
                              forklaring: string | null;
                              handling: string | null;
                              vurdering: {
                                  __typename: 'VarselvurderingDTO';
                                  ident: string;
                                  status: Types.Varselstatus;
                                  tidsstempel: string;
                              } | null;
                          }>;
                          hendelser: Array<
                              | {
                                    __typename: 'InntektHentetFraAOrdningen';
                                    mottattDato: string;
                                    id: string;
                                    type: Types.Hendelsetype;
                                }
                              | {
                                    __typename: 'Inntektsmelding';
                                    beregnetInntekt: number;
                                    mottattDato: string;
                                    eksternDokumentId: string | null;
                                    id: string;
                                    type: Types.Hendelsetype;
                                }
                              | {
                                    __typename: 'SoknadArbeidsgiver';
                                    fom: string;
                                    tom: string;
                                    rapportertDato: string;
                                    sendtArbeidsgiver: string;
                                    eksternDokumentId: string | null;
                                    id: string;
                                    type: Types.Hendelsetype;
                                }
                              | {
                                    __typename: 'SoknadArbeidsledig';
                                    fom: string;
                                    tom: string;
                                    rapportertDato: string;
                                    sendtNav: string;
                                    eksternDokumentId: string | null;
                                    id: string;
                                    type: Types.Hendelsetype;
                                }
                              | {
                                    __typename: 'SoknadFrilans';
                                    fom: string;
                                    tom: string;
                                    rapportertDato: string;
                                    sendtNav: string;
                                    eksternDokumentId: string | null;
                                    id: string;
                                    type: Types.Hendelsetype;
                                }
                              | {
                                    __typename: 'SoknadNav';
                                    fom: string;
                                    tom: string;
                                    rapportertDato: string;
                                    sendtNav: string;
                                    eksternDokumentId: string | null;
                                    id: string;
                                    type: Types.Hendelsetype;
                                }
                              | {
                                    __typename: 'SoknadSelvstendig';
                                    fom: string;
                                    tom: string;
                                    rapportertDato: string;
                                    sendtNav: string;
                                    eksternDokumentId: string | null;
                                    id: string;
                                    type: Types.Hendelsetype;
                                }
                              | {
                                    __typename: 'Sykmelding';
                                    fom: string;
                                    tom: string;
                                    rapportertDato: string;
                                    id: string;
                                    type: Types.Hendelsetype;
                                }
                          >;
                      }
                    | {
                          __typename: 'UberegnetPeriode';
                          id: string;
                          behandlingId: string;
                          fom: string;
                          tom: string;
                          erForkastet: boolean;
                          inntektstype: Types.Inntektstype;
                          opprettet: string;
                          periodetype: Types.Periodetype;
                          vedtaksperiodeId: string;
                          periodetilstand: Types.Periodetilstand;
                          skjaeringstidspunkt: string;
                          historikkinnslag: Array<
                              | {
                                    __typename: 'EndrePaVent';
                                    frist: string | null;
                                    arsaker: Array<string>;
                                    notattekst: string | null;
                                    id: number;
                                    type: Types.PeriodehistorikkType;
                                    timestamp: string;
                                    saksbehandlerIdent: string | null;
                                    dialogRef: number | null;
                                    kommentarer: Array<{
                                        __typename: 'Kommentar';
                                        id: number;
                                        tekst: string;
                                        opprettet: string;
                                        saksbehandlerident: string;
                                        feilregistrert_tidspunkt: string | null;
                                    }>;
                                }
                              | {
                                    __typename: 'FjernetFraPaVent';
                                    id: number;
                                    type: Types.PeriodehistorikkType;
                                    timestamp: string;
                                    saksbehandlerIdent: string | null;
                                    dialogRef: number | null;
                                }
                              | {
                                    __typename: 'LagtPaVent';
                                    frist: string | null;
                                    arsaker: Array<string>;
                                    notattekst: string | null;
                                    id: number;
                                    type: Types.PeriodehistorikkType;
                                    timestamp: string;
                                    saksbehandlerIdent: string | null;
                                    dialogRef: number | null;
                                    kommentarer: Array<{
                                        __typename: 'Kommentar';
                                        id: number;
                                        tekst: string;
                                        opprettet: string;
                                        saksbehandlerident: string;
                                        feilregistrert_tidspunkt: string | null;
                                    }>;
                                }
                              | {
                                    __typename: 'OpphevStansAutomatiskBehandlingSaksbehandler';
                                    notattekst: string | null;
                                    id: number;
                                    type: Types.PeriodehistorikkType;
                                    timestamp: string;
                                    saksbehandlerIdent: string | null;
                                    dialogRef: number | null;
                                    kommentarer: Array<{
                                        __typename: 'Kommentar';
                                        id: number;
                                        tekst: string;
                                        opprettet: string;
                                        saksbehandlerident: string;
                                        feilregistrert_tidspunkt: string | null;
                                    }>;
                                }
                              | {
                                    __typename: 'PeriodeHistorikkElementNy';
                                    id: number;
                                    type: Types.PeriodehistorikkType;
                                    timestamp: string;
                                    saksbehandlerIdent: string | null;
                                    dialogRef: number | null;
                                }
                              | {
                                    __typename: 'StansAutomatiskBehandlingSaksbehandler';
                                    notattekst: string | null;
                                    id: number;
                                    type: Types.PeriodehistorikkType;
                                    timestamp: string;
                                    saksbehandlerIdent: string | null;
                                    dialogRef: number | null;
                                    kommentarer: Array<{
                                        __typename: 'Kommentar';
                                        id: number;
                                        tekst: string;
                                        opprettet: string;
                                        saksbehandlerident: string;
                                        feilregistrert_tidspunkt: string | null;
                                    }>;
                                }
                              | {
                                    __typename: 'TotrinnsvurderingRetur';
                                    notattekst: string | null;
                                    id: number;
                                    type: Types.PeriodehistorikkType;
                                    timestamp: string;
                                    saksbehandlerIdent: string | null;
                                    dialogRef: number | null;
                                    kommentarer: Array<{
                                        __typename: 'Kommentar';
                                        id: number;
                                        tekst: string;
                                        opprettet: string;
                                        saksbehandlerident: string;
                                        feilregistrert_tidspunkt: string | null;
                                    }>;
                                }
                          >;
                          tidslinje: Array<{
                              __typename: 'Dag';
                              dato: string;
                              grad: number | null;
                              sykdomsdagtype: Types.Sykdomsdagtype;
                              utbetalingsdagtype: Types.Utbetalingsdagtype;
                              begrunnelser: Array<Types.Begrunnelse> | null;
                              kilde: { __typename: 'Kilde'; id: string; type: Types.Kildetype };
                              utbetalingsinfo: {
                                  __typename: 'Utbetalingsinfo';
                                  arbeidsgiverbelop: number | null;
                                  inntekt: number | null;
                                  personbelop: number | null;
                                  refusjonsbelop: number | null;
                                  totalGrad: number | null;
                                  utbetaling: number | null;
                              } | null;
                          }>;
                          varsler: Array<{
                              __typename: 'VarselDTO';
                              id: string;
                              behandlingId: string;
                              definisjonId: string;
                              opprettet: string;
                              kode: string;
                              tittel: string;
                              forklaring: string | null;
                              handling: string | null;
                              vurdering: {
                                  __typename: 'VarselvurderingDTO';
                                  ident: string;
                                  status: Types.Varselstatus;
                                  tidsstempel: string;
                              } | null;
                          }>;
                          hendelser: Array<
                              | {
                                    __typename: 'InntektHentetFraAOrdningen';
                                    mottattDato: string;
                                    id: string;
                                    type: Types.Hendelsetype;
                                }
                              | {
                                    __typename: 'Inntektsmelding';
                                    beregnetInntekt: number;
                                    mottattDato: string;
                                    eksternDokumentId: string | null;
                                    id: string;
                                    type: Types.Hendelsetype;
                                }
                              | {
                                    __typename: 'SoknadArbeidsgiver';
                                    fom: string;
                                    tom: string;
                                    rapportertDato: string;
                                    sendtArbeidsgiver: string;
                                    eksternDokumentId: string | null;
                                    id: string;
                                    type: Types.Hendelsetype;
                                }
                              | {
                                    __typename: 'SoknadArbeidsledig';
                                    fom: string;
                                    tom: string;
                                    rapportertDato: string;
                                    sendtNav: string;
                                    eksternDokumentId: string | null;
                                    id: string;
                                    type: Types.Hendelsetype;
                                }
                              | {
                                    __typename: 'SoknadFrilans';
                                    fom: string;
                                    tom: string;
                                    rapportertDato: string;
                                    sendtNav: string;
                                    eksternDokumentId: string | null;
                                    id: string;
                                    type: Types.Hendelsetype;
                                }
                              | {
                                    __typename: 'SoknadNav';
                                    fom: string;
                                    tom: string;
                                    rapportertDato: string;
                                    sendtNav: string;
                                    eksternDokumentId: string | null;
                                    id: string;
                                    type: Types.Hendelsetype;
                                }
                              | {
                                    __typename: 'SoknadSelvstendig';
                                    fom: string;
                                    tom: string;
                                    rapportertDato: string;
                                    sendtNav: string;
                                    eksternDokumentId: string | null;
                                    id: string;
                                    type: Types.Hendelsetype;
                                }
                              | {
                                    __typename: 'Sykmelding';
                                    fom: string;
                                    tom: string;
                                    rapportertDato: string;
                                    id: string;
                                    type: Types.Hendelsetype;
                                }
                          >;
                      }
                >;
            }>;
            overstyringer: Array<
                | {
                      __typename: 'Arbeidsforholdoverstyring';
                      begrunnelse: string;
                      deaktivert: boolean;
                      skjaeringstidspunkt: string;
                      forklaring: string;
                      hendelseId: string;
                      timestamp: string;
                      ferdigstilt: boolean;
                      vedtaksperiodeId: string;
                      saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
                  }
                | {
                      __typename: 'Dagoverstyring';
                      begrunnelse: string;
                      hendelseId: string;
                      timestamp: string;
                      ferdigstilt: boolean;
                      vedtaksperiodeId: string;
                      dager: Array<{
                          __typename: 'OverstyrtDag';
                          grad: number | null;
                          fraGrad: number | null;
                          dato: string;
                          type: Types.Dagtype;
                          fraType: Types.Dagtype | null;
                      }>;
                      saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
                  }
                | {
                      __typename: 'Inntektoverstyring';
                      hendelseId: string;
                      timestamp: string;
                      ferdigstilt: boolean;
                      vedtaksperiodeId: string;
                      inntekt: {
                          __typename: 'OverstyrtInntekt';
                          skjaeringstidspunkt: string;
                          forklaring: string;
                          begrunnelse: string;
                          manedligInntekt: number;
                          fraManedligInntekt: number | null;
                          refusjonsopplysninger: Array<{
                              __typename: 'Refusjonsopplysning';
                              fom: string;
                              tom: string | null;
                              belop: number;
                          }> | null;
                          fraRefusjonsopplysninger: Array<{
                              __typename: 'Refusjonsopplysning';
                              fom: string;
                              tom: string | null;
                              belop: number;
                          }> | null;
                      };
                      saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
                  }
                | {
                      __typename: 'MinimumSykdomsgradOverstyring';
                      hendelseId: string;
                      timestamp: string;
                      ferdigstilt: boolean;
                      vedtaksperiodeId: string;
                      minimumSykdomsgrad: {
                          __typename: 'OverstyrtMinimumSykdomsgrad';
                          begrunnelse: string;
                          initierendeVedtaksperiodeId: string;
                          perioderVurdertOk: Array<{
                              __typename: 'OverstyrtMinimumSykdomsgradPeriode';
                              fom: string;
                              tom: string;
                          }>;
                          perioderVurdertIkkeOk: Array<{
                              __typename: 'OverstyrtMinimumSykdomsgradPeriode';
                              fom: string;
                              tom: string;
                          }>;
                      };
                      saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
                  }
                | {
                      __typename: 'Sykepengegrunnlagskjonnsfastsetting';
                      hendelseId: string;
                      timestamp: string;
                      ferdigstilt: boolean;
                      vedtaksperiodeId: string;
                      skjonnsfastsatt: {
                          __typename: 'SkjonnsfastsattSykepengegrunnlag';
                          arsak: string;
                          type: Types.Skjonnsfastsettingstype | null;
                          begrunnelse: string | null;
                          begrunnelseMal: string | null;
                          begrunnelseFritekst: string | null;
                          begrunnelseKonklusjon: string | null;
                          arlig: number;
                          fraArlig: number | null;
                          skjaeringstidspunkt: string;
                      };
                      saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
                  }
            >;
        } | null;
        tildeling: { __typename: 'Tildeling'; navn: string; epost: string; oid: string } | null;
        vilkarsgrunnlagV2: Array<
            | {
                  __typename: 'VilkarsgrunnlagInfotrygdV2';
                  omregnetArsinntekt: number;
                  opptjeningsvurderingId: string;
                  id: string;
                  sykepengegrunnlag: number;
                  skjaeringstidspunkt: string;
                  inntekter: Array<{
                      __typename: 'Arbeidsgiverinntekt';
                      arbeidsgiver: string;
                      deaktivert: boolean | null;
                      fom: string | null;
                      tom: string | null;
                      sammenligningsgrunnlag: {
                          __typename: 'Sammenligningsgrunnlag';
                          belop: number;
                          inntektFraAOrdningen: Array<{
                              __typename: 'InntektFraAOrdningen';
                              maned: string;
                              sum: number;
                          }>;
                      } | null;
                      omregnetArsinntekt: {
                          __typename: 'OmregnetArsinntekt';
                          belop: number;
                          manedsbelop: number;
                          kilde: Types.Inntektskilde;
                          inntektFraAOrdningen: Array<{
                              __typename: 'InntektFraAOrdningen';
                              maned: string;
                              sum: number;
                          }> | null;
                      } | null;
                      skjonnsmessigFastsatt: {
                          __typename: 'OmregnetArsinntekt';
                          belop: number;
                          manedsbelop: number;
                          kilde: Types.Inntektskilde;
                          inntektFraAOrdningen: Array<{
                              __typename: 'InntektFraAOrdningen';
                              maned: string;
                              sum: number;
                          }> | null;
                      } | null;
                  }>;
                  arbeidsgiverrefusjoner: Array<{
                      __typename: 'Arbeidsgiverrefusjon';
                      arbeidsgiver: string;
                      refusjonsopplysninger: Array<{
                          __typename: 'Refusjonselement';
                          fom: string;
                          tom: string | null;
                          belop: number;
                          meldingsreferanseId: string;
                      }>;
                  }>;
              }
            | {
                  __typename: 'VilkarsgrunnlagSpleisV2';
                  skjonnsmessigFastsattAarlig: number | null;
                  vurderingAvKravOmMedlemskap: Types.VilkarsgrunnlagVurdering;
                  oppfyllerKravOmMinstelonn: boolean;
                  oppfyllerKravOmOpptjening: boolean;
                  antallOpptjeningsdagerErMinst: number;
                  grunnbelop: number;
                  opptjeningFra: string;
                  opptjeningsvurderingId: string;
                  beregningsgrunnlag: string;
                  forsikringsvurderingId: string | null;
                  id: string;
                  sykepengegrunnlag: number;
                  skjaeringstidspunkt: string;
                  sykepengegrunnlagsgrense: {
                      __typename: 'Sykepengegrunnlagsgrense';
                      grunnbelop: number;
                      grense: number;
                      virkningstidspunkt: string;
                  };
                  avviksvurdering: {
                      __typename: 'VilkarsgrunnlagAvviksvurdering';
                      avviksprosent: string;
                      beregningsgrunnlag: string;
                      sammenligningsgrunnlag: string;
                  } | null;
                  inntekter: Array<{
                      __typename: 'Arbeidsgiverinntekt';
                      arbeidsgiver: string;
                      deaktivert: boolean | null;
                      fom: string | null;
                      tom: string | null;
                      sammenligningsgrunnlag: {
                          __typename: 'Sammenligningsgrunnlag';
                          belop: number;
                          inntektFraAOrdningen: Array<{
                              __typename: 'InntektFraAOrdningen';
                              maned: string;
                              sum: number;
                          }>;
                      } | null;
                      omregnetArsinntekt: {
                          __typename: 'OmregnetArsinntekt';
                          belop: number;
                          manedsbelop: number;
                          kilde: Types.Inntektskilde;
                          inntektFraAOrdningen: Array<{
                              __typename: 'InntektFraAOrdningen';
                              maned: string;
                              sum: number;
                          }> | null;
                      } | null;
                      skjonnsmessigFastsatt: {
                          __typename: 'OmregnetArsinntekt';
                          belop: number;
                          manedsbelop: number;
                          kilde: Types.Inntektskilde;
                          inntektFraAOrdningen: Array<{
                              __typename: 'InntektFraAOrdningen';
                              maned: string;
                              sum: number;
                          }> | null;
                      } | null;
                  }>;
                  arbeidsgiverrefusjoner: Array<{
                      __typename: 'Arbeidsgiverrefusjon';
                      arbeidsgiver: string;
                      refusjonsopplysninger: Array<{
                          __typename: 'Refusjonselement';
                          fom: string;
                          tom: string | null;
                          belop: number;
                          meldingsreferanseId: string;
                      }>;
                  }>;
              }
        >;
        arbeidsgivere: Array<{
            __typename: 'Arbeidsgiver';
            navn: string;
            organisasjonsnummer: string;
            arbeidsforhold: Array<{
                __typename: 'Arbeidsforhold';
                sluttdato: string | null;
                startdato: string;
                stillingsprosent: number;
                stillingstittel: string;
            }>;
            ghostPerioder: Array<{
                __typename: 'GhostPeriode';
                id: string;
                deaktivert: boolean;
                vilkarsgrunnlagId: string | null;
                skjaeringstidspunkt: string;
                fom: string;
                tom: string;
                organisasjonsnummer: string;
            }>;
            behandlinger: Array<{
                __typename: 'Behandling';
                id: string;
                perioder: Array<
                    | {
                          __typename: 'BeregnetPeriode';
                          id: string;
                          forbrukteSykedager: number | null;
                          gjenstaendeSykedager: number | null;
                          vedtaksperiodeId: string;
                          maksdato: string;
                          vilkarsgrunnlagId: string | null;
                          grunnbelopsjustertGjennomsnitt: string | null;
                          behandlingId: string;
                          fom: string;
                          tom: string;
                          erForkastet: boolean;
                          inntektstype: Types.Inntektstype;
                          opprettet: string;
                          periodetype: Types.Periodetype;
                          periodetilstand: Types.Periodetilstand;
                          skjaeringstidspunkt: string;
                          handlinger: Array<{
                              __typename: 'Handling';
                              type: Types.Periodehandling;
                              tillatt: boolean;
                              begrunnelse: string | null;
                          }>;
                          historikkinnslag: Array<
                              | {
                                    __typename: 'EndrePaVent';
                                    frist: string | null;
                                    arsaker: Array<string>;
                                    notattekst: string | null;
                                    id: number;
                                    type: Types.PeriodehistorikkType;
                                    timestamp: string;
                                    saksbehandlerIdent: string | null;
                                    dialogRef: number | null;
                                    kommentarer: Array<{
                                        __typename: 'Kommentar';
                                        id: number;
                                        tekst: string;
                                        opprettet: string;
                                        saksbehandlerident: string;
                                        feilregistrert_tidspunkt: string | null;
                                    }>;
                                }
                              | {
                                    __typename: 'FjernetFraPaVent';
                                    id: number;
                                    type: Types.PeriodehistorikkType;
                                    timestamp: string;
                                    saksbehandlerIdent: string | null;
                                    dialogRef: number | null;
                                }
                              | {
                                    __typename: 'LagtPaVent';
                                    frist: string | null;
                                    arsaker: Array<string>;
                                    notattekst: string | null;
                                    id: number;
                                    type: Types.PeriodehistorikkType;
                                    timestamp: string;
                                    saksbehandlerIdent: string | null;
                                    dialogRef: number | null;
                                    kommentarer: Array<{
                                        __typename: 'Kommentar';
                                        id: number;
                                        tekst: string;
                                        opprettet: string;
                                        saksbehandlerident: string;
                                        feilregistrert_tidspunkt: string | null;
                                    }>;
                                }
                              | {
                                    __typename: 'OpphevStansAutomatiskBehandlingSaksbehandler';
                                    notattekst: string | null;
                                    id: number;
                                    type: Types.PeriodehistorikkType;
                                    timestamp: string;
                                    saksbehandlerIdent: string | null;
                                    dialogRef: number | null;
                                    kommentarer: Array<{
                                        __typename: 'Kommentar';
                                        id: number;
                                        tekst: string;
                                        opprettet: string;
                                        saksbehandlerident: string;
                                        feilregistrert_tidspunkt: string | null;
                                    }>;
                                }
                              | {
                                    __typename: 'PeriodeHistorikkElementNy';
                                    id: number;
                                    type: Types.PeriodehistorikkType;
                                    timestamp: string;
                                    saksbehandlerIdent: string | null;
                                    dialogRef: number | null;
                                }
                              | {
                                    __typename: 'StansAutomatiskBehandlingSaksbehandler';
                                    notattekst: string | null;
                                    id: number;
                                    type: Types.PeriodehistorikkType;
                                    timestamp: string;
                                    saksbehandlerIdent: string | null;
                                    dialogRef: number | null;
                                    kommentarer: Array<{
                                        __typename: 'Kommentar';
                                        id: number;
                                        tekst: string;
                                        opprettet: string;
                                        saksbehandlerident: string;
                                        feilregistrert_tidspunkt: string | null;
                                    }>;
                                }
                              | {
                                    __typename: 'TotrinnsvurderingRetur';
                                    notattekst: string | null;
                                    id: number;
                                    type: Types.PeriodehistorikkType;
                                    timestamp: string;
                                    saksbehandlerIdent: string | null;
                                    dialogRef: number | null;
                                    kommentarer: Array<{
                                        __typename: 'Kommentar';
                                        id: number;
                                        tekst: string;
                                        opprettet: string;
                                        saksbehandlerident: string;
                                        feilregistrert_tidspunkt: string | null;
                                    }>;
                                }
                          >;
                          periodevilkar: {
                              __typename: 'Periodevilkar';
                              alder: { __typename: 'Alder'; alderSisteSykedag: number; oppfylt: boolean };
                              sykepengedager: {
                                  __typename: 'Sykepengedager';
                                  forbrukteSykedager: number | null;
                                  gjenstaendeSykedager: number | null;
                                  maksdato: string;
                                  oppfylt: boolean;
                                  skjaeringstidspunkt: string;
                              };
                          };
                          risikovurdering: {
                              __typename: 'Risikovurdering';
                              funn: Array<{
                                  __typename: 'Faresignal';
                                  beskrivelse: string;
                                  kategori: Array<string>;
                              }> | null;
                              kontrollertOk: Array<{
                                  __typename: 'Faresignal';
                                  beskrivelse: string;
                                  kategori: Array<string>;
                              }>;
                          } | null;
                          utbetaling: {
                              __typename: 'Utbetaling';
                              id: string;
                              arbeidsgiverFagsystemId: string;
                              arbeidsgiverNettoBelop: number;
                              personFagsystemId: string;
                              personNettoBelop: number;
                              status: Types.Utbetalingstatus;
                              type: Types.Utbetalingtype;
                              vurdering: {
                                  __typename: 'Vurdering';
                                  automatisk: boolean;
                                  godkjent: boolean;
                                  ident: string;
                                  tidsstempel: string;
                              } | null;
                              arbeidsgiversimulering: {
                                  __typename: 'Simulering';
                                  fagsystemId: string;
                                  totalbelop: number | null;
                                  tidsstempel: string;
                                  utbetalingslinjer: Array<{
                                      __typename: 'Simuleringslinje';
                                      fom: string;
                                      tom: string;
                                      dagsats: number;
                                      grad: number;
                                  }>;
                                  perioder: Array<{
                                      __typename: 'Simuleringsperiode';
                                      fom: string;
                                      tom: string;
                                      utbetalinger: Array<{
                                          __typename: 'Simuleringsutbetaling';
                                          mottakerId: string;
                                          mottakerNavn: string;
                                          forfall: string;
                                          feilkonto: boolean;
                                          detaljer: Array<{
                                              __typename: 'Simuleringsdetaljer';
                                              fom: string;
                                              tom: string;
                                              utbetalingstype: string;
                                              uforegrad: number;
                                              typeSats: string;
                                              tilbakeforing: boolean;
                                              sats: number;
                                              refunderesOrgNr: string;
                                              konto: string;
                                              klassekode: string;
                                              antallSats: number;
                                              belop: number;
                                              klassekodebeskrivelse: string;
                                          }>;
                                      }>;
                                  }> | null;
                              } | null;
                              personsimulering: {
                                  __typename: 'Simulering';
                                  fagsystemId: string;
                                  totalbelop: number | null;
                                  tidsstempel: string;
                                  utbetalingslinjer: Array<{
                                      __typename: 'Simuleringslinje';
                                      fom: string;
                                      tom: string;
                                      dagsats: number;
                                      grad: number;
                                  }>;
                                  perioder: Array<{
                                      __typename: 'Simuleringsperiode';
                                      fom: string;
                                      tom: string;
                                      utbetalinger: Array<{
                                          __typename: 'Simuleringsutbetaling';
                                          mottakerId: string;
                                          mottakerNavn: string;
                                          forfall: string;
                                          feilkonto: boolean;
                                          detaljer: Array<{
                                              __typename: 'Simuleringsdetaljer';
                                              fom: string;
                                              tom: string;
                                              utbetalingstype: string;
                                              uforegrad: number;
                                              typeSats: string;
                                              tilbakeforing: boolean;
                                              sats: number;
                                              refunderesOrgNr: string;
                                              konto: string;
                                              klassekode: string;
                                              antallSats: number;
                                              belop: number;
                                              klassekodebeskrivelse: string;
                                          }>;
                                      }>;
                                  }> | null;
                              } | null;
                          };
                          oppgave: { __typename: 'OppgaveForPeriodevisning'; id: string } | null;
                          paVent: { __typename: 'PaVent'; frist: string | null; oid: string } | null;
                          totrinnsvurdering: {
                              __typename: 'Totrinnsvurdering';
                              erBeslutteroppgave: boolean;
                              erRetur: boolean;
                              saksbehandler: string | null;
                              beslutter: string | null;
                          } | null;
                          egenskaper: Array<{
                              __typename: 'Oppgaveegenskap';
                              egenskap: Types.Egenskap;
                              kategori: Types.Kategori;
                          }>;
                          avslag: Array<{
                              __typename: 'Avslag';
                              type: Types.Avslagstype;
                              begrunnelse: string;
                              opprettet: string;
                              saksbehandlerIdent: string;
                              invalidert: boolean;
                          }>;
                          vedtakBegrunnelser: Array<{
                              __typename: 'VedtakBegrunnelse';
                              utfall: Types.VedtakUtfall;
                              begrunnelse: string | null;
                              opprettet: string;
                              saksbehandlerIdent: string;
                          }>;
                          annullering: {
                              __typename: 'Annullering';
                              saksbehandlerIdent: string;
                              arbeidsgiverFagsystemId: string | null;
                              personFagsystemId: string | null;
                              tidspunkt: string;
                              arsaker: Array<string>;
                              begrunnelse: string | null;
                              vedtaksperiodeId: string;
                          } | null;
                          pensjonsgivendeInntekter: Array<{
                              __typename: 'PensjonsgivendeInntekt';
                              arligBelop: string;
                              inntektsar: number;
                          }>;
                          annulleringskandidater: Array<{
                              __typename: 'Annulleringskandidat';
                              fom: string;
                              organisasjonsnummer: string;
                              tom: string;
                              vedtaksperiodeId: string;
                          }>;
                          tidslinje: Array<{
                              __typename: 'Dag';
                              dato: string;
                              grad: number | null;
                              sykdomsdagtype: Types.Sykdomsdagtype;
                              utbetalingsdagtype: Types.Utbetalingsdagtype;
                              begrunnelser: Array<Types.Begrunnelse> | null;
                              kilde: { __typename: 'Kilde'; id: string; type: Types.Kildetype };
                              utbetalingsinfo: {
                                  __typename: 'Utbetalingsinfo';
                                  arbeidsgiverbelop: number | null;
                                  inntekt: number | null;
                                  personbelop: number | null;
                                  refusjonsbelop: number | null;
                                  totalGrad: number | null;
                                  utbetaling: number | null;
                              } | null;
                          }>;
                          varsler: Array<{
                              __typename: 'VarselDTO';
                              id: string;
                              behandlingId: string;
                              definisjonId: string;
                              opprettet: string;
                              kode: string;
                              tittel: string;
                              forklaring: string | null;
                              handling: string | null;
                              vurdering: {
                                  __typename: 'VarselvurderingDTO';
                                  ident: string;
                                  status: Types.Varselstatus;
                                  tidsstempel: string;
                              } | null;
                          }>;
                          hendelser: Array<
                              | {
                                    __typename: 'InntektHentetFraAOrdningen';
                                    mottattDato: string;
                                    id: string;
                                    type: Types.Hendelsetype;
                                }
                              | {
                                    __typename: 'Inntektsmelding';
                                    beregnetInntekt: number;
                                    mottattDato: string;
                                    eksternDokumentId: string | null;
                                    id: string;
                                    type: Types.Hendelsetype;
                                }
                              | {
                                    __typename: 'SoknadArbeidsgiver';
                                    fom: string;
                                    tom: string;
                                    rapportertDato: string;
                                    sendtArbeidsgiver: string;
                                    eksternDokumentId: string | null;
                                    id: string;
                                    type: Types.Hendelsetype;
                                }
                              | {
                                    __typename: 'SoknadArbeidsledig';
                                    fom: string;
                                    tom: string;
                                    rapportertDato: string;
                                    sendtNav: string;
                                    eksternDokumentId: string | null;
                                    id: string;
                                    type: Types.Hendelsetype;
                                }
                              | {
                                    __typename: 'SoknadFrilans';
                                    fom: string;
                                    tom: string;
                                    rapportertDato: string;
                                    sendtNav: string;
                                    eksternDokumentId: string | null;
                                    id: string;
                                    type: Types.Hendelsetype;
                                }
                              | {
                                    __typename: 'SoknadNav';
                                    fom: string;
                                    tom: string;
                                    rapportertDato: string;
                                    sendtNav: string;
                                    eksternDokumentId: string | null;
                                    id: string;
                                    type: Types.Hendelsetype;
                                }
                              | {
                                    __typename: 'SoknadSelvstendig';
                                    fom: string;
                                    tom: string;
                                    rapportertDato: string;
                                    sendtNav: string;
                                    eksternDokumentId: string | null;
                                    id: string;
                                    type: Types.Hendelsetype;
                                }
                              | {
                                    __typename: 'Sykmelding';
                                    fom: string;
                                    tom: string;
                                    rapportertDato: string;
                                    id: string;
                                    type: Types.Hendelsetype;
                                }
                          >;
                      }
                    | {
                          __typename: 'UberegnetPeriode';
                          id: string;
                          behandlingId: string;
                          fom: string;
                          tom: string;
                          erForkastet: boolean;
                          inntektstype: Types.Inntektstype;
                          opprettet: string;
                          periodetype: Types.Periodetype;
                          vedtaksperiodeId: string;
                          periodetilstand: Types.Periodetilstand;
                          skjaeringstidspunkt: string;
                          historikkinnslag: Array<
                              | {
                                    __typename: 'EndrePaVent';
                                    frist: string | null;
                                    arsaker: Array<string>;
                                    notattekst: string | null;
                                    id: number;
                                    type: Types.PeriodehistorikkType;
                                    timestamp: string;
                                    saksbehandlerIdent: string | null;
                                    dialogRef: number | null;
                                    kommentarer: Array<{
                                        __typename: 'Kommentar';
                                        id: number;
                                        tekst: string;
                                        opprettet: string;
                                        saksbehandlerident: string;
                                        feilregistrert_tidspunkt: string | null;
                                    }>;
                                }
                              | {
                                    __typename: 'FjernetFraPaVent';
                                    id: number;
                                    type: Types.PeriodehistorikkType;
                                    timestamp: string;
                                    saksbehandlerIdent: string | null;
                                    dialogRef: number | null;
                                }
                              | {
                                    __typename: 'LagtPaVent';
                                    frist: string | null;
                                    arsaker: Array<string>;
                                    notattekst: string | null;
                                    id: number;
                                    type: Types.PeriodehistorikkType;
                                    timestamp: string;
                                    saksbehandlerIdent: string | null;
                                    dialogRef: number | null;
                                    kommentarer: Array<{
                                        __typename: 'Kommentar';
                                        id: number;
                                        tekst: string;
                                        opprettet: string;
                                        saksbehandlerident: string;
                                        feilregistrert_tidspunkt: string | null;
                                    }>;
                                }
                              | {
                                    __typename: 'OpphevStansAutomatiskBehandlingSaksbehandler';
                                    notattekst: string | null;
                                    id: number;
                                    type: Types.PeriodehistorikkType;
                                    timestamp: string;
                                    saksbehandlerIdent: string | null;
                                    dialogRef: number | null;
                                    kommentarer: Array<{
                                        __typename: 'Kommentar';
                                        id: number;
                                        tekst: string;
                                        opprettet: string;
                                        saksbehandlerident: string;
                                        feilregistrert_tidspunkt: string | null;
                                    }>;
                                }
                              | {
                                    __typename: 'PeriodeHistorikkElementNy';
                                    id: number;
                                    type: Types.PeriodehistorikkType;
                                    timestamp: string;
                                    saksbehandlerIdent: string | null;
                                    dialogRef: number | null;
                                }
                              | {
                                    __typename: 'StansAutomatiskBehandlingSaksbehandler';
                                    notattekst: string | null;
                                    id: number;
                                    type: Types.PeriodehistorikkType;
                                    timestamp: string;
                                    saksbehandlerIdent: string | null;
                                    dialogRef: number | null;
                                    kommentarer: Array<{
                                        __typename: 'Kommentar';
                                        id: number;
                                        tekst: string;
                                        opprettet: string;
                                        saksbehandlerident: string;
                                        feilregistrert_tidspunkt: string | null;
                                    }>;
                                }
                              | {
                                    __typename: 'TotrinnsvurderingRetur';
                                    notattekst: string | null;
                                    id: number;
                                    type: Types.PeriodehistorikkType;
                                    timestamp: string;
                                    saksbehandlerIdent: string | null;
                                    dialogRef: number | null;
                                    kommentarer: Array<{
                                        __typename: 'Kommentar';
                                        id: number;
                                        tekst: string;
                                        opprettet: string;
                                        saksbehandlerident: string;
                                        feilregistrert_tidspunkt: string | null;
                                    }>;
                                }
                          >;
                          tidslinje: Array<{
                              __typename: 'Dag';
                              dato: string;
                              grad: number | null;
                              sykdomsdagtype: Types.Sykdomsdagtype;
                              utbetalingsdagtype: Types.Utbetalingsdagtype;
                              begrunnelser: Array<Types.Begrunnelse> | null;
                              kilde: { __typename: 'Kilde'; id: string; type: Types.Kildetype };
                              utbetalingsinfo: {
                                  __typename: 'Utbetalingsinfo';
                                  arbeidsgiverbelop: number | null;
                                  inntekt: number | null;
                                  personbelop: number | null;
                                  refusjonsbelop: number | null;
                                  totalGrad: number | null;
                                  utbetaling: number | null;
                              } | null;
                          }>;
                          varsler: Array<{
                              __typename: 'VarselDTO';
                              id: string;
                              behandlingId: string;
                              definisjonId: string;
                              opprettet: string;
                              kode: string;
                              tittel: string;
                              forklaring: string | null;
                              handling: string | null;
                              vurdering: {
                                  __typename: 'VarselvurderingDTO';
                                  ident: string;
                                  status: Types.Varselstatus;
                                  tidsstempel: string;
                              } | null;
                          }>;
                          hendelser: Array<
                              | {
                                    __typename: 'InntektHentetFraAOrdningen';
                                    mottattDato: string;
                                    id: string;
                                    type: Types.Hendelsetype;
                                }
                              | {
                                    __typename: 'Inntektsmelding';
                                    beregnetInntekt: number;
                                    mottattDato: string;
                                    eksternDokumentId: string | null;
                                    id: string;
                                    type: Types.Hendelsetype;
                                }
                              | {
                                    __typename: 'SoknadArbeidsgiver';
                                    fom: string;
                                    tom: string;
                                    rapportertDato: string;
                                    sendtArbeidsgiver: string;
                                    eksternDokumentId: string | null;
                                    id: string;
                                    type: Types.Hendelsetype;
                                }
                              | {
                                    __typename: 'SoknadArbeidsledig';
                                    fom: string;
                                    tom: string;
                                    rapportertDato: string;
                                    sendtNav: string;
                                    eksternDokumentId: string | null;
                                    id: string;
                                    type: Types.Hendelsetype;
                                }
                              | {
                                    __typename: 'SoknadFrilans';
                                    fom: string;
                                    tom: string;
                                    rapportertDato: string;
                                    sendtNav: string;
                                    eksternDokumentId: string | null;
                                    id: string;
                                    type: Types.Hendelsetype;
                                }
                              | {
                                    __typename: 'SoknadNav';
                                    fom: string;
                                    tom: string;
                                    rapportertDato: string;
                                    sendtNav: string;
                                    eksternDokumentId: string | null;
                                    id: string;
                                    type: Types.Hendelsetype;
                                }
                              | {
                                    __typename: 'SoknadSelvstendig';
                                    fom: string;
                                    tom: string;
                                    rapportertDato: string;
                                    sendtNav: string;
                                    eksternDokumentId: string | null;
                                    id: string;
                                    type: Types.Hendelsetype;
                                }
                              | {
                                    __typename: 'Sykmelding';
                                    fom: string;
                                    tom: string;
                                    rapportertDato: string;
                                    id: string;
                                    type: Types.Hendelsetype;
                                }
                          >;
                      }
                >;
            }>;
            overstyringer: Array<
                | {
                      __typename: 'Arbeidsforholdoverstyring';
                      begrunnelse: string;
                      deaktivert: boolean;
                      skjaeringstidspunkt: string;
                      forklaring: string;
                      hendelseId: string;
                      timestamp: string;
                      ferdigstilt: boolean;
                      vedtaksperiodeId: string;
                      saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
                  }
                | {
                      __typename: 'Dagoverstyring';
                      begrunnelse: string;
                      hendelseId: string;
                      timestamp: string;
                      ferdigstilt: boolean;
                      vedtaksperiodeId: string;
                      dager: Array<{
                          __typename: 'OverstyrtDag';
                          grad: number | null;
                          fraGrad: number | null;
                          dato: string;
                          type: Types.Dagtype;
                          fraType: Types.Dagtype | null;
                      }>;
                      saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
                  }
                | {
                      __typename: 'Inntektoverstyring';
                      hendelseId: string;
                      timestamp: string;
                      ferdigstilt: boolean;
                      vedtaksperiodeId: string;
                      inntekt: {
                          __typename: 'OverstyrtInntekt';
                          skjaeringstidspunkt: string;
                          forklaring: string;
                          begrunnelse: string;
                          manedligInntekt: number;
                          fraManedligInntekt: number | null;
                          refusjonsopplysninger: Array<{
                              __typename: 'Refusjonsopplysning';
                              fom: string;
                              tom: string | null;
                              belop: number;
                          }> | null;
                          fraRefusjonsopplysninger: Array<{
                              __typename: 'Refusjonsopplysning';
                              fom: string;
                              tom: string | null;
                              belop: number;
                          }> | null;
                      };
                      saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
                  }
                | {
                      __typename: 'MinimumSykdomsgradOverstyring';
                      hendelseId: string;
                      timestamp: string;
                      ferdigstilt: boolean;
                      vedtaksperiodeId: string;
                      minimumSykdomsgrad: {
                          __typename: 'OverstyrtMinimumSykdomsgrad';
                          begrunnelse: string;
                          initierendeVedtaksperiodeId: string;
                          perioderVurdertOk: Array<{
                              __typename: 'OverstyrtMinimumSykdomsgradPeriode';
                              fom: string;
                              tom: string;
                          }>;
                          perioderVurdertIkkeOk: Array<{
                              __typename: 'OverstyrtMinimumSykdomsgradPeriode';
                              fom: string;
                              tom: string;
                          }>;
                      };
                      saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
                  }
                | {
                      __typename: 'Sykepengegrunnlagskjonnsfastsetting';
                      hendelseId: string;
                      timestamp: string;
                      ferdigstilt: boolean;
                      vedtaksperiodeId: string;
                      skjonnsfastsatt: {
                          __typename: 'SkjonnsfastsattSykepengegrunnlag';
                          arsak: string;
                          type: Types.Skjonnsfastsettingstype | null;
                          begrunnelse: string | null;
                          begrunnelseMal: string | null;
                          begrunnelseFritekst: string | null;
                          begrunnelseKonklusjon: string | null;
                          arlig: number;
                          fraArlig: number | null;
                          skjaeringstidspunkt: string;
                      };
                      saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
                  }
            >;
            inntekterFraAordningen: Array<{
                __typename: 'ArbeidsgiverInntekterFraAOrdningen';
                skjaeringstidspunkt: string;
                inntekter: Array<{ __typename: 'InntektFraAOrdningen'; maned: string; sum: number }>;
            }>;
        }>;
        tilleggsinfoForInntektskilder: Array<{
            __typename: 'TilleggsinfoForInntektskilde';
            orgnummer: string;
            navn: string;
        }>;
    } | null;
};

export const KommentarFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'kommentar' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Kommentar' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tekst' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerident' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'feilregistrert_tidspunkt' } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<KommentarFragment, unknown>;
export const PeriodeFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'periode' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Periode' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'behandlingId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'erForkastet' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'inntektstype' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'periodetype' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'tidslinje' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'dato' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'grad' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'kilde' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'sykdomsdagtype' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'utbetalingsdagtype' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'utbetalingsinfo' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiverbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'inntekt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'personbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'refusjonsbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'totalGrad' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'utbetaling' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelser' } },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'periodetilstand' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'varsler' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'behandlingId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'definisjonId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'kode' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tittel' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'forklaring' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'handling' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'vurdering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'ident' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tidsstempel' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'hendelser' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'Inntektsmelding' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'beregnetInntekt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'mottattDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Sykmelding' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'SoknadNav' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadArbeidsgiver' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtArbeidsgiver' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadArbeidsledig' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadFrilans' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'InntektHentetFraAOrdningen' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [{ kind: 'Field', name: { kind: 'Name', value: 'mottattDato' } }],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadSelvstendig' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<PeriodeFragment, unknown>;
export const UberegnetPeriodeFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'uberegnetPeriode' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UberegnetPeriode' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'historikkinnslag' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'dialogRef' } },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'LagtPaVent' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'frist' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'arsaker' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'EndrePaVent' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'frist' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'arsaker' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'TotrinnsvurderingRetur' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'StansAutomatiskBehandlingSaksbehandler' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'OpphevStansAutomatiskBehandlingSaksbehandler' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    { kind: 'FragmentSpread', name: { kind: 'Name', value: 'periode' } },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'kommentar' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Kommentar' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tekst' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerident' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'feilregistrert_tidspunkt' } },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'periode' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Periode' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'behandlingId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'erForkastet' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'inntektstype' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'periodetype' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'tidslinje' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'dato' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'grad' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'kilde' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'sykdomsdagtype' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'utbetalingsdagtype' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'utbetalingsinfo' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiverbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'inntekt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'personbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'refusjonsbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'totalGrad' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'utbetaling' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelser' } },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'periodetilstand' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'varsler' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'behandlingId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'definisjonId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'kode' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tittel' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'forklaring' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'handling' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'vurdering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'ident' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tidsstempel' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'hendelser' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'Inntektsmelding' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'beregnetInntekt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'mottattDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Sykmelding' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'SoknadNav' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadArbeidsgiver' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtArbeidsgiver' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadArbeidsledig' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadFrilans' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'InntektHentetFraAOrdningen' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [{ kind: 'Field', name: { kind: 'Name', value: 'mottattDato' } }],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadSelvstendig' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<UberegnetPeriodeFragment, unknown>;
export const SimuleringFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'simulering' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Simulering' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'fagsystemId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'totalbelop' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tidsstempel' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'utbetalingslinjer' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'dagsats' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'grad' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'perioder' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'utbetalinger' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'mottakerId' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'mottakerNavn' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'forfall' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'feilkonto' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'detaljer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'utbetalingstype' },
                                                        },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'uforegrad' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'typeSats' } },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'tilbakeforing' },
                                                        },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'sats' } },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'refunderesOrgNr' },
                                                        },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'konto' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'klassekode' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'antallSats' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'klassekodebeskrivelse' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<SimuleringFragment, unknown>;
export const BeregnetPeriodeFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'beregnetPeriode' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'BeregnetPeriode' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'forbrukteSykedager' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'gjenstaendeSykedager' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'handlinger' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tillatt' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'historikkinnslag' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'dialogRef' } },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'LagtPaVent' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'frist' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'arsaker' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'EndrePaVent' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'frist' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'arsaker' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'TotrinnsvurderingRetur' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'StansAutomatiskBehandlingSaksbehandler' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'OpphevStansAutomatiskBehandlingSaksbehandler' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'maksdato' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'periodevilkar' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'alder' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'alderSisteSykedag' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'oppfylt' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'sykepengedager' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'forbrukteSykedager' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'gjenstaendeSykedager' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'maksdato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'oppfylt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'risikovurdering' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'funn' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'beskrivelse' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'kategori' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'kontrollertOk' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'beskrivelse' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'kategori' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'utbetaling' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiverFagsystemId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiverNettoBelop' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'personFagsystemId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'personNettoBelop' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'vurdering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'automatisk' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'godkjent' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'ident' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tidsstempel' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'arbeidsgiversimulering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'simulering' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'personsimulering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'simulering' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'vilkarsgrunnlagId' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'oppgave' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'paVent' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'frist' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'oid' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'totrinnsvurdering' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'erBeslutteroppgave' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'erRetur' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandler' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'beslutter' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'egenskaper' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'egenskap' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'kategori' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'avslag' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'invalidert' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'vedtakBegrunnelser' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'utfall' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'annullering' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiverFagsystemId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'personFagsystemId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tidspunkt' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'arsaker' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'pensjonsgivendeInntekter' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'arligBelop' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'inntektsar' } },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'grunnbelopsjustertGjennomsnitt' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'annulleringskandidater' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'organisasjonsnummer' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                            ],
                        },
                    },
                    { kind: 'FragmentSpread', name: { kind: 'Name', value: 'periode' } },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'kommentar' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Kommentar' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tekst' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerident' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'feilregistrert_tidspunkt' } },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'simulering' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Simulering' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'fagsystemId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'totalbelop' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tidsstempel' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'utbetalingslinjer' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'dagsats' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'grad' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'perioder' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'utbetalinger' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'mottakerId' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'mottakerNavn' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'forfall' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'feilkonto' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'detaljer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'utbetalingstype' },
                                                        },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'uforegrad' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'typeSats' } },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'tilbakeforing' },
                                                        },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'sats' } },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'refunderesOrgNr' },
                                                        },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'konto' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'klassekode' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'antallSats' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'klassekodebeskrivelse' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'periode' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Periode' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'behandlingId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'erForkastet' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'inntektstype' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'periodetype' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'tidslinje' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'dato' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'grad' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'kilde' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'sykdomsdagtype' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'utbetalingsdagtype' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'utbetalingsinfo' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiverbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'inntekt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'personbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'refusjonsbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'totalGrad' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'utbetaling' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelser' } },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'periodetilstand' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'varsler' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'behandlingId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'definisjonId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'kode' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tittel' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'forklaring' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'handling' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'vurdering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'ident' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tidsstempel' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'hendelser' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'Inntektsmelding' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'beregnetInntekt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'mottattDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Sykmelding' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'SoknadNav' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadArbeidsgiver' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtArbeidsgiver' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadArbeidsledig' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadFrilans' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'InntektHentetFraAOrdningen' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [{ kind: 'Field', name: { kind: 'Name', value: 'mottattDato' } }],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadSelvstendig' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<BeregnetPeriodeFragment, unknown>;
export const OverstyringFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'overstyring' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Overstyring' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'hendelseId' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'saksbehandler' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'ident' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'navn' } },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'ferdigstilt' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                    { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    {
                        kind: 'InlineFragment',
                        typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Dagoverstyring' } },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'dager' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'grad' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'fraGrad' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'dato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'fraType' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'InlineFragment',
                        typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Inntektoverstyring' } },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'inntekt' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'forklaring' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'manedligInntekt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'fraManedligInntekt' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'refusjonsopplysninger' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'fraRefusjonsopplysninger' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'InlineFragment',
                        typeCondition: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'Arbeidsforholdoverstyring' },
                        },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'deaktivert' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'forklaring' } },
                            ],
                        },
                    },
                    {
                        kind: 'InlineFragment',
                        typeCondition: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'Sykepengegrunnlagskjonnsfastsetting' },
                        },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'skjonnsfastsatt' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'arsak' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelseMal' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelseFritekst' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelseKonklusjon' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'arlig' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'fraArlig' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'InlineFragment',
                        typeCondition: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'MinimumSykdomsgradOverstyring' },
                        },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'minimumSykdomsgrad' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'perioderVurdertOk' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'perioderVurdertIkkeOk' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                                    ],
                                                },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'initierendeVedtaksperiodeId' },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<OverstyringFragment, unknown>;
export const VilkarsgrunnlagV2FragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'vilkarsgrunnlagV2' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'VilkarsgrunnlagV2' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'sykepengegrunnlag' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'inntekter' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'sammenligningsgrunnlag' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'inntektFraAOrdningen' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'maned' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'sum' } },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'omregnetArsinntekt' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'inntektFraAOrdningen' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'maned' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'sum' } },
                                                    ],
                                                },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'manedsbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'kilde' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'skjonnsmessigFastsatt' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'inntektFraAOrdningen' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'maned' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'sum' } },
                                                    ],
                                                },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'manedsbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'kilde' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiver' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'deaktivert' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'arbeidsgiverrefusjoner' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiver' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'refusjonsopplysninger' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'meldingsreferanseId' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'InlineFragment',
                        typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'VilkarsgrunnlagSpleisV2' } },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'skjonnsmessigFastsattAarlig' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'vurderingAvKravOmMedlemskap' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'oppfyllerKravOmMinstelonn' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'oppfyllerKravOmOpptjening' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'antallOpptjeningsdagerErMinst' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'grunnbelop' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'opptjeningFra' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'opptjeningsvurderingId' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'sykepengegrunnlagsgrense' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'grunnbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'grense' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'virkningstidspunkt' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'beregningsgrunnlag' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'avviksvurdering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'avviksprosent' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'beregningsgrunnlag' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sammenligningsgrunnlag' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'forsikringsvurderingId' } },
                            ],
                        },
                    },
                    {
                        kind: 'InlineFragment',
                        typeCondition: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'VilkarsgrunnlagInfotrygdV2' },
                        },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'omregnetArsinntekt' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'opptjeningsvurderingId' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<VilkarsgrunnlagV2Fragment, unknown>;
export const GhostPeriodeFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'ghostPeriode' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GhostPeriode' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'deaktivert' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'vilkarsgrunnlagId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'organisasjonsnummer' } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GhostPeriodeFragment, unknown>;
export const ArbeidsgiverFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'arbeidsgiver' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Arbeidsgiver' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'navn' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'organisasjonsnummer' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'arbeidsforhold' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'sluttdato' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'startdato' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'stillingsprosent' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'stillingstittel' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'ghostPerioder' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ghostPeriode' } }],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'behandlinger' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'perioder' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'InlineFragment',
                                                typeCondition: {
                                                    kind: 'NamedType',
                                                    name: { kind: 'Name', value: 'UberegnetPeriode' },
                                                },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'uberegnetPeriode' },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'InlineFragment',
                                                typeCondition: {
                                                    kind: 'NamedType',
                                                    name: { kind: 'Name', value: 'BeregnetPeriode' },
                                                },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'beregnetPeriode' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'overstyringer' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'overstyring' } }],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'inntekterFraAordningen' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'inntekter' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'maned' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sum' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'kommentar' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Kommentar' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tekst' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerident' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'feilregistrert_tidspunkt' } },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'periode' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Periode' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'behandlingId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'erForkastet' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'inntektstype' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'periodetype' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'tidslinje' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'dato' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'grad' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'kilde' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'sykdomsdagtype' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'utbetalingsdagtype' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'utbetalingsinfo' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiverbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'inntekt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'personbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'refusjonsbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'totalGrad' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'utbetaling' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelser' } },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'periodetilstand' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'varsler' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'behandlingId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'definisjonId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'kode' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tittel' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'forklaring' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'handling' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'vurdering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'ident' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tidsstempel' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'hendelser' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'Inntektsmelding' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'beregnetInntekt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'mottattDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Sykmelding' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'SoknadNav' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadArbeidsgiver' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtArbeidsgiver' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadArbeidsledig' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadFrilans' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'InntektHentetFraAOrdningen' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [{ kind: 'Field', name: { kind: 'Name', value: 'mottattDato' } }],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadSelvstendig' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'simulering' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Simulering' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'fagsystemId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'totalbelop' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tidsstempel' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'utbetalingslinjer' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'dagsats' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'grad' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'perioder' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'utbetalinger' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'mottakerId' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'mottakerNavn' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'forfall' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'feilkonto' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'detaljer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'utbetalingstype' },
                                                        },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'uforegrad' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'typeSats' } },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'tilbakeforing' },
                                                        },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'sats' } },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'refunderesOrgNr' },
                                                        },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'konto' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'klassekode' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'antallSats' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'klassekodebeskrivelse' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'ghostPeriode' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GhostPeriode' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'deaktivert' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'vilkarsgrunnlagId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'organisasjonsnummer' } },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'uberegnetPeriode' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UberegnetPeriode' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'historikkinnslag' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'dialogRef' } },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'LagtPaVent' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'frist' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'arsaker' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'EndrePaVent' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'frist' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'arsaker' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'TotrinnsvurderingRetur' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'StansAutomatiskBehandlingSaksbehandler' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'OpphevStansAutomatiskBehandlingSaksbehandler' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    { kind: 'FragmentSpread', name: { kind: 'Name', value: 'periode' } },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'beregnetPeriode' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'BeregnetPeriode' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'forbrukteSykedager' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'gjenstaendeSykedager' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'handlinger' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tillatt' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'historikkinnslag' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'dialogRef' } },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'LagtPaVent' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'frist' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'arsaker' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'EndrePaVent' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'frist' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'arsaker' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'TotrinnsvurderingRetur' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'StansAutomatiskBehandlingSaksbehandler' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'OpphevStansAutomatiskBehandlingSaksbehandler' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'maksdato' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'periodevilkar' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'alder' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'alderSisteSykedag' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'oppfylt' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'sykepengedager' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'forbrukteSykedager' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'gjenstaendeSykedager' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'maksdato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'oppfylt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'risikovurdering' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'funn' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'beskrivelse' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'kategori' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'kontrollertOk' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'beskrivelse' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'kategori' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'utbetaling' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiverFagsystemId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiverNettoBelop' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'personFagsystemId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'personNettoBelop' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'vurdering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'automatisk' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'godkjent' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'ident' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tidsstempel' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'arbeidsgiversimulering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'simulering' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'personsimulering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'simulering' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'vilkarsgrunnlagId' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'oppgave' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'paVent' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'frist' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'oid' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'totrinnsvurdering' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'erBeslutteroppgave' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'erRetur' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandler' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'beslutter' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'egenskaper' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'egenskap' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'kategori' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'avslag' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'invalidert' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'vedtakBegrunnelser' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'utfall' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'annullering' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiverFagsystemId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'personFagsystemId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tidspunkt' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'arsaker' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'pensjonsgivendeInntekter' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'arligBelop' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'inntektsar' } },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'grunnbelopsjustertGjennomsnitt' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'annulleringskandidater' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'organisasjonsnummer' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                            ],
                        },
                    },
                    { kind: 'FragmentSpread', name: { kind: 'Name', value: 'periode' } },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'overstyring' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Overstyring' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'hendelseId' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'saksbehandler' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'ident' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'navn' } },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'ferdigstilt' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                    { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    {
                        kind: 'InlineFragment',
                        typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Dagoverstyring' } },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'dager' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'grad' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'fraGrad' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'dato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'fraType' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'InlineFragment',
                        typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Inntektoverstyring' } },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'inntekt' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'forklaring' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'manedligInntekt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'fraManedligInntekt' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'refusjonsopplysninger' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'fraRefusjonsopplysninger' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'InlineFragment',
                        typeCondition: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'Arbeidsforholdoverstyring' },
                        },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'deaktivert' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'forklaring' } },
                            ],
                        },
                    },
                    {
                        kind: 'InlineFragment',
                        typeCondition: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'Sykepengegrunnlagskjonnsfastsetting' },
                        },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'skjonnsfastsatt' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'arsak' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelseMal' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelseFritekst' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelseKonklusjon' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'arlig' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'fraArlig' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'InlineFragment',
                        typeCondition: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'MinimumSykdomsgradOverstyring' },
                        },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'minimumSykdomsgrad' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'perioderVurdertOk' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'perioderVurdertIkkeOk' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                                    ],
                                                },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'initierendeVedtaksperiodeId' },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<ArbeidsgiverFragment, unknown>;
export const TilleggsinfoForInntektskildeFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'tilleggsinfoForInntektskilde' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TilleggsinfoForInntektskilde' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'orgnummer' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'navn' } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<TilleggsinfoForInntektskildeFragment, unknown>;
export const PersonFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'person' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Person' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'fodselsnummer' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'andreFodselsnummer' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'fodselsnummer' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'personPseudoId' } },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'dodsdato' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'selvstendigNaering' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'behandlinger' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'perioder' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'InlineFragment',
                                                            typeCondition: {
                                                                kind: 'NamedType',
                                                                name: { kind: 'Name', value: 'UberegnetPeriode' },
                                                            },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'FragmentSpread',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'uberegnetPeriode',
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                        {
                                                            kind: 'InlineFragment',
                                                            typeCondition: {
                                                                kind: 'NamedType',
                                                                name: { kind: 'Name', value: 'BeregnetPeriode' },
                                                            },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'FragmentSpread',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'beregnetPeriode',
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'overstyringer' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'overstyring' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'tildeling' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'navn' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'epost' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'oid' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'vilkarsgrunnlagV2' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'vilkarsgrunnlagV2' } },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'aktorId' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'arbeidsgivere' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'arbeidsgiver' } }],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'tilleggsinfoForInntektskilder' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'FragmentSpread',
                                    name: { kind: 'Name', value: 'tilleggsinfoForInntektskilde' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'kommentar' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Kommentar' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tekst' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerident' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'feilregistrert_tidspunkt' } },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'periode' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Periode' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'behandlingId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'erForkastet' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'inntektstype' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'periodetype' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'tidslinje' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'dato' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'grad' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'kilde' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'sykdomsdagtype' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'utbetalingsdagtype' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'utbetalingsinfo' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiverbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'inntekt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'personbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'refusjonsbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'totalGrad' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'utbetaling' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelser' } },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'periodetilstand' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'varsler' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'behandlingId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'definisjonId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'kode' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tittel' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'forklaring' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'handling' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'vurdering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'ident' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tidsstempel' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'hendelser' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'Inntektsmelding' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'beregnetInntekt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'mottattDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Sykmelding' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'SoknadNav' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadArbeidsgiver' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtArbeidsgiver' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadArbeidsledig' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadFrilans' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'InntektHentetFraAOrdningen' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [{ kind: 'Field', name: { kind: 'Name', value: 'mottattDato' } }],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadSelvstendig' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'simulering' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Simulering' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'fagsystemId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'totalbelop' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tidsstempel' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'utbetalingslinjer' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'dagsats' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'grad' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'perioder' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'utbetalinger' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'mottakerId' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'mottakerNavn' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'forfall' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'feilkonto' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'detaljer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'utbetalingstype' },
                                                        },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'uforegrad' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'typeSats' } },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'tilbakeforing' },
                                                        },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'sats' } },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'refunderesOrgNr' },
                                                        },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'konto' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'klassekode' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'antallSats' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'klassekodebeskrivelse' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'ghostPeriode' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GhostPeriode' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'deaktivert' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'vilkarsgrunnlagId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'organisasjonsnummer' } },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'uberegnetPeriode' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UberegnetPeriode' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'historikkinnslag' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'dialogRef' } },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'LagtPaVent' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'frist' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'arsaker' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'EndrePaVent' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'frist' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'arsaker' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'TotrinnsvurderingRetur' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'StansAutomatiskBehandlingSaksbehandler' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'OpphevStansAutomatiskBehandlingSaksbehandler' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    { kind: 'FragmentSpread', name: { kind: 'Name', value: 'periode' } },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'beregnetPeriode' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'BeregnetPeriode' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'forbrukteSykedager' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'gjenstaendeSykedager' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'handlinger' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tillatt' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'historikkinnslag' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'dialogRef' } },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'LagtPaVent' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'frist' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'arsaker' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'EndrePaVent' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'frist' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'arsaker' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'TotrinnsvurderingRetur' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'StansAutomatiskBehandlingSaksbehandler' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'OpphevStansAutomatiskBehandlingSaksbehandler' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'maksdato' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'periodevilkar' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'alder' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'alderSisteSykedag' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'oppfylt' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'sykepengedager' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'forbrukteSykedager' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'gjenstaendeSykedager' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'maksdato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'oppfylt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'risikovurdering' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'funn' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'beskrivelse' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'kategori' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'kontrollertOk' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'beskrivelse' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'kategori' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'utbetaling' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiverFagsystemId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiverNettoBelop' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'personFagsystemId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'personNettoBelop' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'vurdering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'automatisk' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'godkjent' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'ident' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tidsstempel' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'arbeidsgiversimulering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'simulering' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'personsimulering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'simulering' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'vilkarsgrunnlagId' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'oppgave' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'paVent' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'frist' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'oid' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'totrinnsvurdering' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'erBeslutteroppgave' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'erRetur' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandler' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'beslutter' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'egenskaper' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'egenskap' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'kategori' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'avslag' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'invalidert' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'vedtakBegrunnelser' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'utfall' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'annullering' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiverFagsystemId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'personFagsystemId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tidspunkt' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'arsaker' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'pensjonsgivendeInntekter' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'arligBelop' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'inntektsar' } },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'grunnbelopsjustertGjennomsnitt' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'annulleringskandidater' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'organisasjonsnummer' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                            ],
                        },
                    },
                    { kind: 'FragmentSpread', name: { kind: 'Name', value: 'periode' } },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'overstyring' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Overstyring' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'hendelseId' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'saksbehandler' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'ident' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'navn' } },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'ferdigstilt' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                    { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    {
                        kind: 'InlineFragment',
                        typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Dagoverstyring' } },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'dager' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'grad' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'fraGrad' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'dato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'fraType' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'InlineFragment',
                        typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Inntektoverstyring' } },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'inntekt' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'forklaring' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'manedligInntekt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'fraManedligInntekt' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'refusjonsopplysninger' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'fraRefusjonsopplysninger' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'InlineFragment',
                        typeCondition: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'Arbeidsforholdoverstyring' },
                        },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'deaktivert' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'forklaring' } },
                            ],
                        },
                    },
                    {
                        kind: 'InlineFragment',
                        typeCondition: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'Sykepengegrunnlagskjonnsfastsetting' },
                        },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'skjonnsfastsatt' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'arsak' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelseMal' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelseFritekst' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelseKonklusjon' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'arlig' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'fraArlig' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'InlineFragment',
                        typeCondition: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'MinimumSykdomsgradOverstyring' },
                        },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'minimumSykdomsgrad' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'perioderVurdertOk' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'perioderVurdertIkkeOk' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                                    ],
                                                },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'initierendeVedtaksperiodeId' },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'vilkarsgrunnlagV2' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'VilkarsgrunnlagV2' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'sykepengegrunnlag' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'inntekter' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'sammenligningsgrunnlag' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'inntektFraAOrdningen' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'maned' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'sum' } },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'omregnetArsinntekt' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'inntektFraAOrdningen' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'maned' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'sum' } },
                                                    ],
                                                },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'manedsbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'kilde' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'skjonnsmessigFastsatt' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'inntektFraAOrdningen' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'maned' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'sum' } },
                                                    ],
                                                },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'manedsbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'kilde' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiver' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'deaktivert' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'arbeidsgiverrefusjoner' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiver' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'refusjonsopplysninger' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'meldingsreferanseId' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'InlineFragment',
                        typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'VilkarsgrunnlagSpleisV2' } },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'skjonnsmessigFastsattAarlig' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'vurderingAvKravOmMedlemskap' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'oppfyllerKravOmMinstelonn' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'oppfyllerKravOmOpptjening' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'antallOpptjeningsdagerErMinst' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'grunnbelop' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'opptjeningFra' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'opptjeningsvurderingId' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'sykepengegrunnlagsgrense' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'grunnbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'grense' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'virkningstidspunkt' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'beregningsgrunnlag' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'avviksvurdering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'avviksprosent' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'beregningsgrunnlag' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sammenligningsgrunnlag' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'forsikringsvurderingId' } },
                            ],
                        },
                    },
                    {
                        kind: 'InlineFragment',
                        typeCondition: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'VilkarsgrunnlagInfotrygdV2' },
                        },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'omregnetArsinntekt' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'opptjeningsvurderingId' } },
                            ],
                        },
                    },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'arbeidsgiver' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Arbeidsgiver' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'navn' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'organisasjonsnummer' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'arbeidsforhold' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'sluttdato' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'startdato' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'stillingsprosent' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'stillingstittel' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'ghostPerioder' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ghostPeriode' } }],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'behandlinger' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'perioder' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'InlineFragment',
                                                typeCondition: {
                                                    kind: 'NamedType',
                                                    name: { kind: 'Name', value: 'UberegnetPeriode' },
                                                },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'uberegnetPeriode' },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'InlineFragment',
                                                typeCondition: {
                                                    kind: 'NamedType',
                                                    name: { kind: 'Name', value: 'BeregnetPeriode' },
                                                },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'beregnetPeriode' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'overstyringer' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'overstyring' } }],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'inntekterFraAordningen' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'inntekter' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'maned' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sum' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'tilleggsinfoForInntektskilde' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TilleggsinfoForInntektskilde' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'orgnummer' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'navn' } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<PersonFragment, unknown>;
export const FetchPersonDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'FetchPerson' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'personPseudoId' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'person' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'personPseudoId' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'personPseudoId' } },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'person' } }],
                        },
                    },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'kommentar' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Kommentar' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tekst' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerident' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'feilregistrert_tidspunkt' } },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'periode' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Periode' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'behandlingId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'erForkastet' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'inntektstype' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'periodetype' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'tidslinje' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'dato' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'grad' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'kilde' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'sykdomsdagtype' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'utbetalingsdagtype' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'utbetalingsinfo' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiverbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'inntekt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'personbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'refusjonsbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'totalGrad' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'utbetaling' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelser' } },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'periodetilstand' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'varsler' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'behandlingId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'definisjonId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'kode' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tittel' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'forklaring' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'handling' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'vurdering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'ident' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tidsstempel' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'hendelser' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'Inntektsmelding' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'beregnetInntekt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'mottattDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Sykmelding' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'SoknadNav' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadArbeidsgiver' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtArbeidsgiver' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadArbeidsledig' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadFrilans' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'InntektHentetFraAOrdningen' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [{ kind: 'Field', name: { kind: 'Name', value: 'mottattDato' } }],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadSelvstendig' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'uberegnetPeriode' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UberegnetPeriode' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'historikkinnslag' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'dialogRef' } },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'LagtPaVent' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'frist' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'arsaker' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'EndrePaVent' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'frist' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'arsaker' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'TotrinnsvurderingRetur' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'StansAutomatiskBehandlingSaksbehandler' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'OpphevStansAutomatiskBehandlingSaksbehandler' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    { kind: 'FragmentSpread', name: { kind: 'Name', value: 'periode' } },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'simulering' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Simulering' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'fagsystemId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'totalbelop' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tidsstempel' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'utbetalingslinjer' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'dagsats' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'grad' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'perioder' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'utbetalinger' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'mottakerId' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'mottakerNavn' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'forfall' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'feilkonto' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'detaljer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'utbetalingstype' },
                                                        },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'uforegrad' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'typeSats' } },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'tilbakeforing' },
                                                        },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'sats' } },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'refunderesOrgNr' },
                                                        },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'konto' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'klassekode' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'antallSats' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'klassekodebeskrivelse' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'beregnetPeriode' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'BeregnetPeriode' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'forbrukteSykedager' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'gjenstaendeSykedager' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'handlinger' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tillatt' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'historikkinnslag' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'dialogRef' } },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'LagtPaVent' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'frist' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'arsaker' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'EndrePaVent' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'frist' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'arsaker' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'TotrinnsvurderingRetur' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'StansAutomatiskBehandlingSaksbehandler' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'OpphevStansAutomatiskBehandlingSaksbehandler' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'maksdato' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'periodevilkar' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'alder' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'alderSisteSykedag' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'oppfylt' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'sykepengedager' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'forbrukteSykedager' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'gjenstaendeSykedager' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'maksdato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'oppfylt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'risikovurdering' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'funn' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'beskrivelse' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'kategori' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'kontrollertOk' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'beskrivelse' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'kategori' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'utbetaling' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiverFagsystemId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiverNettoBelop' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'personFagsystemId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'personNettoBelop' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'vurdering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'automatisk' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'godkjent' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'ident' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tidsstempel' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'arbeidsgiversimulering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'simulering' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'personsimulering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'simulering' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'vilkarsgrunnlagId' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'oppgave' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'paVent' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'frist' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'oid' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'totrinnsvurdering' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'erBeslutteroppgave' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'erRetur' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandler' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'beslutter' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'egenskaper' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'egenskap' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'kategori' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'avslag' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'invalidert' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'vedtakBegrunnelser' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'utfall' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'annullering' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiverFagsystemId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'personFagsystemId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tidspunkt' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'arsaker' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'pensjonsgivendeInntekter' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'arligBelop' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'inntektsar' } },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'grunnbelopsjustertGjennomsnitt' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'annulleringskandidater' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'organisasjonsnummer' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                            ],
                        },
                    },
                    { kind: 'FragmentSpread', name: { kind: 'Name', value: 'periode' } },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'overstyring' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Overstyring' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'hendelseId' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'saksbehandler' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'ident' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'navn' } },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'ferdigstilt' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                    { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    {
                        kind: 'InlineFragment',
                        typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Dagoverstyring' } },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'dager' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'grad' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'fraGrad' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'dato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'fraType' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'InlineFragment',
                        typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Inntektoverstyring' } },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'inntekt' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'forklaring' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'manedligInntekt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'fraManedligInntekt' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'refusjonsopplysninger' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'fraRefusjonsopplysninger' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'InlineFragment',
                        typeCondition: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'Arbeidsforholdoverstyring' },
                        },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'deaktivert' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'forklaring' } },
                            ],
                        },
                    },
                    {
                        kind: 'InlineFragment',
                        typeCondition: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'Sykepengegrunnlagskjonnsfastsetting' },
                        },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'skjonnsfastsatt' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'arsak' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelseMal' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelseFritekst' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelseKonklusjon' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'arlig' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'fraArlig' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'InlineFragment',
                        typeCondition: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'MinimumSykdomsgradOverstyring' },
                        },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'minimumSykdomsgrad' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'perioderVurdertOk' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'perioderVurdertIkkeOk' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                                    ],
                                                },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'initierendeVedtaksperiodeId' },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'vilkarsgrunnlagV2' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'VilkarsgrunnlagV2' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'sykepengegrunnlag' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'inntekter' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'sammenligningsgrunnlag' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'inntektFraAOrdningen' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'maned' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'sum' } },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'omregnetArsinntekt' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'inntektFraAOrdningen' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'maned' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'sum' } },
                                                    ],
                                                },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'manedsbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'kilde' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'skjonnsmessigFastsatt' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'inntektFraAOrdningen' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'maned' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'sum' } },
                                                    ],
                                                },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'manedsbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'kilde' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiver' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'deaktivert' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'arbeidsgiverrefusjoner' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiver' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'refusjonsopplysninger' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'meldingsreferanseId' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'InlineFragment',
                        typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'VilkarsgrunnlagSpleisV2' } },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'skjonnsmessigFastsattAarlig' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'vurderingAvKravOmMedlemskap' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'oppfyllerKravOmMinstelonn' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'oppfyllerKravOmOpptjening' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'antallOpptjeningsdagerErMinst' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'grunnbelop' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'opptjeningFra' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'opptjeningsvurderingId' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'sykepengegrunnlagsgrense' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'grunnbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'grense' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'virkningstidspunkt' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'beregningsgrunnlag' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'avviksvurdering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'avviksprosent' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'beregningsgrunnlag' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sammenligningsgrunnlag' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'forsikringsvurderingId' } },
                            ],
                        },
                    },
                    {
                        kind: 'InlineFragment',
                        typeCondition: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'VilkarsgrunnlagInfotrygdV2' },
                        },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'omregnetArsinntekt' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'opptjeningsvurderingId' } },
                            ],
                        },
                    },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'ghostPeriode' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GhostPeriode' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'deaktivert' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'vilkarsgrunnlagId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'organisasjonsnummer' } },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'arbeidsgiver' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Arbeidsgiver' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'navn' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'organisasjonsnummer' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'arbeidsforhold' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'sluttdato' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'startdato' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'stillingsprosent' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'stillingstittel' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'ghostPerioder' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ghostPeriode' } }],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'behandlinger' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'perioder' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'InlineFragment',
                                                typeCondition: {
                                                    kind: 'NamedType',
                                                    name: { kind: 'Name', value: 'UberegnetPeriode' },
                                                },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'uberegnetPeriode' },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'InlineFragment',
                                                typeCondition: {
                                                    kind: 'NamedType',
                                                    name: { kind: 'Name', value: 'BeregnetPeriode' },
                                                },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'beregnetPeriode' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'overstyringer' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'overstyring' } }],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'inntekterFraAordningen' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'inntekter' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'maned' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sum' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'tilleggsinfoForInntektskilde' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TilleggsinfoForInntektskilde' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'orgnummer' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'navn' } },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'person' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Person' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'fodselsnummer' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'andreFodselsnummer' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'fodselsnummer' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'personPseudoId' } },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'dodsdato' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'selvstendigNaering' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'behandlinger' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'perioder' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'InlineFragment',
                                                            typeCondition: {
                                                                kind: 'NamedType',
                                                                name: { kind: 'Name', value: 'UberegnetPeriode' },
                                                            },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'FragmentSpread',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'uberegnetPeriode',
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                        {
                                                            kind: 'InlineFragment',
                                                            typeCondition: {
                                                                kind: 'NamedType',
                                                                name: { kind: 'Name', value: 'BeregnetPeriode' },
                                                            },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'FragmentSpread',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'beregnetPeriode',
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'overstyringer' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'overstyring' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'tildeling' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'navn' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'epost' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'oid' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'vilkarsgrunnlagV2' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'vilkarsgrunnlagV2' } },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'aktorId' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'arbeidsgivere' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'arbeidsgiver' } }],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'tilleggsinfoForInntektskilder' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'FragmentSpread',
                                    name: { kind: 'Name', value: 'tilleggsinfoForInntektskilde' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<FetchPersonQuery, FetchPersonQueryVariables>;
