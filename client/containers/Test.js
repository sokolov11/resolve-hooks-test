import React, { useState } from 'react'

import { useSubscription } from 'resolve-react-hooks'

const viewModelName = 'myViewModel'

function Test({ aggregateId }) {
  const [eventsCount, setEventsCount] = useState(0)
  const [subscribed, setSubscribed] = useState(false)

  const handleEvent = event => {
    console.log('event', event)
    setEventsCount(prevCount => prevCount + 1)
  }

  const handleSubscribe = () => {
    console.log('subscribed')
    setSubscribed(true)
  }

  useSubscription(viewModelName, aggregateId === '*' ? '*' : [aggregateId], handleEvent, handleSubscribe)

  return (
    <React.Fragment>
      <div>{subscribed ? 'online' : 'offline'}</div>
      <div>{eventsCount}</div>
    </React.Fragment>
  )
}

export default Test
