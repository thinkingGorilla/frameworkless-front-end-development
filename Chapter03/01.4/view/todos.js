let template

const createNewTodoNode = () => {
  if (!template) {
    template = document.getElementById('todo-item')
  }

  return template
    .content
    .firstElementChild
    .cloneNode(true)
}

const getTodoElement = (todo, index) => {
  const {
    text,
    completed
  } = todo

  const element = createNewTodoNode()

  element.querySelector('input.edit').value = text
  element.querySelector('label').textContent = text

  if (completed) {
    element.classList.add('completed')
    element
      .querySelector('input.toggle')
      .checked = true
  }

  // 각 todo_ 항목의 고유 index 값을 button 요소의 data-* 속성으로 저장
  // - 이렇게 하면 나중에 이벤트 위임으로 처리할 때(e.target.dataset.index) 어떤 항목을 클릭했는지 식별 가능
  // - DOM 요소와 상태 배열(state.todos)의 인덱스를 연결하는 '표식' 역할
  // - 굳이 이벤트 핸들러를 개별 바인딩하지 않아도, 상위 컨테이너 리스너에서 dataset.index로 해당 항목을 바로 참조할 수 있음
  element
    .querySelector('button.destroy')
    .dataset
    .index = index

  return element
}

export default (targetElement, state, events) => {
  const { todos } = state
  const { deleteItem } = events
  const newTodoList = targetElement.cloneNode(true)

  newTodoList.innerHTML = ''

  todos
    .map((todo, index) => getTodoElement(todo, index))
    .forEach(element => {
      newTodoList.appendChild(element)
    })

  // 이벤트 위임(Event Delegation) 방식
  // - 리스트 컨테이너(newTodoList)에 리스너 하나만 등록
  // - 하위 요소(button.destroy)에서 발생한 이벤트는 버블링을 통해 컨테이너까지 전파됨
  // - e.target.matches(...) 로 실제 이벤트 발생 요소를 판별 후 처리
  // - 장점: 항목이 많아도 리스너 1개 → 메모리 효율 ↑, 동적 항목 추가 시 자동 대응
  // - 단점: e.target 검사 로직이 필요해 코드가 다소 복잡해짐
  newTodoList.addEventListener('click', e => {
    if (e.target.matches('button.destroy')) {
      deleteItem(e.target.dataset.index)
    }
  })

  /*
  요소별 직접 바인딩 방식과 비교

  element.querySelector('button.destroy')
    .addEventListener('click', () => deleteItem(index))

  - 각 todo_ 항목마다 이벤트 리스너 생성
  - 직관적이고 코드 가독성은 좋음
  - 하지만 항목이 많아질수록 리스너 개수 ↑ (메모리 부담)
  - 동적으로 항목 추가될 때마다 새로 바인딩 필요

  이벤트 위임:
  - 상위 요소에 단일 리스너만 등록
  - 메모리/성능상 유리, 동적 요소에도 자동 적용
  - 코드가 e.target 검사 기반이라 약간 복잡해질 수 있음
  */

  return newTodoList
}
