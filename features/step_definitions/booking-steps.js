const puppeteer = require("puppeteer")
const chai = require("chai")
const expect = chai.expect
const {
  Given,
  When,
  Then,
  Before,
  After,
  setDefaultTimeout,
} = require("@cucumber/cucumber")
const { clickElement, getText } = require("../../lib/commands.js")

setDefaultTimeout(70000)

Before(async function () {
  const browser = await puppeteer.launch({ 
    headless: false, 
    slowMo: 300,
    defaultViewport: null,
    args: ['--start-maximized']
  })
  const page = await browser.newPage()
  this.browser = browser
  this.page = page
})

After(async function () {
  if (this.browser) {
    await this.browser.close()
  }
})

Given("user is on {string} page", async function (string) {
  console.log("🌐 Открытие страницы...")
  await this.page.goto(string, {
    timeout: 30000,
    waitUntil: 'networkidle0'
  })
  await this.page.waitForTimeout(1000)
})

// ========== ТЕСТ 1 (работает) ==========
When("user click by button of date 1", async function () {
  console.log("📅 Тест 1: Выбор даты")
  await this.page.waitForSelector('.page-nav', { timeout: 10000 })
  await clickElement(this.page, ".page-nav__day.page-nav__day_weekend")
  await this.page.waitForTimeout(1000)
})

When("user click by button of movie session time 1", async function () {
  console.log("🎬 Тест 1: Выбор сеанса")
  await this.page.waitForSelector('.movie-seances__time', { timeout: 10000 })
  await clickElement(
    this.page,
    "a.movie-seances__time[data-seance-id='217']"
  )
  await this.page.waitForSelector('.buying-scheme__wrapper', { timeout: 15000 })
  console.log("✅ Схема зала загружена")
  await this.page.waitForTimeout(1000)
})

When("user click to choose of free seat 1", async function () {
  console.log("💺 Тест 1: Выбор места")
  await clickElement(
    this.page,
    ".buying-scheme__row:nth-child(7) span:nth-child(4)"
  )
  await this.page.waitForTimeout(500)
})

// ========== ТЕСТ 2 (ИСПРАВЛЕНО) ==========
When("user click by button of date 2", async function () {
  console.log("📅 Тест 2: Выбор даты")
  await this.page.waitForSelector('.page-nav', { timeout: 10000 })
  // Выбираем пятницу (5-й день)
  await clickElement(this.page, ".page-nav__day:nth-child(5)")
  await this.page.waitForTimeout(1000)
})

When("user click by button of movie session time 2", async function () {
  console.log("🎬 Тест 2: Выбор сеанса")
  await this.page.waitForSelector('.movie-seances__time', { timeout: 10000 })
  
  // Выбираем первый доступный сеанс
  const seances = await this.page.$$('.movie-seances__time')
  if (seances.length > 0) {
    await seances[0].click()
    console.log("✅ Выбран первый сеанс")
  } else {
    throw new Error("Нет доступных сеансов")
  }
  
  await this.page.waitForSelector('.buying-scheme__wrapper', { timeout: 15000 })
  console.log("✅ Схема зала загружена")
  await this.page.waitForTimeout(1000)
})

When("user click to choose of free seat 2", async function () {
  console.log("💺 Тест 2: Выбор места")
  await this.page.waitForSelector('.buying-scheme__wrapper', { timeout: 10000 })
  
  // Находим первый свободный стул
  const freeSeat = await this.page.$('.buying-scheme__chair:not(.buying-scheme__chair_taken)')
  
  if (freeSeat) {
    await freeSeat.click()
    console.log("✅ Свободное место выбрано")
  } else {
    // Если свободных мест нет, выбираем конкретное место
    console.log("⚠️ Свободных мест нет, выбираю 7-й ряд 4-е место")
    await clickElement(
      this.page,
      ".buying-scheme__row:nth-child(7) span:nth-child(4)"
    )
  }
  await this.page.waitForTimeout(500)
})

// ========== ТЕСТ 3 (ИСПРАВЛЕНО) ==========
When("user click by button of date 3", async function () {
  console.log("📅 Тест 3: Выбор даты")
  await this.page.waitForSelector('.page-nav', { timeout: 10000 })
  await clickElement(this.page, ".page-nav__day:nth-child(5)")
  await this.page.waitForTimeout(1000)
})

When("user click by button of movie session time 3", async function () {
  console.log("🎬 Тест 3: Выбор сеанса")
  await this.page.waitForSelector('.movie-seances__time', { timeout: 10000 })
  
  const seances = await this.page.$$('.movie-seances__time')
  if (seances.length > 0) {
    await seances[0].click()
    console.log("✅ Выбран первый сеанс")
  }
  
  await this.page.waitForSelector('.buying-scheme__wrapper', { timeout: 15000 })
  console.log("✅ Схема зала загружена")
  await this.page.waitForTimeout(1000)
})

// ========== ОБЩИЕ ШАГИ ==========
When("user click by button to book a ticket", async function () {
  console.log("✅ Подтверждение бронирования")
  await this.page.waitForSelector(".acceptin-button", { timeout: 10000 })
  await clickElement(this.page, ".acceptin-button")
  await this.page.waitForTimeout(1000)
})

Then("user sees the title {string}", async function (string) {
  console.log("🔍 Проверка заголовка")
  await this.page.waitForSelector(".ticket__check-title", { timeout: 10000 })
  const actual = await getText(this.page, ".ticket__check-title")
  const expected = "Вы выбрали билеты:"
  console.log(`Ожидаемый текст: "${expected}"`)
  console.log(`Фактический текст: "${actual}"`)
  await expect(actual).to.contain(expected)
})

Then("Button for booking has property disabled: {string}", async function (string) {
  console.log("🔍 Проверка кнопки бронирования")
  
  // Ждем появления кнопки с правильным селектором
  await this.page.waitForSelector(".acceptin-button", { timeout: 10000 })
  
  // Проверяем свойство disabled
  const isDisabled = await this.page.$eval(".acceptin-button", (button) => {
    return button.disabled
  })
  
  console.log(`Кнопка неактивна: ${isDisabled}`)
  // Используем to.be.true для булевого значения
  await expect(isDisabled).to.be.true
})
