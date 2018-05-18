export class Attachment {
    public readonly title: string;
    public readonly mime: string;
    public readonly size: number;
    public readonly fullFilePath: string;
    public readonly fileId: string;

    constructor(title: string, filepath: string, mime: string, size: number, fileId: string) {
        this.title = title;
        this.fullFilePath = filepath;
        this.mime = mime;
        this.size = size;
        this.fileId = fileId;
    }
}
