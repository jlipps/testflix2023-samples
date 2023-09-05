import { remote } from 'webdriverio'
import { expect } from 'expect'

const TEST_APP = '/Users/jlipps/Code/testapps/UnityWorkshop.apk'

const CAPS = {
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:app': TEST_APP,
  'appium:altUnityHost': '127.0.0.1',
  'appium:altUnityPort': 13000,
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

const PLAYER_ID = 'SuperPlayer'

describe('Unity plugin', function() {
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

  async function find(strategy, selector) {
      const el = await driver.findElement(strategy, selector)
      if (el.error) {
          throw new Error(`Element could not be found with strategy '${strategy}' and selector '${selector}'`)
      }
      return driver.$(el)
  }

  const pressRight = {
      type: 'key',
      id: 'keyboard',
      actions: [
          {type: 'keyDown', value: 'RightArrow'},
          {type: 'pause', duration: 750},
          {type: 'keyUp', value: 'RightArrow'},
      ]
  }

  it('should be able to move the player right', async () => {
    await driver.switchContext('UNITY')
    let player = await find('id', PLAYER_ID)
    const initX = parseInt(await player.getAttribute('worldX'), 10)

    await driver.performActions([pressRight])

    player = await find('id', PLAYER_ID)
    const newX = await player.getAttribute('worldX')
    expect(newX).toBeGreaterThan(initX)
  })
})
