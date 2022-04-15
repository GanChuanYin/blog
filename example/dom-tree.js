const tree = {
  tag: 'div',
  id: 'root',
  children: [
    {
      tag: 'ul',
      id: 'ul',
      children: [
        {
          tag: 'li',
          id: 'li-1',
          children: [
            {
              tag: 'a',
              id: 'a',
              children: [
                {
                  tag: 'img',
                  id: 'img-1',
                  children: []
                }
              ]
            }
          ]
        },
        {
          tag: 'li',
          id: 'li-2',
          children: [
            {
              tag: 'span',
              id: 'span',
              children: [
                {
                  tag: 'img',
                  id: 'img-2',
                  children: []
                }
              ]
            }
          ]
        },
        {
          tag: 'li',
          id: 'li-3',
          children: []
        }
      ]
    },
    {
      tag: 'p',
      id: 'p',
      children: []
    },
    {
      tag: 'button',
      id: 'button',
      children: []
    }
  ]
}

function depthFirstSearch(node, target, result = []) {
  if (node.children && node.children.length) {
    node.children.forEach((n) => {
      depthFirstSearch(n, target, result)
    })
  }
  console.log(node.id)
  if (node.tag === target) {
    result.push(node)
  }
  return result
}

console.log(depthFirstSearch(tree, 'img'))

function breadthFirstSearch(nodes, target, result = []) {
  nodes.forEach((n) => {
    console.log(n.id)
    if (n.tag === target) {
      result.push(n)
    }
  })
  nodes.forEach((n) => {
    if (n.children && n.children.length) {
      breadthFirstSearch(n.children, target, result)
    }
  })
  return result
}

// console.log(breadthFirstSearch([tree], 'img'))
