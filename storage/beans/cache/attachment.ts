import {Util} from "../../util";


export class Attachment {
    public readonly title: string;
    public readonly mime: string;
    public readonly fullFilePath: string;
    public readonly fileName: string;

    constructor(title: string, buff: Buffer, mime: string) {
        const info = Util.getBufferInfo(buff, mime);
        this.title = title;
        this.mime = mime ? mime : info.mime;
        this.fullFilePath = Util.writeBuffer(buff, info.fileExtension);
        this.fileName = this.fullFilePath.match(/\/([^\/]+)$/)[1];
    }

}
