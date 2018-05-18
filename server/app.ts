import * as express from "express";
import * as bodyParser from "body-parser";
import {router} from "./router";


const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));

router(app);
app.use((request, response) => {
    response.status(404).send({url: `${request.originalUrl} not found`})
});

const server = app.listen(port, () => console.log(`Allure Http Storage is running on port ${port}`));
