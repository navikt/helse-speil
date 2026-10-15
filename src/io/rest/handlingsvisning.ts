import z from 'zod/v4';

// Visningsmodell som domenetjenestene returnerer for en saksbehandlerhandling. Verdiene kommer ferdig
// formatert, så Speil trenger ingen domenekunnskap for å vise dem.

const tekstSchema = z.object({ type: z.literal('TEKST'), tittel: z.string(), tekst: z.string() });
const listeSchema = z.object({ type: z.literal('LISTE'), tittel: z.string(), elementer: z.array(z.string()) });

const visningsfeltSchema = z.discriminatedUnion('type', [tekstSchema, listeSchema]);

const kjenteFelttyper: string[] = visningsfeltSchema.options.map((option) => option.shape.type.value);

export const handlingsvisningSchema = z.object({
    // Domenene kan sende nye felttyper før Speil støtter dem, så ukjente typer hoppes over
    felter: z
        .array(z.looseObject({ type: z.string() }))
        .transform((felter) => felter.filter((felt) => kjenteFelttyper.includes(felt.type)))
        .pipe(z.array(visningsfeltSchema)),
});

export type Handlingsvisning = z.output<typeof handlingsvisningSchema>;
export type Visningsfelt = z.output<typeof visningsfeltSchema>;
