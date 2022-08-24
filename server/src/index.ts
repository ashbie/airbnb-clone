import express from "express";
const app = express();
const port = 3000;

const one: number = 1;
const two: number = 2;


app.get("/", (req, res) => res.send(`1 + 2 = ${one + two}`));

app.listen(port, function () {
    console.log(`[app]: http://localhost:${port}`);
});