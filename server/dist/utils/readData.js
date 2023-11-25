"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
function default_1() {
    return promises_1.default.readFile(path_1.default.resolve("data.json"), {
        encoding: "utf8",
    });
}
exports.default = default_1;
