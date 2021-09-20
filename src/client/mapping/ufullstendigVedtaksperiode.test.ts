import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

import { NORSK_DATOFORMAT } from '../utils/date';

import { umappetArbeidsgiver } from '../../test/data/arbeidsgiver';
import { umappetPerson } from '../../test/data/person';
import {
    mappetUfullstendigVedtaksperiode,
    umappetUfullstendigVedtaksperiode,
} from '../../test/data/ufullstendigVedtaksperiode';
import { UfullstendigVedtaksperiodeBuilder } from './ufullstendigVedtaksperiode';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

describe('UfullstendigVedtaksperiodeBuilder', () => {
    test('bygger ufullstendig vedtaksperiode', () => {
        const { ufullstendigVedtaksperiode, problems } = new UfullstendigVedtaksperiodeBuilder(
            umappetPerson(),
            umappetArbeidsgiver(),
            umappetUfullstendigVedtaksperiode()
        ).build() as { ufullstendigVedtaksperiode: UfullstendigVedtaksperiode; problems: Error[] };

        expect(ufullstendigVedtaksperiode).toEqual(mappetUfullstendigVedtaksperiode());
        expect(problems).toHaveLength(0);
        expect(ufullstendigVedtaksperiode.id).toEqual('fa02d7a5-daf2-488c-9798-2539edd7fe3g');
        expect(ufullstendigVedtaksperiode.fom.format(NORSK_DATOFORMAT)).toEqual('01.01.2020');
        expect(ufullstendigVedtaksperiode.tom.format(NORSK_DATOFORMAT)).toEqual('31.01.2020');
        expect(ufullstendigVedtaksperiode.tilstand).toEqual('venter');
        expect(ufullstendigVedtaksperiode.fullstendig).toBeFalsy();
    });
});
