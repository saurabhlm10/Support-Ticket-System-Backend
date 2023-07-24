import dotenv from "dotenv";

import app from "./app";

dotenv.config();

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server is running on PORT ${process.env.PORT || 4000}`);
});
