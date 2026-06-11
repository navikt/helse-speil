import { NextRequest } from 'next/server';

import { stubEllerVideresendTilSporhund } from '@app/api/sporhund/common';

const mockPdfContent = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Contents 5 0 R/Resources<</Font<</F1 4 0 R>>>>>>endobj
4 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
5 0 obj<</Length 44>>
stream
BT /F1 24 Tf 100 700 Td (Mocked vedlegg) Tj ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000266 00000 n 
0000000340 00000 n 
trailer<</Size 6/Root 1 0 R>>
startxref
440
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
