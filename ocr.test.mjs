import { remote } from 'webdriverio'

const TEST_APP = '/Users/jlipps/Code/testapps/TheApp.app.zip'

const CAPS = {
  platformName: 'iOS',
  'appium:automationName': 'XCUITest',
  'appium:app': TEST_APP,
}

/** @type {import('webdriverio').RemoteOptions} */
const WD_OPTS = {
  hostname: '127.0.0.1',
  port: 4723,
  path: '/',
  capabilities: CAPS,
  logLevel: 'error',
  connectionRetryCount: 0,
}

describe('OCR plugin', function() {
  /** @type {import('webdriverio').Browser} */
  let driver

  before(async function() {
    driver = await remote(WD_OPTS)
  })

  after(async function() {
    if (driver) {
      await driver.deleteSession()
    }
  })

  it('should find the location of text on the screen as an element', async function() {
    await driver.switchContext('OCR')
    const el = await driver.$('//lines/item[contains(text(), "Login Screen")]')
    await el.click()
    await driver.switchContext('NATIVE_APP')
    const username = await driver.$('~username')
    await username.waitForExist({ timeout: 2000 })
  })
})
