import express from "express";
import swaggerUi from "swagger-ui-express";
import swagerDoc from "./swagger.json";

import { router } from "./src/routes/index";

const app = express();

app.use(express.json());
app.use(router);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swagerDoc));

export default app;
