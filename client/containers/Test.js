import React, { useState } from 'react'

import { useSubscription } from 'resolve-react-hooks'

const viewModelName = 'myViewModel'
const aggregateId = '63adaa7d-bcf0-4d0f-bb22-3dce823c6019'

function Test() {
  const [eventsCount, setEventsCount] = useState(0)
  const [subscribed, setSubscribed] = useState(false)

  const handleEvent = event => {
    console.log('event', event)
    setEventsCount(eventsCount + 1)
  }

  const handleSubscribe = () => {
    console.log('subscribed')
    setSubscribed(true)
  }

  useSubscription(viewModelName, [aggregateId], {}, handleEvent, handleSubscribe)

  return (
    <React.Fragment>
      <div>{subscribed ? 'online' : 'offline'}</div>
      <div>{eventsCount}</div>
    </React.Fragment>
  )
}

export default Test
