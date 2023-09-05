import { remote } from 'webdriverio'
import { expect } from 'expect'
import fs from 'fs/promises'

const WALDO_IMG = 'https://r4.wallpaperflare.com/wallpaper/447/779/742/game-where-s-waldo-cartoon-waldo-wallpaper-3a1a7e6b0a5a55880d6b546f0ace83b0.jpg'

const CAPS = {
  platformName: 'iOS',
  'appium:automationName': 'XCUITest',
  browserName: 'Safari',
  'appium:safariInitialUrl': WALDO_IMG,
  'appium:settings[getMatchedImageResult]': true,
  'appium:orientation': 'LANDSCAPE',
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

describe('Images plugin', function() {
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

  it('should find the location of a boat in an image', async function() {
    const boatInPicture = await driver.$('./boat.png')

    const {x, y} = await boatInPicture.getLocation()
    const {width, height} = await boatInPicture.getSize()
    expect(x).toBeGreaterThan(500)
    expect(y).toBeGreaterThan(200)
    expect(width).toBe(93)
    expect(height).toBe(100)

    const matchImage = await boatInPicture.getAttribute('visual')
    await fs.writeFile('./boat_matched.png', Buffer.from(matchImage, 'base64'))
  })
})
