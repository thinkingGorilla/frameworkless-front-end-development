const registry = {}

const renderWrapper = component => {
  return (targetElement, state) => {
    // component(targetElement, state) 실행
    // → 실제로는 cloneComponent 또는 사용자가 등록한 컴포넌트 호출
    // → DOM 엘리먼트를 생성하거나 복제해 element 변수에 담음
    //   (JS에서는 인자가 더 넘어와도 무시되므로, cloneComponent(root, state)는 root만 받음)
    const element = component(targetElement, state)

    // element 내부에서 data-component 속성이 있는 모든 요소를 찾음
    // querySelectorAll('[data-component]') → 계층적 구조여도 평평하게(flat) NodeList 반환
    const childComponents = element
      .querySelectorAll('[data-component]')

    Array
      .from(childComponents)
      .forEach(target => {
        // data-component 속성의 값 추출 (ex: <div data-component="Button"> → "Button")
        const name = target
          .dataset
          .component

        // registry에서 해당 이름의 컴포넌트 함수 찾음
        const child = registry[name]
        if (!child) {
          return
        }

        // target 요소를 컴포넌트 함수(child) 실행 결과로 교체
        // child도 renderWrapper로 감싸져 있으므로 재귀적으로 동일 로직 적용
        // e.g. renderWrapper(todosView)
        // const element = component(targetElement, state)를 호출하면
        // todos.js의 export default (targetElement, { todos }) => { .. }) 코드가 호출됨 → 상태에 따른 todos 뷰 반환
        target.replaceWith(child(target, state))
      })

    return element
  }
}

// 레지스트리에 컴포넌트 등록 함수
// add("Button", ButtonComponent) 하면
// registry["Button"] = renderWrapper(ButtonComponent) 저장됨
// e.g. index.js
// registry.add('todos', todosView)
// registry.add('counter', counterView)
// registry.add('filters', filtersView)
const add = (name, component) => {
  registry[name] = renderWrapper(component)
}

const renderRoot = (root, state) => {
  // 단순히 루트 노드를 깊은 복제하는 함수
  // cloneNode(true) → 자식까지 전부 복제
  // 파라미터는 하나(root)만 받지만, renderWrapper에서 두 개(root, state)를 넘겨도 state는 무시됨
  const cloneComponent = root => {
    return root.cloneNode(true)
  }

  return renderWrapper(cloneComponent)(root, state)
}

export default {
  add,
  renderRoot
}
