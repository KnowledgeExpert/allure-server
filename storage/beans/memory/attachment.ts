import {Attachment as CachedAttachment} from "../cache/attachment";
import * as fs from "fs";

export class Attachment {
    public readonly title: string;
    public readonly mime: string;
    public readonly buffer: Buffer;
    public readonly fileId: string;
    public readonly size: number;

    constructor(title, mime, fileId, size, buffer) {
        this.title = title;
        this.mime = mime;
        this.fileId = fileId;
        this.size = size;
        this.buffer = buffer;
    }

    static async wrap(cachedAttachment: CachedAttachment, popdata: boolean) {
        const buff = await Attachment.getBuffer(cachedAttachment.fullFilePath);
        if (popdata) await Attachment.unlink(cachedAttachment.fullFilePath);
        return new Attachment(
            cachedAttachment.title,
            cachedAttachment.mime,
            cachedAttachment.fileId,
            cachedAttachment.size,
            buff);
    }

    private static async getBuffer(path: string) {
        return new Promise<Buffer>((resolve, reject) => {
            fs.readFile(path, (err, result) => {
                if (err) reject(err);
                resolve(result);
            })
        });
    }

    private static async unlink(path: string) {
        return new Promise<void>(((resolve, reject) => {
            fs.unlink(path, (err) => {
                if (err) reject(err);
                resolve();
            });
        }));
    }
}
