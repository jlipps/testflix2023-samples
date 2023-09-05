import { remote } from 'webdriverio'

const TEST_APP_IOS = '/Users/jlipps/Code/testapps/TheApp.app.zip'
const TEST_APP_ANDROID = '/Users/jlipps/Code/testapps/TheApp.apk'

const CAPS_IOS = {
  platformName: 'iOS',
  'appium:automationName': 'XCUITest',
  'appium:app': TEST_APP_IOS,
}

const CAPS_ANDROID = {
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:app': TEST_APP_ANDROID,
}

/** @type {import('webdriverio').RemoteOptions} */
const WD_OPTS = {
  hostname: '127.0.0.1',
  port: 4723,
  path: '/',
  capabilities: CAPS_IOS,
  logLevel: 'error',
  connectionRetryCount: 0,
}

const WD_OPTS_ANDROID = {
  ...WD_OPTS,
  capabilities: CAPS_ANDROID,
}

const loginScreenLocator = '//*[@axId="Login Screen"]'

for (const [name, opts] of [['iOS', WD_OPTS], ['Android', WD_OPTS_ANDROID]]) {
  describe(`Universal XML plugin - ${name}`, function() {
    /** @type {import('webdriverio').Browser} */
    let driver

    before(async function() {
      driver = await remote(opts)
    })

    after(async function() {
      if (driver) {
        await driver.deleteSession()
      }
    })

    it('should find an element on ios via universal xml', async function() {
      const el = await driver.$(loginScreenLocator)
      await el.click()
    })
  })
}
