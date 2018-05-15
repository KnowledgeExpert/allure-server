import {Attachment as CachedAttachment} from "../cache/attachment";
import * as fs from "fs";

export class Attachment {
    public readonly title: string;
    public readonly mime: string;
    public readonly bufferString: string;
    public readonly fileName: string;

    constructor(cachedAttachment: CachedAttachment) {
        this.title = cachedAttachment.title;
        this.mime = cachedAttachment.mime;
        this.bufferString = fs.readFileSync(cachedAttachment.fullFilePath).toString();
        this.fileName = cachedAttachment.fileName
        fs.unlinkSync(cachedAttachment.fullFilePath);
    }
}
