import * as uuid from "uuid";
import {Storage} from "../storage/";
import * as p from "path";
import {Configuration} from "./configuration";
import * as multer from "multer";
const upload = multer({dest: Configuration.cacheDir});


export const router = function (app) {

    app.get("/newid", async (request, response) => {
        response.status(200).send(uuid.v4());
    });

    app.delete("/session", async (request, response) => {
        await returnJson(response, () => {
            const session_id = request.query.session_id;
            console.log('delete /session', session_id);
            Storage.deleteSession(session_id);
        });
    });

    app.get("/popdata", async (request, response) => {
        await returnJson(response, async () => {
            const session_id = request.query.session_id;
            console.log('get /popdata', session_id);
            return await Storage.popData(session_id);
        });
    });

    app.get("/data", async (request, response) => {
        await returnJson(response, async () => {
            const session_id = request.query.session_id;
            console.log('get /popdata', session_id);
            return await Storage.getData(session_id);
        });
    });

    app.post("/startsuite", async (request, response) => {
        await returnJson(response, () => {
            const session_id: string = request.body.session_id;
            const test_run_id = request.body.test_run_id;
            const name: string = request.body.name;
            const timestamp: string = request.body.timestamp;
            console.log('post /startsuite', session_id, test_run_id, name, timestamp);
            Storage.startSuite(session_id, test_run_id, name, timestamp)
        });
    });

    app.post("/endsuite", async (request, response) => {
        await returnJson(response, () => {
            const session_id: string = request.body.session_id;
            const test_run_id = request.body.test_run_id;
            const timestamp: string = request.body.timestamp;
            console.log('post /endsuite', session_id, test_run_id, timestamp);
            Storage.endSuite(session_id, test_run_id, timestamp)
        });
    });

    app.post("/starttest", async (request, response) => {
        await returnJson(response, () => {
            const session_id: string = request.body.session_id;
            const test_run_id = request.body.test_run_id;
            const name: string = request.body.name;
            const timestamp: string = request.body.timestamp;
            console.log('post /starttest', session_id, test_run_id, name, timestamp);
            Storage.startTest(session_id, test_run_id, name, timestamp)
        });
    });

    app.post("/endtest", async (request, response) => {
        await returnJson(response, () => {
            const session_id: string = request.body.session_id;
            const test_run_id = request.body.test_run_id;
            const status: string = request.body.status;
            const error: string = request.body.error;
            const timestamp: string = request.body.timestamp;
            console.log('post /endtest', session_id, test_run_id, status, error, timestamp);
            Storage.endTest(session_id, test_run_id, status, error, timestamp);
        });
    });

    app.post("/startstep", async (request, response) => {
        await returnJson(response, () => {
            const session_id: string = request.body.session_id;
            const test_run_id = request.body.test_run_id;
            const name: string = request.body.name;
            const timestamp: string = request.body.timestamp;
            console.log('post /startstep', session_id, test_run_id, name, timestamp);
            Storage.startStep(session_id, test_run_id, name, timestamp);
        });
    });

    app.post("/endstep", async (request, response) => {
        await returnJson(response, () => {
            const session_id: string = request.body.session_id;
            const test_run_id = request.body.test_run_id;
            const status: string = request.body.status;
            const timestamp: string = request.body.timestamp;
            console.log('post /endstep', session_id, test_run_id, status, timestamp);
            Storage.endStep(session_id, test_run_id, status, timestamp);
        });
    });

    app.post("/description", async (request, response) => {
        await returnJson(response, () => {
            const session_id: string = request.body.session_id;
            const test_run_id = request.body.test_run_id;
            const content: string = request.body.content;
            const type: string = request.body.type;
            console.log('post /description', session_id, test_run_id, content, type);
            Storage.addDescription(session_id, test_run_id, content, type);
        });
    });

    app.post("/attachment", upload.single('attachment'), async (request, response) => {
        await returnJson(response, () => {
            const session_id: string = request.body.session_id;
            const test_run_id = request.body.test_run_id;
            const title: string = request.body.title;

            const path = p.resolve(Configuration.cacheDir, request.file.filename);
            const mime = request.file.mimetype;
            const filesize = request.file.size;
            const fileId = request.file.filename;

            console.log('post /attachment', session_id, test_run_id, title, request.file);
            Storage.addAttachment(session_id, test_run_id, title, path, mime, filesize, fileId);
        });
    });

    app.post("/label", async (request, response) => {
        await returnJson(response, () => {
            const session_id: string = request.body.session_id;
            const test_run_id = request.body.test_run_id;
            const name: string = request.body.name;
            const value: string = request.body.value;
            console.log('post /label', session_id, test_run_id, name, value);
            Storage.addLabel(session_id, test_run_id, name, value);
        });
    });

    app.post("/parameter", async (request, response) => {
        await returnJson(response, () => {
            const session_id: string = request.body.session_id;
            const test_run_id = request.body.test_run_id;
            const kind: string = request.body.kind;
            const name: string = request.body.name;
            const value: string = request.body.value;
            console.log('post /parameter', session_id, test_run_id, kind, name, value);
            Storage.addParameter(session_id, test_run_id, kind, name, value);
        });
    });

    async function returnJson(response, func: () => any) {
        const RESPONSE_SUCCESS = {status: "success"};
        response.setHeader('Content-Type', 'application/json');
        try {
            const result = await func();
            response.status(200).json(result ? result : RESPONSE_SUCCESS);
            console.log('Success');
        } catch (error) {
            response.status(500).send({
                status: 'failed',
                message: error.message ? error.message : '',
                stack: error.stack ? error.stack : ''
            });
            console.log('Error');
            return;
        }

    }

};
