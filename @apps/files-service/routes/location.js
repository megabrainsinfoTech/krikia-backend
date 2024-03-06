import { Router } from "express";
import {
  getCountry,
  getAvailableCountry,
  getCountryStates,
  getCountryLocal,
} from "../controllers/location.js";
const LocationRouter = Router();

LocationRouter.get("/", getCountry);

// location/available --[Nigeria,Ghana]

LocationRouter.get("/available", getAvailableCountry);

// location/ng
LocationRouter.get("/:country/states", getCountryStates);

// location/ng/states/locals
LocationRouter.get("/:country/states/:state/locals", getCountryLocal);

export default LocationRouter;
