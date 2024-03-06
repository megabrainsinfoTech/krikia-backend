import { CorsRequest } from "cors";

export default function (req: any, callback: any) {
  var whitelist = [
    /https?:\/\/.*\.?krikia\.com(:[0-9]+)?$/,
    "krikia.com",
    /^http(s)?:\/\/(.+\.)?(krikia\.com|krikia\.org).*$/,
  ];

  if (process.env.NODE_ENV === "development") {
    // Development localhost
    whitelist.push("http://localhost:8000");
    whitelist.push("http://localhost:3040");
  }

  var corsOptions;
  if (whitelist.indexOf(req.headers("Origin")) !== -1) {
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
}
