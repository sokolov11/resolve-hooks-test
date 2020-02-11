import domready from 'domready'
import { getApiForContext} from 'resolve-api'

const main = async resolveContext => {
  await new Promise(resolve => domready(resolve))
  const api = getApiForContext(resolveContext)

  const sendMessage = (userName, message) =>
    api
      .execCommand({
        aggregateName: 'Chat',
        commandType: 'postMessage',
        aggregateId: userName,
        payload: message
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.warn(`Error while sending command: ${error}`)
      })

}

export default main
