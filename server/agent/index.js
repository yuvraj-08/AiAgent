import express from "express";
import cors from "cors";
import { agent } from "./agent.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/generate", async (req, res) => {
  const { prompt, thread_id } = req.body;
  console.log({ prompt, thread_id });
  const result = await agent.invoke(
    {
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    },
    {
      configurable: {
        thread_id,
      },
    }
  );

  res.json(result.messages.at(-1)?.content);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
