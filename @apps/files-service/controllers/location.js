import NIGERIA_DATA from "../mockData/nigeriaJson.js";
import axios from "axios";

const DATABASE = {
  NG: NIGERIA_DATA,
};
// get Current Country
export const getCountry = async (req, res) => {
  let data = await axios.get("https://ipapi.co/json/");

  const d = await data.json();

  if (!d) {
    return res.status(200).json({
      message: "Sorry! we can't get your current Country",
    });
  }
  const { country, country_name, latitude, currency, longitude, timezone } = d;
  res.status(200).json({
    country_name,
    country,
    currency,
    coordinates: [latitude, longitude],
    timezone,
  });
};

// get getAvailableCountry
export const getAvailableCountry = async (req, res) => {
  const available__Country = [
    {
      country_name: "Nigeria",
      country: "NG",
    },
  ];
  res.status(200).json(available__Country);
};

// get a Current States
export const getCountryStates = async (req, res) => {
  const { country } = req.params;
  const data = DATABASE[country.toUpperCase()];
  const { fields } = req.query;
  const col = fields ? fields.split(",") : [];

  if (!data) {
    return res.status(404).json({ message: "Country Data Doesn't Exist" });
  }
  
  const mapData = data.map((state) => {
    return {
      name: state.name,
      id: state.id,
      coordinates: col.includes("coordinate")
        ? state.coordinates
        : undefined,
      area: col.includes("area") ? state.area : undefined,
    };
  });
  res.status(200).json(mapData);
};

export const getCountryLocal = async (req, res) => {
  const { state, country } = req.params;
  const data = DATABASE[country.toUpperCase()];
  const id = state.toUpperCase();

  if (!data) {
    return res.status(404).json({ message: "Country Data Doesn't Exist" });
  }
  
  const mapData = data
    .find(({ name }) => name.toUpperCase() === id)
    ?.locals || []

  res.status(200).json(mapData);
  
};
