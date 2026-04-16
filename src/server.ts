import "dotenv/config";

import { app } from "./app";
import { getJwtSecretOrThrow } from "./utils/auth";

const port = Number(process.env.PORT) || 3000;

getJwtSecretOrThrow();

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Numora API listening on http://localhost:${port}`);
  });
}
