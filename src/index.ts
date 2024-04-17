import * as express from "express"
import { Request, Response } from "express"

const app = express()

app.get("/", (req: Request, res: Response) => {
  res.send("services-migrator")
})

const PORT = 3000

app.listen(PORT, () => console.log(`🌐 Server is running on port ${PORT}`))
