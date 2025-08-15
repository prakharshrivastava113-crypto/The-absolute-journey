import express, { Request, Response } from "express";
import cors from "cors";
import { processData } from "./fetchData";
import NodeCache from "node-cache";
import cron from "node-cron";

const app = express();
const cache = new NodeCache({ stdTTL: 900 }); // 15 minutes TTL

app.use(
  cors({
    origin: [
      "https://the-absolute-journey.webflow.io",
      "http://localhost",
      "https://www.theabsolutejourney.com",
    ],
  })
);

app.get("/", (req, res) => {
  const name = process.env.NAME || "World";
  res.send(`Hello ${name}!`);
});

app.get("/data", async (req: Request, res: Response) => {
  try {
    const cacheKey = "data";
    let data = cache.get(cacheKey);

    if (!data) {
      data = await processData();
      cache.set(cacheKey, data);
    }

    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

cron.schedule("*/10 * * * *", async () => {
  try {
    const data = await processData();
    cache.set("data", data);
    console.log("Cache updated");
  } catch (error) {
    console.error("Error updating cache:", error);
  }
});

const port = parseInt(process.env.PORT || "3000");
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
