const app = require("./app");
const settings = require("./src/settings");

app.listen(settings.PORT, () => {
    console.log(`Server started on http://localhost:${settings.PORT}/`);
});