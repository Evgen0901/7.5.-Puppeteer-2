const { clickElement, getText } = require("./lib/commands.js")
//const { generateName } = require("./lib/util.js");

let page

beforeEach(async () => {
  page = await browser.newPage()
  await page.setDefaultTimeout(10000)
  await page.goto("https://qamid.tmweb.ru/client/index.php")
})

afterEach(() => {
  page.close()
})

describe("Booking tickets", () => {
  test("The first test. Happy path", async () => {
    await clickElement(page, ".page-nav__day.page-nav__day_weekend")
    await clickElement(
      page,
      "body main a.movie-seances__time[href='#'][data-seance-id='217']"
    )
    await clickElement(
      page,
      "body main div[class='buying-scheme__wrapper'] div:nth-child(7) span:nth-child(4)"
    )
    await clickElement(page, "button.acceptin-button")
    await page.waitForSelector("body main h2")
    const eexpected = "Вы выбрали билеты:"
    const actual = await getText(page, ".ticket__check-title")
    await expect(actual).toContain(eexpected)
  })

  test("The second test. Happy path", async () => {
    await clickElement(page, ".page-nav__day.page-nav__day_chosen")
    await clickElement(
      page,
      "body main a.movie-seances__time[href='#'][data-seance-id='223']"
    )
    await clickElement(
      page,
      "body main div[class='buying-scheme__wrapper'] div:nth-child(1) span:nth-child(7)"
    )
    await clickElement(page, "button.acceptin-button")
    await page.waitForSelector("body main h2")
    const eexpected = "Вы выбрали билеты:"
    const actual = await getText(page, ".ticket__check-title")
    await expect(actual).toContain(eexpected)
  })

  test("Negative test without a place", async () => {
    const seatSelector =
      "body main div[class='buying-scheme__wrapper'] div:nth-child(1) span:nth-child(7)"
    await clickElement(page, ".page-nav__day.page-nav__day_chosen")
    await clickElement(
      page,
      "body main a.movie-seances__time[href='#'][data-seance-id='223']"
    )
    await clickElement(page, seatSelector)
    await clickElement(page, "button.acceptin-button")
    await page.waitForSelector("body main h2")

    await page.goto("http://qamid.tmweb.ru/client/index.php")
    await clickElement(page, ".page-nav__day.page-nav__day_chosen")
    await clickElement(
      page,
      "body main a.movie-seances__time[href='#'][data-seance-id='223']"
    )

    await expect(
      String(
        await page.$eval("button", (button) => {
          return button.disabled
        })
      )
    ).toContain("true")
  })
})


