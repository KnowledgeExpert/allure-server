"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
class Attachment {
    constructor(title, mime, fileId, size, buffer) {
        this.title = title;
        this.mime = mime;
        this.fileId = fileId;
        this.size = size;
        this.buffer = buffer;
    }
    static async wrap(cachedAttachment) {
        const buff = await Attachment.getBuffer(cachedAttachment.fullFilePath);
        await Attachment.unlink(cachedAttachment.fullFilePath);
        return new Attachment(cachedAttachment.title, cachedAttachment.mime, cachedAttachment.fileId, cachedAttachment.size, buff);
    }
    static async getBuffer(path) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, (err, result) => {
                if (err)
                    reject(err);
                resolve(result);
            });
        });
    }
    static async unlink(path) {
        return new Promise(((resolve, reject) => {
            fs.unlink(path, (err) => {
                if (err)
                    reject(err);
                resolve();
            });
        }));
    }
}
exports.Attachment = Attachment;
//# sourceMappingURL=attachment.js.map