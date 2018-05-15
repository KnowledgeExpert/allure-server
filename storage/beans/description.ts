export class Description {
    private readonly value;
    private readonly type;

    constructor(value: string, type = DESCRIPTION_TYPE.TEXT) {
        this.value = value;
        this.type = type;
    }
}

export enum DESCRIPTION_TYPE {
    'TEXT',
    'HTML',
    'MARKDOWN'
}