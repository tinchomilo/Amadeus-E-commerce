const server = require("./src/app.js");
const connectionDB = require("./src/config/db.js");
const express = require("express");

// Conexión a DB
connectionDB();

server.set("port", process.env.PORT || 3001);

// Corriendo el servidor
server.listen(server.get("port"), () => {
  console.log(`Server running on port ${server.get("port")}`); // eslint-disable-line no-console
});
