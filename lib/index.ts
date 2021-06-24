import express from "express";
import { ProjectDataBase } from "./interfaces";
import cors from "cors";
import { nanoid } from "nanoid";
import { MongoClient } from "mongodb";
const MONGO_URI = `mongodb+srv://${process.env.MONGO_USR}:${process.env.MONGO_PASS}@cluster0.udyz3.mongodb.net/pdb?retryWrites=true&w=majority`;
const client = new MongoClient(MONGO_URI, {
  useUnifiedTopology: true,
});

const app = express();
const DB_NAME = "pdb";
app.use(express.json());
app.use(cors());

const main = async () => {
  try {
    await client.connect();
  } catch (e) {
    console.error(e);
  }

  app.get("/", async (req: any, res: any) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
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
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    try {
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

  app.delete("/project/:id", async (req: any, res: any) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    try {
      const result = await client
        .db(DB_NAME)
        .collection("databases")
        .deleteOne({ id: req.params.id, type: "project" });

      res.send(result.result);
    } catch (e) {
      console.error(e);
    }
  });

  app.put("/project/:id", async (req: any, res: any) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
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
      res.send(result.result);
    } catch (e) {
      res.sendStatus(500);
      console.error(e);
    }
  });

  app.post("/project", async (req: any, res: any) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
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

      res.json(result.result);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  });

  app.listen( process.env.PORT || 3000);
};

main().then(() => console.log("Listening on 3000"));
