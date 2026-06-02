import fs from 'fs';
import path from 'path';
import { cwd } from 'process';

export class SanityMock {
    private static årsaker: Map<string, string> = new Map();

    static {
        const dir = path.join(cwd(), 'src/spesialist-mock/data/sanity/årsaker');

        SanityMock.årsaker = new Map(
            fs.readdirSync(dir).map((file) => {
                const key = path.parse(file).name;
                const fileContents = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'));
                return [key, fileContents];
            }),
        );
    }

    static forkastingarsaker() {
        return SanityMock.årsaker.get('forkastingarsaker');
    }
}
