const router = require("express").Router();
const { MessageMedia } = require("whatsapp-web.js");
const request = require("request");
const vuri = require("valid-url");
const fs = require("fs");

const mediadownloader = (url, path, callback) => {
  request.head(url, (err, res, body) => {
    request(url).pipe(fs.createWriteStream(path)).on("close", callback);
  });
};

router.post("/send/:phone", async (req, res) => {
  let phone = req.params.phone;
  let message = req.body.message;
  let jumlah = req.body.jumlah ? req.body.jumlah : 1;
  if (phone == undefined || message == undefined) {
    res.send({
      status: "error",
      message: "please enter valid phone and message",
    });
  } else {
    for (let index = 0; index < jumlah; index++) {
      await client.sendMessage(phone + "@c.us", message).then((response) => {});
    }
    res.send({
      status: "success",
      message: "please enter valid phone and message",
    });
  }
});

router.post("/sendimage/:phone", async (req, res) => {
  var base64regex =
    /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

  let phone = req.params.phone;
  let image = req.body.image;
  let caption = req.body.caption;

  if (phone == undefined || image == undefined) {
    res.send({
      status: "error",
      message: "please enter valid phone and base64/url of image",
    });
  } else {
    if (base64regex.test(image)) {
      let media = new MessageMedia("image/png", image);
      client
        .sendMessage(`${phone}@c.us`, media, { caption: caption || "" })
        .then((response) => {
          if (response.id.fromMe) {
            res.send({
              status: "success",
              message: `MediaMessage successfully sent to ${phone}`,
            });
          }
        });
    } else if (vuri.isWebUri(image)) {
      if (!fs.existsSync("./temp")) {
        await fs.mkdirSync("./temp");
      }

      var path = "./temp/" + image.split("/").slice(-1)[0];
      mediadownloader(image, path, () => {
        let media = MessageMedia.fromFilePath(path);

        client
          .sendMessage(`${phone}@c.us`, media, { caption: caption || "" })
          .then((response) => {
            if (response.id.fromMe) {
              res.send({
                status: "success",
                message: `MediaMessage successfully sent to ${phone}`,
              });
              fs.unlinkSync(path);
            }
          });
      });
    } else {
      res.send({
        status: "error",
        message: "Invalid URL/Base64 Encoded Media",
      });
    }
  }
});

module.exports = router;
