"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid");
const _1 = require("../storage/");
const p = require("path");
const configuration_1 = require("./configuration");
const multer = require("multer");
const upload = multer({ dest: configuration_1.Configuration.cacheDir });
exports.router = function (app) {
    app.get("/newid", async (request, response) => {
        response.status(200).send(uuid.v4());
    });
    app.delete("/session", async (request, response) => {
        await returnJson(response, () => {
            const session_id = request.query.session_id;
            console.log('delete /session', session_id);
            _1.Storage.deleteSession(session_id);
        });
    });
    app.get("/popdata", async (request, response) => {
        await returnJson(response, async () => {
            const session_id = request.query.session_id;
            console.log('get /popdata', session_id);
            return await _1.Storage.popData(session_id);
        });
    });
    app.get("/data", async (request, response) => {
        await returnJson(response, async () => {
            const session_id = request.query.session_id;
            console.log('get /popdata', session_id);
            return await _1.Storage.getData(session_id);
        });
    });
    app.post("/startsuite", async (request, response) => {
        await returnJson(response, () => {
            const session_id = request.body.session_id;
            const test_run_id = request.body.test_run_id;
            const name = request.body.name;
            const timestamp = request.body.timestamp;
            console.log('post /startsuite', session_id, test_run_id, name, timestamp);
            _1.Storage.startSuite(session_id, test_run_id, name, timestamp);
        });
    });
    app.post("/endsuite", async (request, response) => {
        await returnJson(response, () => {
            const session_id = request.body.session_id;
            const test_run_id = request.body.test_run_id;
            const timestamp = request.body.timestamp;
            console.log('post /endsuite', session_id, test_run_id, timestamp);
            _1.Storage.endSuite(session_id, test_run_id, timestamp);
        });
    });
    app.post("/starttest", async (request, response) => {
        await returnJson(response, () => {
            const session_id = request.body.session_id;
            const test_run_id = request.body.test_run_id;
            const name = request.body.name;
            const timestamp = request.body.timestamp;
            console.log('post /starttest', session_id, test_run_id, name, timestamp);
            _1.Storage.startTest(session_id, test_run_id, name, timestamp);
        });
    });
    app.post("/endtest", async (request, response) => {
        await returnJson(response, () => {
            const session_id = request.body.session_id;
            const test_run_id = request.body.test_run_id;
            const status = request.body.status;
            const error = request.body.error;
            const timestamp = request.body.timestamp;
            console.log('post /endtest', session_id, test_run_id, status, error, timestamp);
            _1.Storage.endTest(session_id, test_run_id, status, error, timestamp);
        });
    });
    app.post("/startstep", async (request, response) => {
        await returnJson(response, () => {
            const session_id = request.body.session_id;
            const test_run_id = request.body.test_run_id;
            const name = request.body.name;
            const timestamp = request.body.timestamp;
            console.log('post /startstep', session_id, test_run_id, name, timestamp);
            _1.Storage.startStep(session_id, test_run_id, name, timestamp);
        });
    });
    app.post("/endstep", async (request, response) => {
        await returnJson(response, () => {
            const session_id = request.body.session_id;
            const test_run_id = request.body.test_run_id;
            const status = request.body.status;
            const timestamp = request.body.timestamp;
            console.log('post /endstep', session_id, test_run_id, status, timestamp);
            _1.Storage.endStep(session_id, test_run_id, status, timestamp);
        });
    });
    app.post("/description", async (request, response) => {
        await returnJson(response, () => {
            const session_id = request.body.session_id;
            const test_run_id = request.body.test_run_id;
            const content = request.body.content;
            const type = request.body.type;
            console.log('post /description', session_id, test_run_id, content, type);
            _1.Storage.addDescription(session_id, test_run_id, content, type);
        });
    });
    app.post("/attachment", upload.single('attachment'), async (request, response) => {
        await returnJson(response, () => {
            const session_id = request.body.session_id;
            const test_run_id = request.body.test_run_id;
            const title = request.body.title;
            const path = p.resolve(configuration_1.Configuration.cacheDir, request.file.filename);
            const mime = request.file.mimetype;
            const filesize = request.file.size;
            const fileId = request.file.filename;
            console.log('post /attachment', session_id, test_run_id, title, request.file);
            _1.Storage.addAttachment(session_id, test_run_id, title, path, mime, filesize, fileId);
        });
    });
    app.post("/label", async (request, response) => {
        await returnJson(response, () => {
            const session_id = request.body.session_id;
            const test_run_id = request.body.test_run_id;
            const name = request.body.name;
            const value = request.body.value;
            console.log('post /label', session_id, test_run_id, name, value);
            _1.Storage.addLabel(session_id, test_run_id, name, value);
        });
    });
    app.post("/parameter", async (request, response) => {
        await returnJson(response, () => {
            const session_id = request.body.session_id;
            const test_run_id = request.body.test_run_id;
            const kind = request.body.kind;
            const name = request.body.name;
            const value = request.body.value;
            console.log('post /parameter', session_id, test_run_id, kind, name, value);
            _1.Storage.addParameter(session_id, test_run_id, kind, name, value);
        });
    });
    async function returnJson(response, func) {
        const RESPONSE_SUCCESS = { status: "success" };
        response.setHeader('Content-Type', 'application/json');
        try {
            const result = await func();
            response.status(200).json(result ? result : RESPONSE_SUCCESS);
            console.log('Success');
        }
        catch (error) {
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
//# sourceMappingURL=router.js.map