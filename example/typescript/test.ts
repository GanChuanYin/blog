interface Circle {
  kind: 'circle'
  radius: number
}

interface Square {
  kind: 'square'
  sideLength: number
}

type Shape = Circle | Square

function getArea(shape: Shape) {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2
    case 'square':
      return shape.sideLength ** 2
  }
}

type Mapish = { [k: string]: boolean }
type M = keyof Mapish


function f() {
  return { x: 10, y: 3 }
}

type P = ReturnType<typeof f>
