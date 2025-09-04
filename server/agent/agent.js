import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatMistralAI } from "@langchain/mistralai";

const model = new ChatMistralAI({
  model: "mistral-small-latest",
});

const agent = createReactAgent({
  llm: model,
  tools: [],
});

const result = await agent.invoke({
  messages: [
    {
      role: "user",
      content: "Hello, how can you help me?",
    },
  ],
});

console.log(result?.messages.at(-1)?.content);
