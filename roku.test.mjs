import { remote } from 'webdriverio'
import Bluebird from 'bluebird'

const {ROKU_USER, ROKU_PASS} = process.env

const CAPS = {
  platformName: 'Roku',
  'appium:automationName': 'Roku',
  'appium:rokuHost': '127.0.0.1',
  'appium:rokuEcpPort': 8060,
  'appium:rokuWebPort': 8080,
  'appium:rokuUser': ROKU_USER,
  'appium:rokuPass': ROKU_PASS,
  'appium:rokuHeaderHost': '192.168.21.174',
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

describe('Roku app', function() {
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

  async function activateByName(appName) {
    const apps = await driver.executeScript('roku: getApps', []);
    const appId = apps.filter((a) => a.name === appName)[0].id;
    console.log(appId)
    await driver.executeScript('roku: activateApp', [{appId}]);
    return appId;
  }

  it('should navigate the UI', async function() {
    await activateByName('YouTube');
    await Bluebird.delay(12000)
    await driver.executeScript('roku: pressKey', [{key: 'Right'}]);
    await driver.executeScript('roku: pressKey', [{key: 'Right'}]);
    await driver.executeScript('roku: pressKey', [{key: 'Select'}]);
    await Bluebird.delay(6000)
    await driver.executeScript('roku: pressKey', [{key: 'Back'}]);
  })
})
