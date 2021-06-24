import express from "express";
import { ProjectDataBase } from "./interfaces";
import { nanoid } from "nanoid";
import { MongoClient } from "mongodb";
const username = "projectclient"; //TODO remove
const pass = "5r95TiOy7b361Ikd"; //TODO remove
const MONGO_URI = `mongodb+srv://${username}:${pass}@cluster0.udyz3.mongodb.net/pdb?retryWrites=true&w=majority`;
const client = new MongoClient(MONGO_URI, {
  useUnifiedTopology: true,
});

const app = express();
app.use(express.json());
const DB_NAME = "pdb";

const main = async () => {
  try {
    await client.connect();
  } catch (e) {
    console.error(e);
  }

  app.get("/", async (req: any, res: any) => {
    try {
      const data = await client
        .db(DB_NAME)
        .collection("databases")
        .find({})
        .toArray();

      res.json(data);
    } catch {
      res.sendStatus(500);
    }
  });

  app.get("/project/:id", async (req: any, res: any) => {
    try {
      console.log(req.params);
      const data = await client
        .db(DB_NAME)
        .collection("databases")
        .findOne({ id: req.params.id, type: "project" });

      res.json(data);
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  });

  app.put("/project/:id", async (req: any, res: any) => {
    try {
      const { notStarted, completed, progress } = req.body;
      const result = await client
        .db(DB_NAME)
        .collection("databases")
        .updateOne(
          { id: req.params.id },
          {
            $set: {
              body: {
                notStarted: notStarted,
                completed: completed,
                progress: progress,
              },
            },
          }
        );
      res.send(result);
    } catch (e) {
      res.sendStatus(500);
      console.error(e);
    }
  });

  app.post("/project", async (req: any, res: any) => {
    try {
      console.log(req.body);
      const data: ProjectDataBase = {
        id: nanoid(8),
        name: req.body.name,
        description: req.body.desc,
        type: "project",
        body: {
          noStarted: [],
          progress: [],
          completed: [],
        },
      };
      const result = await client
        .db(DB_NAME)
        .collection("databases")
        .insertOne(data);

      res.json(result);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  });

  app.listen(3000 || process.env.PORT);
};

main().then(() => console.log("Listening on 3000"));
