const app = require("../App/App");

const server = require("http").createServer();
const port = process.env.PORT || 2004;

app.listen(port, () => {
  console.log(`REST at http://localhost:${port}`);
});
