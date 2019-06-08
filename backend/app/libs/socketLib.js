const socketIo = require("socket.io");
const tokenLib = require("../libs/tokenLib");
const logger = require("../libs/loggerLib");

const event = require("./eventsLib");

let setServer = server => {
  let io = socketIo.listen(server);
  let myIo = io.of("/");

  myIo.on("connection", socket => {
    console.log("on connection emitting verify user.");
    socket.emit("verify-user", "");

    socket.on("set-user", authToken => {
      console.log("set user called.");
      tokenLib.verifyTokenWithoutSecret(authToken, (err, user) => {
        if (err) {
          socket.emit("auth-error", {
            status: 500,
            error: "Please provide correct authToken."
          });
        } else {
          console.log("user is verifyied setting details.");
          let currentUser = user.data;

          socket.userId = currentUser.userId;
        }
      });
    });

    event.on("Welcome", data => {
      socket.emit("Welcome", data);
    });
    event.on("Update-user", data => {
      socket.emit("notify", data);
    });

    socket.on("disconnect", () => {});
  });
};

module.exports = {
  setServer: setServer
};
