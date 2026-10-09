import { JsonViewer } from 'json-edit-react';
import React from 'react';

interface JsonVisningProps {
    data: object;
}

export function JsonVisning({ data }: JsonVisningProps) {
    return <JsonViewer data={data} collapse={1} rootName="" minWidth="100%" />;
}
