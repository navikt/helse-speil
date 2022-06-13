import { Extension } from './types';

export class NotFoundError extends Error {
    extensions: Extension;

    constructor(message: string, field: string) {
        super(message);
        this.extensions = { code: 404, field };
    }
}
