import express from "express";
import helmet from "helmet";
import { ListDataType, NotesDataType, ProjectDataBase } from "./interfaces";
import cors from "cors";
import { nanoid } from "nanoid";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const MONGO_URI = `mongodb+srv://${process.env.MONGO_USR}:${process.env.MONGO_PASS}@cluster0.udyz3.mongodb.net/pdb?retryWrites=true&w=majority`;
const client = new MongoClient(MONGO_URI, {
  useUnifiedTopology: true,
});

const app = express();
const DB_NAME = "pdb";
app.use(helmet());
app.use(express.json());
app.use(cors());

const verifyLogin = (req: any, res: any, next: any) => {
  const tokenToVerify = req.headers["auth-token"];
  if (!tokenToVerify) return res.send("Access Denied").sendStatus(401);
  try {
    if (tokenToVerify == process.env.SECRET) {
      next();
    } else {
      throw "invalid";
    }
  } catch (error) {
    res.send("Invalid Token, Access Denied").sendStatus(400);
  }
};

const main = async () => {
  try {
    await client.connect();
  } catch (e) {
    console.error(e);
  }

  app.get("/", verifyLogin, async (req: any, res: any) => {
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

  app.post("/login", async (req: any, res: any) => {
    try {
      const { passcode } = req.body;
      if (passcode == process.env.PASSCODE) {
        res.send({ token: process.env.SECRET }).sendStatus(200);
      } else {
        throw "invalid pass";
      }
    } catch {
      res.send("Invalid Passcode").sendStatus(400);
    }
  });

  app.get("/database/:id", verifyLogin, async (req: any, res: any) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    try {
      const data = await client
        .db(DB_NAME)
        .collection("databases")
        .findOne({ id: req.params.id });

      res.json(data);
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  });

  app.get("/database/public/:id", async (req: any, res: any) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    try {
      const data = await client
        .db(DB_NAME)
        .collection("databases")
        .findOne({ id: req.params.id, public: true });

      res.json(data);
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  });

  app.delete("/database/:id", verifyLogin, async (req: any, res: any) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    try {
      const result = await client
        .db(DB_NAME)
        .collection("databases")
        .deleteOne({ id: req.params.id });

      res.send(result.result);
    } catch (e) {
      console.error(e);
    }
  });

  app.put("/list/:id", verifyLogin, async (req: any, res: any) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    try {
      const { todoList, completedList } = req.body;
      const result = await client
        .db(DB_NAME)
        .collection("databases")
        .updateOne(
          { id: req.params.id },
          {
            $set: {
              body: {
                todoList: todoList,
                completedList: completedList,
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

  app.put("/notes/:id", async (req: any, res: any) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    try {
      const { notesContent } = req.body;
      const result = await client
        .db(DB_NAME)
        .collection("databases")
        .updateOne(
          { id: req.params.id },
          {
            $set: {
              content: notesContent,
            },
          }
        );
      res.send(result.result);
    } catch (e) {
      res.sendStatus(500);
      console.error(e);
    }
  });

  app.post("/list", verifyLogin, async (req: any, res: any) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    try {
      const data: ListDataType = {
        id: nanoid(8),
        name: req.body.name,
        description: req.body.desc,
        type: "list",
        body: {
          todoList: [],
          completedList: [],
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

  app.post("/notes", verifyLogin, async (req: any, res: any) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    try {
      const data: NotesDataType = {
        id: nanoid(8),
        name: req.body.name,
        description: req.body.desc,
        type: "notes",
        content: "<p>Start typing</p>",
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

  app.post("/project", verifyLogin, async (req: any, res: any) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    try {
      const data: ProjectDataBase = {
        id: nanoid(8),
        name: req.body.name,
        description: req.body.desc,
        type: "project",
        body: {
          notStarted: [],
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

  app.listen(process.env.PORT || 3000);
};

main().then(() => console.log("Listening on 3000"));
