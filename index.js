
import express from 'express';
import { invokeFFmpegCommand, s3FileDownload, s3FileUpload } from './Utils.js';
const app = express();
const port = 3001;
app.use(express.json());

let fruit_prices = [
    {name: "banana", id: 1, price: 100},
    {name: "strawberry", id: 2, price: 300},
    {name: "apple", id: 3, price: 200},
];

app.listen(port, () => {
    console.log("express: port %d opened", port);
});
app.get("/fruit/prices", (req, res) => {
    console.log("GET: access to /fruit/prices");
    res.send(fruit_prices);
});
app.get("/fruit/prices/:id", (req, res) => {
    console.log("GET: access to /fruit/prices/:id");
    var item = fruit_prices.find(price => {
        return price.id === parseInt(req.params.id);
    });
    console.log(item);
    res.send(item);
});
app.post("/fruit/prices", (req, res) => {
    console.log("POST: access to /fruit/prices");
    const item = {
        name: req.body.name,
        id: fruit_prices.length + 1,
        price: req.body.price
    }
    fruit_prices = [...fruit_prices, item];
    res.send(fruit_prices);
});

app.post("/media", (req, res) => {
    console.log("POST: access to /media");
    const item = {
        param: req.body,
    }
    s3FileDownload(req.body.key, "tmp2.mov").then((value) => {
        invokeFFmpegCommand("tmp2.mov", "tmp.mov")
        s3FileUpload(req.body.newKey, "tmp.mov");
        res.send(item);  
    }).catch((err)=>console.log(err));
});
