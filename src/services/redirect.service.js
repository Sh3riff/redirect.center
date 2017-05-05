import config from '../config'
import LoggerHandler from '../handlers/logger.handler'

export default class RedirectService {

  constructor (req, res) {
    this.req = req
    this.res = res
    this.logger = LoggerHandler
    this.path = 'RedirectService'
    this.logger.info(`${this.path} constructor`)
  }

  perform (hostname) {
    const path = `${this.path} perform`
    this.logger.info(`${path} ${hostname}`)

    const options = {
      uri: false,
      https: false,
      slashs: [],
      status: 301
    }

    let r

    if (hostname.indexOf('.opts-uri') >= 0) {
      hostname = hostname.replace('.opts-uri', '')
      options.uri = true
      this.logger.info(`${path} ${hostname} without .opts-uri`)
    }

    if (hostname.indexOf('.opts-https') >= 0) {
      hostname = hostname.replace('.opts-https', '')
      options.https = true
      this.logger.info(`${path} ${hostname} without .opts-https`)
    }

    while ((r = hostname.match(/.opts-slash.(\w+)/))) {
      hostname = hostname.replace(`.opts-slash.${r[1]}`, '')
      options.slashs.push(r[1])
      this.logger.info(`${path} ${hostname} without .opts-slash.${r[1]}`)
    }

    while ((r = hostname.match(/.slash.(\w+)/))) {
      hostname = hostname.replace(`.opts-slash.${r[1]}`, '')
      options.slashs.push(r[1])
      this.logger.info(`${path} ${hostname} without .slash.${r[1]}`)
    }

    if ((r = hostname.match(/.opts-statuscode-(\d+)/))) {
      hostname = hostname.replace(`.opts-statuscode-${r[1]}`, '')
      options.status = r[1]
      this.logger.info(`${path} ${hostname} without .opts-statuscode-${r[1]}`)
    }

    hostname = hostname.replace(`.${config.fqdn}`, '')
    this.logger.info(`${path} ${hostname} final`)

    return new Promise((resolve, reject) => {
      resolve({
        protocol: ((options.https === true) ? 'https' : 'http'),
        hostname: hostname,
        path: options.slashs.join('/'),
        statusCode: options.status
      })
    })
  }
}