import fs from 'fs';
import path from 'path';
import { cwd } from 'process';

export class SanityMock {
    private static årsaker: Map<string, string> = new Map();

    static {
        const årsakerPath = path.join(cwd(), 'src/spesialist-mock/data/sanity/årsaker');
        const filenames = fs.readdirSync(årsakerPath);

        filenames.forEach((filename) => {
            const raw = fs.readFileSync(path.join(årsakerPath, filename), { encoding: 'utf-8' });
            SanityMock.årsaker.set(filename.split('.json')[0]!, JSON.parse(raw));
        });
    }

    static forkastingarsaker() {
        return SanityMock.årsaker.get('forkastingarsaker');
    }
}
