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

class Base {
  k = 4
}

class Derived extends Base {
  constructor() {
    // Prints a wrong value in ES5; throws exception in ES6
    super()
  }
}

type C = Awaited<boolean | Promise<number>>
