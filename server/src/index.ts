import express from "express";
import { Request, Response } from "express";
import bodyParser from "body-parser";
import User from "./models/User";
import cors from "cors";
import { validateEmail, validateNumber } from "./utils/vlidations";
import readData from "./utils/readData";

const app = express();

app.use(bodyParser.json());
app.use(cors());

let rejectPrevRequest: (() => void) | null = null;
let timeout: NodeJS.Timeout | null = null;
let jsonData: User[] = [];

readData()
  .then((data) => (jsonData = JSON.parse(data)))
  .catch((err) => {
    console.log(err);
    process.exit(-1);
  });

app.post("/search", async (req: Request<any, any, User>, res: Response) => {
  // есть предыдущий активный запрос
  if (timeout) {
    // reject промиса предыдущего запроса
    rejectPrevRequest && rejectPrevRequest();
  }

  const { email, number } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Необходимо ввести email" });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Введен некорректный email" });
  }
  if (number && !validateNumber(number)) {
    return res
      .status(400)
      .json({ message: 'Номер телефона не соответствует формату "99-99-99"' });
  }

  let foundResults: User[] = [];

  try {
    await new Promise<void>((resolve, reject) => {
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
            } else if (!number) {
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
  } catch (error) {
    res.status(409).json({ message: "Request cancelled" });
  }
});

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 5000;
app.listen(PORT, () => {
  console.log(`Application started on port ${PORT}`);
});
