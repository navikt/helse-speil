import { z } from 'zod/v4';

import { kanVelgeGrad } from '@saksbilde/utbetaling/utbetalingstabell/endringForm/kanVelgeGrad';
import { utbetalingstabelldagtypeSelvstendigValues, utbetalingstabelldagtypeValues } from '@typer/utbetalingstabell';
import { somDato } from '@utils/date';

const lagGradValidering = (grad: number | null, ctx: z.RefinementCtx) => {
    if (grad == null || (grad as unknown) === '') {
        ctx.addIssue({
            code: 'custom',
            message: 'Velg grad',
            input: grad,
            path: ['grad'],
        });
    } else if (Number.isNaN(grad)) {
        ctx.addIssue({
            code: 'custom',
            message: 'Grad må være et tall',
            input: grad,
            path: ['grad'],
        });
    } else if (grad < 0) {
        ctx.addIssue({
            code: 'too_small',
            message: `Grad må være minst 0`,
            minimum: 0,
            origin: 'number',
            input: grad,
            path: ['grad'],
        });
    } else if (grad > 100) {
        ctx.addIssue({
            code: 'too_big',
            message: 'Grad må være 100 eller lavere',
            maximum: 100,
            origin: 'number',
            input: grad,
            path: ['grad'],
        });
    }
};

export const lagLeggTilDagerArbeidstakerSchema = () =>
    z
        .object({
            dagtype: z.enum(utbetalingstabelldagtypeValues),
            fom: z.iso.date(),
            tom: z.iso.date(),
            grad: z.number(),
        })
        .superRefine(({ dagtype, grad }, ctx) => {
            if (kanVelgeGrad(dagtype)) {
                lagGradValidering(grad, ctx);
            }
            if (dagtype === 'Syk' || dagtype === 'SykNav') {
                ctx.addIssue({
                    code: 'custom',
                    message: `Du kan ikke legge til ${dagtype === 'Syk' ? 'Syk' : 'Syk (Nav)'} i forkant av sykmelding`,
                    input: dagtype,
                    path: ['dagtype'],
                });
            }
        })
        .superRefine(maksDagerFørSykmeldingen(18));

export const lagLeggTilDagerSelvstendigSchema = () =>
    z
        .object({
            dagtype: z.enum(utbetalingstabelldagtypeSelvstendigValues),
            fom: z.iso.date(),
            tom: z.iso.date(),
        })
        .superRefine(maksDagerFørSykmeldingen(16));

function maksDagerFørSykmeldingen(maksDagerForDagtype: number) {
    return ({ fom, tom }: { fom: string; tom: string }, ctx: z.RefinementCtx) => {
        const antallDager = Math.abs(somDato(fom).diff(somDato(tom), 'days'));

        if (antallDager > maksDagerForDagtype) {
            ctx.addIssue({
                code: 'custom',
                message: `Maks ${maksDagerForDagtype} kan legges inn før sykmeldingen`,
                input: fom,
                path: ['fom'],
            });
        }
    };
}

export type LeggTilDagerArbeidstakerFormFields = z.infer<ReturnType<typeof lagLeggTilDagerArbeidstakerSchema>>;
export type LeggTilDagerSelvstendigFormFields = z.infer<ReturnType<typeof lagLeggTilDagerSelvstendigSchema>>;
