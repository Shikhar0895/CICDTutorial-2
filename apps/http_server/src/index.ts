import { app } from "./app.js";
import { connectDB } from "./utils/connectDb.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`app is listening on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((e) => {
    console.error(
      "------------------INTERNAL SERVER ERROR-------------------",
      e
    );
  });
