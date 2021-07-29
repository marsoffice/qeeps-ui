module.exports = {
  "/": {
    secure: false,
    bypass: (req, res, proxyOptions) => {

    }
  },
  "/api/access": {
    target: "http://localhost:7001",
    secure: false
  }
};
