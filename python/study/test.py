def build(x, y):
    return lambda: x * x + y * y


print(build(4,9)())