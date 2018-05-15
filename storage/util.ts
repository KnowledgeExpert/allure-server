import * as mime from "mime";
import * as filetype from "file-type";
import * as path from "path";
import * as fs from "fs-extra";
import * as uuid from "uuid";


export namespace Util {
    export function getBufferInfo(stringBuffer: Buffer, mimeType): { mime: string, fileExtension: string } {
        const fileInfo = filetype(stringBuffer);

        const fileMime = mimeType ? mimeType : fileInfo ? fileInfo.mime : 'text/plain';
        const fileExtension = mimeType ? mime.getExtension(fileMime) : fileInfo ? fileInfo.ext : 'txt';

        return {
            mime: fileMime,
            fileExtension: fileExtension
        };
    }

    export function writeBuffer(buffer, ext, baseDir = './cache'): string {
        const fileName = uuid.v4() + '-attachment.' + ext;
        const fullFilePath = path.join(baseDir, fileName);
        fs.outputFileSync(fullFilePath, buffer);
        return fullFilePath;
    }

}