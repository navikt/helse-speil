import { ReactElement, useState } from 'react';

import { Box, CopyButton, Tooltip } from '@navikt/ds-react';

interface JsonVisningProps {
    data: object;
}

export function JsonVisning({ data }: JsonVisningProps): ReactElement {
    return (
        <Box
            background="neutral-soft"
            padding="space-12"
            borderRadius="8"
            className="w-full overflow-auto font-mono text-base"
        >
            <JsonNode value={data} depth={0} />
        </Box>
    );
}

interface JsonNodeProps {
    name?: string;
    value: unknown;
    depth: number;
}

function JsonNode({ name, value, depth }: JsonNodeProps): ReactElement {
    if (value !== null && typeof value === 'object') {
        return <JsonObject name={name} value={value} depth={depth} />;
    }
    return (
        <div className="group">
            {name !== undefined && <JsonKey name={name} />}
            <JsonPrimitive value={value} />
            <JsonCopyButton name={name} copyText={String(value)} />
        </div>
    );
}

// Rotnivået er åpent, alt under starter lukket
function JsonObject({ name, value, depth }: JsonNodeProps & { value: object }): ReactElement {
    const [open, setOpen] = useState(depth < 1);
    const erListe = Array.isArray(value);
    const entries: [string, unknown][] = erListe
        ? value.map((it, index) => [String(index), it])
        : Object.entries(value);
    const [start, slutt] = erListe ? ['[', ']'] : ['{', '}'];

    return (
        <details open={open} onToggle={(event) => setOpen(event.currentTarget.open)}>
            <summary className="group cursor-pointer">
                {name !== undefined && <JsonKey name={name} />}
                {open ? (
                    start
                ) : (
                    <span className="text-[light-dark(#9E880D,var(--color-yellow-500))]">{`${start} ${count(entries.length, erListe)} ${slutt}`}</span>
                )}
                <JsonCopyButton name={name} copyText={JSON.stringify(value, null, 4)} />
            </summary>
            <Box as="ul" paddingInline="space-24 space-0">
                {entries.map(([key, child]) => (
                    <li key={key}>
                        <JsonNode name={key} value={child} depth={depth + 1} />
                    </li>
                ))}
            </Box>
            <div>{slutt}</div>
        </details>
    );
}

function JsonPrimitive({ value }: { value: unknown }): ReactElement {
    if (typeof value === 'string')
        return <span className="text-[light-dark(#067D17,#6AAB73)]">&quot;{value}&quot;</span>;
    if (typeof value === 'number') return <span className="text-[light-dark(#1750EB,#2AACB8)]">{value}</span>;
    return <span className="text-[light-dark(#0033B3,#CF8E6D)]">{String(value)}</span>;
}

function JsonKey({ name }: { name: string }): ReactElement {
    return <span className="text-[light-dark(#871094,#C77DBB)]">{name}: </span>;
}

// preventDefault hindrer at klikk på knappen inne i <summary> åpner eller lukker noden
function JsonCopyButton({ name, copyText }: { name?: string; copyText: string }): ReactElement {
    return (
        <span
            className="ml-2 inline-block align-middle not-group-hover:not-focus-within:opacity-0"
            onClick={(event) => event.preventDefault()}
        >
            <Tooltip content={name === undefined ? 'Kopier JSON' : `Kopier ${name}`}>
                <CopyButton size="xsmall" copyText={copyText} />
            </Tooltip>
        </span>
    );
}

function count(length: number, isArray: boolean): string {
    if (isArray) return length === 1 ? '1 element' : `${length} elements`;
    return length === 1 ? '1 key' : `${length} keys`;
}
