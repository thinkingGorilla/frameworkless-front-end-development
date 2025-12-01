const cloneDeep = x => {
  return JSON.parse(JSON.stringify(x))
}

const freeze = state => Object.freeze(cloneDeep(state))

export default (model, stateGetter) => {
  let listeners = []

  const addChangeListener = cb => {
    listeners.push(cb)
    cb(freeze(stateGetter()))
    return () => {
      listeners = listeners
        .filter(element => element !== cb)
    }
  }

  const invokeListeners = () => {
    const data = freeze(stateGetter())
    listeners.forEach(l => l(data))
  }

  const wrapAction = originalAction => {
    return (...args) => {
      const value = originalAction(...args)
      invokeListeners()
      return value
    }
  }

  const baseProxy = {
    addChangeListener
  }

  // model에 대한 프록시 객체 생성
  return Object
    .keys(model)
    // 객체에서 함수를 찾는다
    .filter(key => {
      return typeof model[key] === 'function'
    })
    // 모델의 함수를 wrapAction으로 감싼 함수를 하나씩 프록시 객체에 넣어 모델과 동일한 인터페이스를 갖도록 한다.
    .reduce((proxy, key) => {
      const action = model[key]
      return {
        ...proxy,
        [key]: wrapAction(action)
      }
    }, baseProxy)
}
