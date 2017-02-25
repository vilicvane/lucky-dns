import * as Crypto from 'crypto';

export function generateMD5Hex(data: Buffer | string): string {
    let hash = Crypto.createHash('md5');
    hash.update(data);
    return hash.digest('hex');
}
