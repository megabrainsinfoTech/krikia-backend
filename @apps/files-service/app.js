import express from "express";
import routes from "./routes/index.js";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import LocationRouter from "./routes/location.js";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

// Middlewares
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(helmet());
// app.options(cors());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// Serve static files from the "public" folder
app.use("/kpublic", express.static(path.join(__dirname, "public")));

var whitelist = [
  /.*krikia\.com$/,
  /https?:\/\/.*\.?krikia\.com(:[0-9]+)?$/,
  /^http(s)?:\/\/(.+\.)?(krikia\.com|krikia\.org).*$/,
];

if (process.env.NODE_ENV === "development") {
  // Development Localhost
  whitelist.push(`http://localhost:3050`);
  whitelist.push(`http://localhost:3001`);
  whitelist.push(`http://localhost:3040`);
  whitelist.push(`http://localhost:8001`);

}

// Define the CORS options delegate
const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (whitelist.some((origin) => origin == req.header("Origin"))) {
    corsOptions = {
      origin: true,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: [
        "Accept",
        "Authorization",
        "Cache-Control",
        "Content-Type",
        "DNT",
        "If-Modified-Since",
        "Keep-Alive",
        "Origin",
        "User-Agent",
        "X-Requested-With",
      ],
    }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false, methods: ["GET"] }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

app.use(cors(corsOptionsDelegate), LocationRouter);
app.use(cors(corsOptionsDelegate), routes);

app.get("/", (req, res) => {
  res.status(200).json({
    data: "You think the url is correct? Sorry! you are wrong!",
    msg: process.env.BETA
      ? "Running From the Beta Server"
      : "check the url again",
  });
});

app.listen(process.env.PORT, () =>
  console.log(`File server started on port ${process.env.PORT}`)
);
