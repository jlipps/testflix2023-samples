import { remote } from 'webdriverio'
import axios from 'axios'

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

async function reportTestStatus(sessionId, testName, testStatus, error) {
  const url = 'http://127.0.0.1:4723/setTestInfo'
  const reqBody = {}
  reqBody.sessionId = sessionId
  reqBody.error = error
  reqBody.testName = testName
  reqBody.testStatus = testStatus

  console.log(url)
  console.log(reqBody)

  await axios.post(url, reqBody)
}

describe('Reporter plugin', function() {
  /** @type {import('webdriverio').Browser} */
  let driver

  beforeEach(async function() {
    driver = await remote(WD_OPTS)
  })

  afterEach(async function() {
    if (driver) {
      const sessionId = driver.sessionId
      const status = this.currentTest?.isPassed() ? 'PASSED' : 'FAILED';
      const title = this.currentTest?.fullTitle()
      try {
        await reportTestStatus(sessionId, title, status);
      } finally {
        await driver.deleteSession()
      }
    }
  })

  it('should run a test and create a report', async () => {
    const loginScreen = await driver.$('~Login Screen')
    await loginScreen.click()
    const uname = await driver.$('~username')
    const pw = await driver.$('~password')
    await uname.setValue('alice')
    await pw.setValue('mypassword')
    const submit = await driver.$('~loginBtn')
    await submit.click()
  })
})
