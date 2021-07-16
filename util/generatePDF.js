const puppeteer = require("puppeteer");

exports.generatePDF = async (html = "") => {
  const browser = await puppeteer.launch({args: ['--no-sandbox']});
  const page = await browser.newPage();

  await page.setContent(html);

  const pdfBuffer = await page.pdf({
      margin: {
          top: 10,
          bottom: 10,
          left: 10,
          right: 10
      },
      printBackground: true
  });

  await page.close();
  await browser.close();

  return pdfBuffer;
};
