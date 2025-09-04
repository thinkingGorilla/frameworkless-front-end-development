import todosView from './view/todos.js'
import counterView from './view/counter.js'
import filtersView from './view/filters.js'
import appView from './view/app.js'
import applyDiff from './applyDiff.js'

import registry from './registry.js'

registry.add('app', appView)
registry.add('todos', todosView)
registry.add('counter', counterView)
registry.add('filters', filtersView)

// 애플리케이션 상태
const state = {
  todos: [],
  currentFilter: 'All'
}

// 애플리케이션 이벤트 핸들러 정의
const events = {
  deleteItem: (index) => {
    state.todos.splice(index, 1)
    render()
  },
  addItem: text => {
    state.todos.push({
      text,
      completed: false
    })
    render()
  }
}

const render = () => {
    // requestAnimationFrame: 브라우저의 렌더링 사이클에 맞춰 UI 갱신
    window.requestAnimationFrame(() => {
    const main = document.querySelector('#root')

    const newMain = registry.renderRoot(
      main,
      state,
      events)

    applyDiff(document.body, main, newMain)
  })
}

render()
