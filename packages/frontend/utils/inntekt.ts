import dayjs from 'dayjs';
import { InntektFraAOrdningen } from '@io/graphql';

export const sorterInntekterFraAOrdningen = (
    inntekterFraAOrdningen: ExternalInntekterFraAOrdningen[] | null,
): ExternalInntekterFraAOrdningen[] | null =>
    inntekterFraAOrdningen == null
        ? null
        : inntekterFraAOrdningen
              .map((inntektFraAOrdningen) => ({
                  måned: dayjs(inntektFraAOrdningen.måned, 'YYYY-MM'),
                  sum: inntektFraAOrdningen.sum,
              }))
              .sort((a, b) => (a.måned.isAfter(b.måned) ? -1 : 1))
              .map((it) => ({
                  måned: it.måned.format('YYYY-MM'),
                  sum: it.sum,
              }));

export const sorterInntekterFraAOrdningenNy = (
    inntekterFraAOrdningen?: InntektFraAOrdningen[] | null,
): InntektFraAOrdningen[] | null =>
    inntekterFraAOrdningen
        ? inntekterFraAOrdningen
              .map((inntektFraAOrdningen) => ({
                  maned: dayjs(inntektFraAOrdningen.maned, 'YYYY-MM'),
                  sum: inntektFraAOrdningen.sum,
              }))
              .sort((a, b) => (a.maned.isAfter(b.maned) ? -1 : 1))
              .map((it) => ({
                  maned: it.maned.format('YYYY-MM'),
                  sum: it.sum,
              }))
        : null;
