import { NextRequest } from 'next/server';

import { stubEllerVideresendTilSporhund } from '@app/api/sporhund/common';

const mockPdfContent = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R>>endobj
xref
0 4
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
trailer<</Size 4/Root 1 0 R>>
startxref
190
%%EOF`;

async function stub(
    _request: NextRequest,
    params: Promise<{ pseudoId: string; msgId: string; index: string }>,
): Promise<Response> {
    const { msgId, index } = await params;
    return new Response(Buffer.from(mockPdfContent, 'utf-8'), {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="vedlegg-${msgId}-${index}.pdf"`,
        },
    });
}

export const dynamic = 'force-dynamic';

export const GET = stubEllerVideresendTilSporhund(stub);
