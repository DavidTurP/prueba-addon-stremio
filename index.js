const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const LINKS_URL = "https://gist.githubusercontent.com/DavidTurP/e1669bd33899df3dc949ceda9977555d/raw/154a9e233717b7b570dd24a00ed81cb4379b37c4/links.json";

const manifest = {
  id: "org.custom.links",
  version: "1.0.0",
  name: "JD Addon",
  description: "Addon exclusivamente para peliculas y series en castellano. Actualizaciones automaticas. ©JD Entreniment",
  logo: "https://imgur.com/Zq15YMK.png",
  types: ["peliculas", "series"],
  catalogs: [],
  resources: ["stream"],
  background: "https://imgur.com/vw0C2QE.png"
};

const builder = new addonBuilder(manifest);

builder.defineStreamHandler(async ({ id }) => {
  try {
    const res = await fetch(LINKS_URL);
    const data = await res.json();

    if (!data[id]) return { streams: [] };

    return {
      streams: data[id].map(link => ({
        title: link.title,
        url: link.url,
        quality: link.quality || "HD"
      }))
    };
  } catch {
    return { streams: [] };
  }
});

// ⭐️ SERVIDOR PARA RENDER ⭐️
const ADDON = builder.getInterface();
const PORT = process.env.PORT || 3000;

serveHTTP(ADDON, { port: PORT });
console.log("Addon funcionando en puerto", PORT);
