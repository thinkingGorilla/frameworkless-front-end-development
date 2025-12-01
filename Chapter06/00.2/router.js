const ROUTE_PARAMETER_REGEXP = /:(\w+)/g
const URL_FRAGMENT_REGEXP = '([^\\/]+)'

const extractUrlParams = (route, windowHash) => {
  const params = {}

  if (route.params.length === 0) {
    return params
  }

  const matches = windowHash
    .match(route.testRegExp)

  matches.shift()

  matches.forEach((paramValue, index) => {
    const paramName = route.params[index]
    params[paramName] = paramValue
  })

  return params
}

export default () => {
  const routes = []
  let notFound = () => {}

  const router = {}

  const checkRoutes = () => {
    const { hash } = window.location

    const currentRoute = routes.find(route => {
      const { testRegExp } = route
      return testRegExp.test(hash)
    })

    if (!currentRoute) {
      notFound()
      return
    }

    const urlParams = extractUrlParams(
      currentRoute,
      window.location.hash
    )

    currentRoute.component(urlParams)
  }

  router.addRoute = (fragment, component) => {
    const params = []

    // `:parameterName` 형태의 URL 파라미터를 정규식 캡처 그룹으로 치환한다.
    // 치환되는 정규식 `([^\/]+)` 은 슬래시가 아닌 임의의 문자열을 1개 이상 매칭한다.
    // 파라미터 이름(`parameterName`)은 추출 순서대로 params 배열에 기록하여 매칭 시 캡처된 값과 매핑될 수 있도록 한다.
    const parsedFragment = fragment
      .replace(
        ROUTE_PARAMETER_REGEXP,
        (match, paramName) => {
          params.push(paramName)
          return URL_FRAGMENT_REGEXP
        })
      .replace(/\//g, '\\/')

    console.log(`^${parsedFragment}$`)

    routes.push({
      testRegExp: new RegExp(`^${parsedFragment}$`),
      component,
      params
    })

    return router
  }

  router.setNotFound = cb => {
    notFound = cb
    return router
  }

  router.navigate = fragment => {
    window.location.hash = fragment
  }

  router.start = () => {
    window
      .addEventListener(
        'hashchange',
        checkRoutes
      )

    if (!window.location.hash) {
      window.location.hash = '#/'
    }

    checkRoutes()
  }

  return router
}
