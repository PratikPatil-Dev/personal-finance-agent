import { runAgent } from "../agent/index.js";

const main = async () => {
    const response = await runAgent("6934414144", "Hello");
    console.log(response);
}

main();