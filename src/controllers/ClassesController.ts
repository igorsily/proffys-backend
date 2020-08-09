import { Classes } from "@models/Classes";
import { Schedule, ScheduleItem } from "@models/Schedule";
import { Users } from "@models/Users";
import { Request, Response } from "express";
import knex from "../database/connection";
import convertHourToMinutes from "../utils/convertHourToMinute";

export default class ClassesController {
  async index(request: Request, response: Response) {
    const filters = request.query;

    const week_day = filters.week_day as string;
    const subject = filters.subject as string;
    const time = filters.time as string;

    if (!filters.week_day && !filters.subject && !filters.time) {
      const classes = await knex("classes")
        .join("users", "classes.user_id", "=", "users.id")
        .select(["classes.*", "users.*"]);

      return response.status(200).json(classes);
    }

    const timeInMinutes = convertHourToMinutes(time);

    const classes = await knex("classes")
      .whereExists(function () {
        this.select("class_schedule.*")
          .from("class_schedule")
          .whereRaw("`class_schedule`.`class_id` = `classes`.`id`")
          .whereRaw("`class_schedule`.`week_day` = ??", [Number(week_day)])
          .whereRaw("`class_schedule`.`from` <= ??", [timeInMinutes])
          .whereRaw("`class_schedule`.`to` > ??", [timeInMinutes]);
      })
      .where("classes.subject", "=", subject)
      .join("users", "classes.user_id", "=", "users.id")
      .select(["classes.*", "users.*"]);

    return response.status(200).json(classes);
  }

  async store(request: Request, response: Response) {
    const {
      name,
      avatar,
      whatsapp,
      bio,
      subject,
      cost,
      schedule,
    } = request.body;

    const trx = await knex.transaction();

    try {
      const user: Users = {
        name,
        avatar,
        whatsapp,
        bio,
      };

      const insertedUsersIds = await trx("users").insert(user).returning("id");

      const user_id = insertedUsersIds[0];

      const classes: Classes = {
        subject,
        cost,
        user_id,
      };

      const insertedClassesIds = await trx("classes")
        .insert(classes)
        .returning("id");

      const class_id = insertedClassesIds[0];

      const classSchedule: Schedule[] = schedule.map(
        (scheduleItem: ScheduleItem) => {
          return {
            week_day: scheduleItem.week_day,
            from: convertHourToMinutes(scheduleItem.from),
            to: convertHourToMinutes(scheduleItem.to),
            class_id,
          };
        }
      );

      await trx("class_schedule").insert(classSchedule);
      await trx.commit();
      return response.status(201).send();
    } catch (error) {
      await trx.rollback();
      return response
        .status(400)
        .json({ error: "Unexpected error while creating new class" });
    }
  }
}
