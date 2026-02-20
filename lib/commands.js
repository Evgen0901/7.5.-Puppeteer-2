module.exports = {
  clickElement: async function (page, selector) {
    try {
      console.log(`🔍 Ожидание элемента: ${selector}`)
      await page.waitForSelector(selector, { timeout: 10000, visible: true })
      console.log(`🖱️ Клик по элементу: ${selector}`)
      await page.click(selector)
      console.log(`✅ Клик выполнен`)
    } catch (error) {
      // Делаем скриншот при ошибке
      await page.screenshot({ path: `error-click-${Date.now()}.png` })
      console.error(`❌ Ошибка: ${selector} не кликабелен`)
      throw new Error(`Selector is not clickable: ${selector}`)
    }
  },
  
  getText: async function (page, selector) {
    try {
      console.log(`🔍 Поиск текста в: ${selector}`)
      await page.waitForSelector(selector, { timeout: 10000 })
      const text = await page.$eval(selector, (element) => element.textContent.trim())
      console.log(`📄 Найден текст: "${text}"`)
      return text
    } catch (error) {
      throw new Error(`Text is not available for selector: ${selector}`)
    }
  },
  
  putText: async function (page, selector, text) {
    try {
      console.log(`⌨️ Ввод текста: "${text}" в: ${selector}`)
      const inputField = await page.$(selector)
      await inputField.focus()
      await inputField.type(text)
      await page.keyboard.press("Enter")
      console.log(`✅ Текст введен`)
    } catch (error) {
      throw new Error(`Not possible to type text for selector: ${selector}`)
    }
  },
}
