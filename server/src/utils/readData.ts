import fs from "fs/promises";
import path from "path";

export default function () {
  return fs.readFile(path.resolve("data.json"), {
    encoding: "utf8",
  });
}
