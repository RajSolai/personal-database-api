"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var nanoid_1 = require("nanoid");
var mongodb_1 = require("mongodb");
var MONGO_URI = "mongodb+srv://" + process.env.MONGO_USR + ":" + process.env.MONGO_PASS + "@cluster0.udyz3.mongodb.net/pdb?retryWrites=true&w=majority";
var client = new mongodb_1.MongoClient(MONGO_URI, {
    useUnifiedTopology: true,
});
var app = express_1.default();
var DB_NAME = "pdb";
app.use(express_1.default.json());
app.use(cors_1.default());
var verifyLogin = function (req, res, next) {
    var tokenToVerify = req.headers["auth-token"];
    if (!tokenToVerify)
        return res.send("Access Denied").sendStatus(401);
    try {
        if (tokenToVerify == process.env.SECRET) {
            next();
        }
        else {
            throw "invalid";
        }
    }
    catch (error) {
        res.send("Invalid Token, Access Denied").sendStatus(400);
    }
};
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, client.connect()];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                e_1 = _a.sent();
                console.error(e_1);
                return [3 /*break*/, 3];
            case 3:
                app.get("/", verifyLogin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    var data, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                res.header("Access-Control-Allow-Origin", "*");
                                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                                _b.label = 1;
                            case 1:
                                _b.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, client
                                        .db(DB_NAME)
                                        .collection("databases")
                                        .find({})
                                        .toArray()];
                            case 2:
                                data = _b.sent();
                                res.json(data);
                                return [3 /*break*/, 4];
                            case 3:
                                _a = _b.sent();
                                res.sendStatus(500);
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                app.post("/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    var passcode;
                    return __generator(this, function (_a) {
                        try {
                            passcode = req.body.passcode;
                            if (passcode == process.env.PASSCODE) {
                                res.send({ token: process.env.SECRET }).sendStatus(200);
                            }
                            else {
                                throw "invalid pass";
                            }
                        }
                        catch (_b) {
                            res.send("Invalid Passcode").sendStatus(400);
                        }
                        return [2 /*return*/];
                    });
                }); });
                app.get("/database/:id", verifyLogin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    var data, e_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                res.header("Access-Control-Allow-Origin", "*");
                                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, client
                                        .db(DB_NAME)
                                        .collection("databases")
                                        .findOne({ id: req.params.id })];
                            case 2:
                                data = _a.sent();
                                res.json(data);
                                return [3 /*break*/, 4];
                            case 3:
                                e_2 = _a.sent();
                                console.error(e_2);
                                res.sendStatus(500);
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                app.delete("/database/:id", verifyLogin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    var result, e_3;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                res.header("Access-Control-Allow-Origin", "*");
                                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, client
                                        .db(DB_NAME)
                                        .collection("databases")
                                        .deleteOne({ id: req.params.id })];
                            case 2:
                                result = _a.sent();
                                res.send(result.result);
                                return [3 /*break*/, 4];
                            case 3:
                                e_3 = _a.sent();
                                console.error(e_3);
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                app.put("/list/:id", verifyLogin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, todoList, completedList, result, e_4;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                res.header("Access-Control-Allow-Origin", "*");
                                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                                _b.label = 1;
                            case 1:
                                _b.trys.push([1, 3, , 4]);
                                _a = req.body, todoList = _a.todoList, completedList = _a.completedList;
                                return [4 /*yield*/, client
                                        .db(DB_NAME)
                                        .collection("databases")
                                        .updateOne({ id: req.params.id }, {
                                        $set: {
                                            body: {
                                                todoList: todoList,
                                                completedList: completedList,
                                            },
                                        },
                                    })];
                            case 2:
                                result = _b.sent();
                                res.send(result.result);
                                return [3 /*break*/, 4];
                            case 3:
                                e_4 = _b.sent();
                                res.sendStatus(500);
                                console.error(e_4);
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                app.put("/project/:id", verifyLogin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, notStarted, completed, progress, result, e_5;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                res.header("Access-Control-Allow-Origin", "*");
                                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                                _b.label = 1;
                            case 1:
                                _b.trys.push([1, 3, , 4]);
                                _a = req.body, notStarted = _a.notStarted, completed = _a.completed, progress = _a.progress;
                                return [4 /*yield*/, client
                                        .db(DB_NAME)
                                        .collection("databases")
                                        .updateOne({ id: req.params.id }, {
                                        $set: {
                                            body: {
                                                notStarted: notStarted,
                                                completed: completed,
                                                progress: progress,
                                            },
                                        },
                                    })];
                            case 2:
                                result = _b.sent();
                                res.send(result.result);
                                return [3 /*break*/, 4];
                            case 3:
                                e_5 = _b.sent();
                                res.sendStatus(500);
                                console.error(e_5);
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                app.post("/list", verifyLogin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    var data, result, e_6;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                res.header("Access-Control-Allow-Origin", "*");
                                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                data = {
                                    id: nanoid_1.nanoid(8),
                                    name: req.body.name,
                                    description: req.body.desc,
                                    type: "list",
                                    body: {
                                        todoList: [],
                                        completedList: [],
                                    },
                                };
                                return [4 /*yield*/, client
                                        .db(DB_NAME)
                                        .collection("databases")
                                        .insertOne(data)];
                            case 2:
                                result = _a.sent();
                                res.json(result.result);
                                return [3 /*break*/, 4];
                            case 3:
                                e_6 = _a.sent();
                                console.log(e_6);
                                res.sendStatus(500);
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                app.post("/project", verifyLogin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    var data, result, e_7;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                res.header("Access-Control-Allow-Origin", "*");
                                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                data = {
                                    id: nanoid_1.nanoid(8),
                                    name: req.body.name,
                                    description: req.body.desc,
                                    type: "project",
                                    body: {
                                        notStarted: [],
                                        progress: [],
                                        completed: [],
                                    },
                                };
                                return [4 /*yield*/, client
                                        .db(DB_NAME)
                                        .collection("databases")
                                        .insertOne(data)];
                            case 2:
                                result = _a.sent();
                                res.json(result.result);
                                return [3 /*break*/, 4];
                            case 3:
                                e_7 = _a.sent();
                                console.log(e_7);
                                res.sendStatus(500);
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                app.listen(process.env.PORT || 3000);
                return [2 /*return*/];
        }
    });
}); };
main().then(function () { return console.log("Listening on 3000"); });
