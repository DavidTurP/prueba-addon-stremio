const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const LINKS_URL = "https://gist.githubusercontent.com/DavidTurP/e1669bd33899df3dc949ceda9977555d/raw/d6c09e99a427095e7479a5dda803b1ba45922b83/links.json";

const manifest = {
  id: "org.custom.links",
  version: "1.0.0",
  name: "Mi Addon Personal",
  description: "Addon con mis enlaces personalizados",
  types: ["movie"],
  catalogs: [],
  resources: ["stream"]
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
