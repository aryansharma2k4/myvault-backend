import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes.js"
import vaultRouter from "./routes/vault.routes.js"
import savedPasswordRouter from "./routes/savedPasswords.routes.js"

const app = express()



app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin","*")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
})

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: false
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/users", userRouter)
app.use("/api/v1/vault", vaultRouter)
app.use("/api/v1/spa",savedPasswordRouter)

export { app }


