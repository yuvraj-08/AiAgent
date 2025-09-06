import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatMistralAI } from "@langchain/mistralai";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { MemorySaver } from "@langchain/langgraph"; // memory

// creating a tool which will be consumed by agent.
// tool gives additional power to agents
// !tool's 1st param -> a function
// !tool's 2nd param -> configuration
const weatherTool = tool(
  async ({ query }) => {
    console.log("query", query);

    // TODO: Implement the weather tool by fetching an API

    return "The weather in punjab is floody";
  },
  {
    name: "weather", // name of the tool
    description: "Get the weather in a given location", // tells agent when to use this tool
    // schema to tell agent how to call this tool
    schema: z.object({
      query: z.string().describe("The query to use in search"),
    }),
  }
);

// autopicks the API key from the .env file
const model = new ChatMistralAI({
  model: "mistral-small-latest", // mistral free version model, auto points to latest version
});

// create memory saver instance
const checkpointSaver = new MemorySaver();

// creats agent which is later used to make requests.
const agent = createReactAgent({
  llm: model,
  tools: [weatherTool],
  checkpointSaver, // pass memory instance to agent
});

// invoke makes a call to the llm model
const result = await agent.invoke(
  {
    messages: [
      {
        role: "user",
        content: "Whats the weather in punjab",
      },
    ],
  },
  {
    configurable: {
      thread_id: 42, // tells the agent to store the messages in threa_id 42 for further reference.
    },
  }
);

const followUp = await agent.invoke(
  {
    messages: [
      {
        role: "user",
        content: "Whats city is that for?",
      },
    ],
  },
  {
    configurable: {
      thread_id: 42, // passing same thread to make reference to the previous chat
    },
  }
);

// logs out the result received from the agent.
console.log(result?.messages.at(-1)?.content);
console.log(followUp?.messages.at(-1)?.content);
