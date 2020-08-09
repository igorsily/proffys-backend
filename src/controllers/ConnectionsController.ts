import { Request, Response } from "express";
import knex from "../database/connection";

export default class Connectionsontroller {
  async index(request: Request, response: Response) {
    const totalConnections = await knex("connections").count("* as total");

    const { total } = totalConnections[0];

    return response.status(200).json({ total });
  }

  async store(request: Request, response: Response) {
    const { user_id } = request.body;

    await knex("connections").insert({
      user_id,
    });

    return response.status(200).send();
  }
}
