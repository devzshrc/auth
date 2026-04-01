import { createServer } from "node:http";
import { createApplication } from "./app";

async function main() {
  try {
    const server = createServer(createApplication());
    // we have an http server and we want express to handle the routes that's why we've passed createApplication in - as it's an express instance
    const PORT: number = 8081;
    server.listen(PORT, () => {
      console.log(`Http server is running on PORT: ${PORT}`);
    });
  } catch (error) {
    console.log(`Error starting the http server`);
    throw error;
  }
}
main();
