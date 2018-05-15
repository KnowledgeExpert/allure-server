import {Attachment as CachedAttachment} from "../cache/attachment";
import {Step as CachedStep} from "../cache/step";
import {Attachment} from "./attachment";
import {STEP_STATUS} from "../stepStatus";


export class Step {
    private readonly name: string;
    private readonly status: STEP_STATUS;
    private readonly start: number;
    private readonly stop: number;
    public readonly attachments: Attachment[] = [];
    public readonly innerSteps: Step[] = [];

    constructor(cachedStep: CachedStep) {
        this.name = cachedStep.name;
        this.status = cachedStep.status;
        this.start = cachedStep.start;
        this.stop = cachedStep.stop;
        this.attachments = cachedStep.attachments.map((cachedAttachment: CachedAttachment) => new Attachment(cachedAttachment));
        this.innerSteps = cachedStep.innerSteps.map(cachedStep => new Step(cachedStep));
    }
}