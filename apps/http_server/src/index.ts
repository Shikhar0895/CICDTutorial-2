import { app } from "./app";
import { connectDB } from "./utils/connectDb";

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
