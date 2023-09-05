import { remote } from 'webdriverio'
import { expect } from 'expect'

const CAPS = {
  platformName: 'mac',
  'appium:automationName': 'mac2',
  'appium:bundleId': 'com.apple.calculator',
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

function button(title) {
  return `//XCUIElementTypeButton[@title="${title}"]`
}


describe('Calculator app', function() {
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

  it('should add two numbers', async function() {
    // wait for first element to show up
    const two = await driver.$(button('2'))
    await two.waitForExist({timeout: 2000})

    // add 2 + 2
    await two.click()
    await (await driver.$(button('+'))).click()
    await (await driver.$(button('2'))).click()
    await (await driver.$(button('='))).click()

    // verify addition
    const result = await (await driver.$(`//XCUIElementTypeStaticText[@label="main display"]`)).getText()
    expect(result).toEqual('4')
  })
})
