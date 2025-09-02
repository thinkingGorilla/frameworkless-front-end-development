const isNodeChanged = (node1, node2) => {
  const n1Attributes = node1.attributes
  const n2Attributes = node2.attributes
  if (n1Attributes.length !== n2Attributes.length) {
    return true
  }

  const differentAttribute = Array
    .from(n1Attributes)
    .find(attribute => {
      const { name } = attribute
      const attribute1 = node1
        .getAttribute(name)
      const attribute2 = node2
        .getAttribute(name)

      return attribute1 !== attribute2
    })

  if (differentAttribute) {
    return true
  }

  if (node1.children.length === 0 &&
    node2.children.length === 0 &&
    node1.textContent !== node2.textContent) {
    return true
  }

  return false
}

const applyDiff = (
  parentNode,
  realNode,
  virtualNode) => {

  // 1) 실제 노드는 있는데, 가상 노드가 없을 때 → 실제 노드를 제거
  if (realNode && !virtualNode) {
    realNode.remove()
    return
  }

  // 2) 실제 노드는 없는데, 가상 노드는 있을 때 → 가상 노드를 새로 추가
  if (!realNode && virtualNode) {
    parentNode.appendChild(virtualNode)
    return
  }

  // 3) 실제 노드와 가상 노드가 둘 다 있는데,
  //    내용이 달라졌을 때 → 가상 노드로 교체
  //    내용이 달라진 경우? → 속성 개수가 다름, 하나 이상의 속성이 변경됨, 노드에 자식이 없고 textContent가 다름
  if (isNodeChanged(virtualNode, realNode)) {
    realNode.replaceWith(virtualNode)
    return
  }

  // 4) 위의 세 조건이 아니라면,
  //    실제와 가상 노드가 존재하고 동일 타입이므로,
  //    자식 노드들을 비교(diff)해야 함
  const realChildren = Array.from(realNode.children)
  const virtualChildren = Array.from(virtualNode.children)

  const max = Math.max(
    realChildren.length,
    virtualChildren.length
  )
  for (let i = 0; i < max; i++) {
      // 재귀적으로 자식 노드 비교
      applyDiff(
      realNode,
      realChildren[i],
      virtualChildren[i]
    )
  }
}

export default applyDiff
