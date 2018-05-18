import {Step as CachedStep} from "../cache/step";
import {Attachment} from "./attachment";


export class Step {
    private readonly name: string;
    private readonly status: string;
    private readonly start: number;
    private readonly stop: number;
    public readonly attachments: Attachment[] = [];
    public readonly innerSteps: Step[] = [];

    constructor(name, status, start, stop, attachments, innerSteps) {
        this.name = name;
        this.status = status;
        this.start = start;
        this.stop = stop;
        this.attachments = attachments;
        this.innerSteps = innerSteps;
    }

    static async wrap(cachedStep: CachedStep) {
        return new Step(
            cachedStep.name,
            cachedStep.status,
            cachedStep.start,
            cachedStep.stop,
            await Promise.all(cachedStep.attachments.map(async (cachedAttachment) => await Attachment.wrap(cachedAttachment))),
            await Promise.all(cachedStep.innerSteps.map(async (cachedStep) => await Step.wrap(cachedStep)))
        );
    }
}