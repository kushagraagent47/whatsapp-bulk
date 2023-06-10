const express = require("express");
const app = express();
const port = 3000;

const qrcode = require("qrcode-terminal");
const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const fs = require("fs");

const client = new Client({
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Whatsapp Aktif!");
});

client.initialize();

function checkNumber(number) {
  if (isNaN(number)) return false;
  if (number.length != 12) return false;
  return true;
}

app.get("/send", async (req, res) => {
  const number = req.query.number;
  const msg = req.query.message;

  if (!checkNumber(number))
    return res.status(400).send(`Invalid number: ${number}`);

  // const media = await MessageMedia.fromUrl('https://via.placeholder.com/350x150.png');
  try {
    // await client.sendMessage(`${number}@c.us`, media);
    await client.sendMessage(`${number}@c.us`, msg);
    console.log(`Message sent: ${number}`);
    res.send(`Message sent: ${number}`);
  } catch (e) {
    console.log(`Message not sent: ${number}`);
    res.status(500).send(`Message not sent: ${number}`);
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
