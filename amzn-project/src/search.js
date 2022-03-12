const puppeteer = require("puppeteer");

let search =  async (q) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto(`https://www.amazon.com/`, { waitUntil: "networkidle0" });

  await page.type("#twotabsearchtextbox", q);

  await page.keyboard.press("Enter");
  await page.waitForNavigation({
    waitUntil: "networkidle0",
  });

  const getData = await page.evaluate(() => {
    let products = document.querySelectorAll(
      "div.s-card-container.s-overflow-hidden.aok-relative.s-include-content-margin.s-latency-cf-section.s-card-border"
    );
    let productArr = [];
    products.forEach((product) => {
      let name = product.querySelector(
        "div.a-section span.a-size-medium.a-color-base.a-text-normal"
      ).innerHTML;

      let price;
      if (product.querySelector(".a-price .a-offscreen") == null) {
        price = 0;
      } else {
        price = product.querySelector(".a-price .a-offscreen").innerText;
      }

      let review = product.querySelector(
        ".a-section  span.a-icon-alt"
      ).innerText;

      let image = product
        .querySelector(
          ".a-section .rush-component .a-section.aok-relative.s-image-fixed-height img.s-image"
        )
        .getAttribute("src");
      productArr.push({
        name,
        price: price,
        review: review.split(" ")[0],
        image,
      });
    });

    return productArr;
  });

  let table = {};

  getData.forEach((product) => {
    let realPrice;
    if (typeof product.price == "string") {
      realPrice = parseFloat(product.price.replace("$", ""));
    } else {
      realPrice = product.price;
    }
    let rating = parseFloat(product.review);

    let quotent = realPrice / rating;

    table[product.name] = quotent;
  });

  let realValues = Object.values(table).filter((val) => val !== 0);

  let chosenVal = Math.min(...realValues);

  let winnerProduct = Object.keys(table).find(
    (key) => table[key] == chosenVal
  );

  let item = getData.find((element) => element.name == winnerProduct);

  await browser.close();

  return item;
};

search("monitors").then(res => console.log(res)).catch(err => console.error(err))