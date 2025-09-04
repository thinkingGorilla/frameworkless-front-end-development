let template

const createNewTodoNode = () => {
  // 처음 호출될 때만 템플릿 요소를 가져옴 (캐싱)
  if (!template) {
    template = document.getElementById('todo-item')
  }

  return template
    .content
    .firstElementChild
    .cloneNode(true)
}

const getTodoElement = (todo, index, events) => {
  const {
    text,
    completed
  } = todo

  const element = createNewTodoNode() // 새로운 todos DOM 생성

  element.querySelector('input.edit').value = text
  element.querySelector('label').textContent = text

  if (completed) {
    element.classList.add('completed')
    element
      .querySelector('input.toggle')
      .checked = true
  }

  // 삭제 버튼 이벤트 핸들러 정의
  const handler = e => events.deleteItem(index)

  // 삭제 버튼에 이벤트 리스너 등록
  element
    .querySelector('button.destroy')
    .addEventListener('click', handler)

  return element
}

export default (targetElement, { todos }, events) => {
  const newTodoList = targetElement.cloneNode(true)

  // 복제된 요소 내부를 비움 (기존 자식 제거)
  newTodoList.innerHTML = ''

  // todos 배열을 순회하며 개별 todos DOM 요소 생성 후 리스트에 추가
  todos
    .map((todo, index) => getTodoElement(todo, index, events))
    .forEach(element => {
      newTodoList.appendChild(element)
    })

  return newTodoList
}
