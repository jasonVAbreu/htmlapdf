import express from "express";
import bodyParser from "body-parser";
import puppeteer from "puppeteer";

const app = express();
app.use(bodyParser.json({ limit: "10mb" }));

app.post("/pdf", async (req, res) => {
  try {
    const { html } = req.body;

    if (!html) {
      return res.status(400).send("Falta el campo 'html' en el body.");
    }

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
  format: "A4",
  printBackground: true
});



    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=reporte.pdf");
    res.send(pdf);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error generando PDF");
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});
