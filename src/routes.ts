import express from "express";
import ClassesController from "@controllers/ClassesController";
import Connectionsontroller from "@controllers/ConnectionsController";

const routes = express.Router();
const classesControllers = new ClassesController();
const connectionsControllers = new Connectionsontroller();

routes.get("/classes", classesControllers.index);
routes.post("/classes", classesControllers.store);

routes.get("/connections", connectionsControllers.index);
routes.post("/connections", connectionsControllers.store);




export default routes;