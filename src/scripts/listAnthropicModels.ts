import Anthropic from "@anthropic-ai/sdk";
import { config } from "../config/env.js";

const client = new Anthropic({
    apiKey: config.anthropicApiKey,
});

for await (const modelInfo of client.models.list()) {
    console.log(modelInfo.id);
}