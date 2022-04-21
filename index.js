import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import fs from "fs";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.listen(process.env.PORT || 3333);

const policy_ids = [
  {
    name: "Clay Nation Pitch",
    policy_id: "13e3f9964fe386930ec178d12a43c96a7f5841270c2146fc509a9f3e",
  },
  {
    name: "Baby Alien",
    policy_id: "15509d4cb60f066ca4c7e982d764d6ceb4324cb33776d1711da1beee",
  },
  {
    name: "Yummi Universe - Spring Naru",
    policy_id: "fe632e251fd654d795dda3d62b9301bae4ea7f1d80da6ab57322667a",
  },
];

const saveFile = (name, value) => {
  fs.writeFile(`./floors/${name}.json`, JSON.stringify(value), function (err) {
    if (err) {
      return console.log(err);
    }
  });
};

setInterval(() => {
  policy_ids.map((data) => {
    axios
      .get(`https://server.jpgstoreapis.com/collection/${data.policy_id}/floor`)
      .then((response) => {
        let lastFloor;
        const newObject = {
          name: data.name,
          floor: response.data.floor / 1000000,
        };

        fs.readFile(`./floors/${data.name}.json`, (err, newData) => {
          if (err) {
            saveFile(data.name, newObject);
            return;
          }

          lastFloor = JSON.parse(newData).floor;

          if (lastFloor === newObject.floor) {
            console.log(data.name, `Floor sem alteração! `);
          } else if (lastFloor > newObject.floor) {
            console.log(
              data.name,
              `Floor caiu ${(newObject.floor / lastFloor) * 100 - 100}%`
            );
            saveFile(data.name, newObject);
          } else if (lastFloor < newObject.floor) {
            console.log(
              data.name,
              `Floor subiu ${(newObject.floor / lastFloor) * 100 - 100}%`
            );
            saveFile(data.name, newObject);
          }
        });
      });
  });
}, 10000);

/*app.post("/", (req, res) => {
  console.log(req.body.policy_id);

  req.body.policy_id.map((policy) => {
    axios
      .get(
        `https://server.jpgstoreapis.com/collection/${policy}/transactions?page=1&count=50`
      )
      .then((response) => {
        const onlyAmount = response.data.transactions.map((res) => {
          const newObject = {
            name: res.display_name,
            price: res.amount_lovelace / 1000000,
            time: new Date(res.created_at).toLocaleString(),
          };
          return newObject;
        });
        console.log({ sucess: true, response: onlyAmount });
      });
    res.send({ sucess: true });
  });
});

 setInterval(() => {
  policy_ids.map((policy) => {
    axios
      .get(
        `https://server.jpgstoreapis.com/collection/${policy}/transactions?page=1&count=50`
      )
      .then((response) => {
        const onlyAmount = response.data.transactions.map((res) => {
          const newObject = {
            name: res.display_name,
            price: res.amount_lovelace / 1000000,
            time: new Date(res.created_at).toLocaleString(),
          };
          return newObject;
        });
        console.log({ sucess: true, response: onlyAmount });
      });
  });
}, 5000); */
