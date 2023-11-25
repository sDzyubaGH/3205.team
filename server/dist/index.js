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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const vlidations_1 = require("./utils/vlidations");
const readData_1 = __importDefault(require("./utils/readData"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
let rejectPrevRequest = null;
let timeout = null;
let jsonData = [];
(0, readData_1.default)()
    .then((data) => (jsonData = JSON.parse(data)))
    .catch((err) => {
    console.log(err);
    process.exit(-1);
});
app.post("/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, number } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }
    if (!(0, vlidations_1.validateEmail)(email) || (number && !(0, vlidations_1.validateNumber)(number))) {
        return res.status(400).json({ message: "Email is required" });
    }
    // есть предыдущий активный запрос
    if (timeout) {
        // reject промиса предыдущего запроса
        rejectPrevRequest && rejectPrevRequest();
    }
    let foundResults = [];
    try {
        yield new Promise((resolve, reject) => {
            // функция reject промиса, если был отправлен повторный запрос
            rejectPrevRequest = () => {
                timeout && clearTimeout(timeout);
                reject("Request cancelled");
            };
            timeout = setTimeout(() => {
                const results = jsonData.filter((item) => {
                    if (email && item.email.toLowerCase().includes(email.toLowerCase())) {
                        if (number && item.number === number.replace(/-/g, "")) {
                            return true;
                        }
                        else if (!number) {
                            return true;
                        }
                    }
                    return false;
                });
                foundResults = results;
                resolve();
            }, 5000);
        });
        timeout = null;
        res.json(foundResults);
    }
    catch (error) {
        res.status(409).json({ message: "Request cancelled" });
    }
}));
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;
app.listen(PORT, () => {
    console.log(`Application started on port ${PORT}`);
});
