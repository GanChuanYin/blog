### 简介

Nest 是一个用于构建高效，可扩展的 Node.js 服务器端应用程序的框架。它使用渐进式 JavaScript，内置并**完全支持 TypeScript**（但仍然允许开发人员使用纯 JavaScript 编写代码）并结合了 OOP（面向对象编程），FP（函数式编程）和 FRP（函数式响应编程）的元素。

在底层，Nest 使用强大的 HTTP Server 框架，如 **Express（默认）**和 Fastify。Nest 在这些框架之上提供了一定程度的抽象，同时也将其 API 直接暴露给开发人员。这样可以轻松使用每个平台的无数第三方模块。

Nest 提供了一个开箱即用的**应用程序架构**，允许开发人员和团队创建高度可测试，可扩展，松散耦合且易于维护的应用程序。

简单总结一下 nestjs

1. nestjs 是 Node.js 服务器端应用程序的框架
2. nestjs 完全支持 TS
3. nestjs 底层采用 express 等老牌框架，在这些框架之上提供了一定程度的抽象
4. Nestjs 主要解决 nodejs 程序的架构问题

### nest 项目目录结构

src
├── app.controller.spec.ts
├── app.controller.ts
├── app.module.ts
├── app.service.ts
└── main.ts

![](https://qiniu.espe.work/blog/20220509234925.png)

nestjs 中有三个基础概念

1. controller 控制器 app.controller.ts
2. Providers 服务提供者 app.service.ts
3. Module 模块 app.module.ts

### 中间件 middleware

中间件是在路由处理程序 <font color=#e74c3c> 之前 </font> 调用的函数。 中间件函数可以访问请求和响应对象，以及应用程序请求响应周期中的 next() 中间件函数。 next() 中间件函数通常由名为 next 的变量表示。

![](https://qiniu.espe.work/blog/20220510102336.png)

您可以在函数中或在具有 @Injectable() 装饰器的类中实现自定义 Nest 中间件。 这个类应该实现 **NestMiddleware** 接口, 而函数没有任何特殊的要求。 让我们首先使用类方法实现一个简单的中间件功能。

例子：

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...')
    next()
  }
}
```

应用中间件

```typescript
import {
  Module,
  NestModule,
  RequestMethod,
  MiddlewareConsumer
} from '@nestjs/common'
import { LoggerMiddleware } from './common/middleware/logger.middleware'
import { CatsModule } from './cats/cats.module'

@Module({
  imports: [CatsModule]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'cats', method: RequestMethod.GET })
  }
}
```

以上配置的中间件对 path 为 cats，且 RequestMethod 为 get 才会生效

**路由通配符**

路由同样支持模式匹配。例如，星号被用作通配符，将匹配任何字符组合。

```typescript
forRoutes({ path: 'ab*cd', method: RequestMethod.ALL })
```

以上路由地址将匹配 abcd 、 ab_cd 、 abecd 等。字符 ? 、 + 、 \* 以及 () 是它们的正则表达式对应项的子集。连字符 (-) 和点 (.) 按字符串路径解析。

有时我们想从应用中间件中**排除某些路由**。我们可以使用该 exclude() 方法轻松排除某些路由。此方法可以采用一个字符串，多个字符串或一个 RouteInfo 对象来标识要排除的路由，如下所示：

```typescript
consumer
  .apply(LoggerMiddleware)
  .exclude(
    { path: 'cats', method: RequestMethod.GET },
    { path: 'cats', method: RequestMethod.POST },
    'cats/(.*)'
  )
  .forRoutes(CatsController)
```

**函数式中间件**

我们使用的 LoggerMiddleware 类非常简单。它没有成员，没有额外的方法，没有依赖关系。为什么我们不能只使用一个简单的函数？这是一个很好的问题，因为事实上 - 我们可以做到。这种类型的中间件称为函数式中间件。让我们把 logger 转换成函数。

```typescript
export function logger(req, res, next) {
  console.log(`Request...`)
  next()
}
```

应用方法与普通中间件一致

**多个中间件**

如前所述，为了绑定顺序执行的多个中间件，我们可以在 apply() 方法内用逗号分隔它们。

```typescript
consumer.apply(cors(), helmet(), logger).forRoutes(CatsController)
```

**全局中间件**

如果我们想一次性将中间件绑定到每个注册路由，我们可以使用由 INestApplication 实例提供的 use()方法：

```typescript
const app = await NestFactory.create(AppModule)
app.use(logger)
await app.listen(3000)
```

### 异常过滤器 exception filter

内置的异常层负责处理整个应用程序中的所有抛出的异常。当捕获到未处理的异常时，最终用户将收到友好的响应。

![](https://qiniu.espe.work/blog/20220510110408.png)

**内置异常过滤器**

开箱即用，此操作由内置的全局异常过滤器执行，该过滤器处理类型 HttpException（及其子类）的异常。每个发生的异常都由全局异常过滤器处理, 当这个异常无法被识别时 (既不是 HttpException 也不是继承的类 HttpException ) , 用户将收到以下 JSON 响应:

```JSON
{
    "statusCode": 500,
    "message": "Internal server error"
}

```

<font color=#3498db>自定义异常过滤器</font>

虽然基本（内置）异常过滤器可以为您自动处理许多情况，但有时您可能希望对异常层拥有完全控制权，例如，您可能希望基于某些动态因素添加日志记录或使用不同的 JSON 模式。 异常过滤器正是为此目的而设计的。 它们使您可以控制精确的控制流以及将响应的内容发送回客户端。

```typescript
// http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException
} from '@nestjs/common'
import { Request, Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = exception.getStatus()

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url
    })
  }
}
```

> 所有异常过滤器都应该实现通用的 ExceptionFilter\<T> 接口。它需要你使用有效签名提供 catch(exception: T, host: ArgumentsHost)方法。T 表示异常的类型。

@Catch() 装饰器绑定所需的元数据到异常过滤器上。它告诉 Nest 这个特定的过滤器正在寻找 HttpException 而不是其他的。在实践中，@Catch() 可以传递多个参数，所以你可以通过逗号分隔来为多个类型的异常设置过滤器。

<font color=#3498db>绑定过滤器</font>

```typescript
// cats.controller.ts
@Post()
@UseFilters(new HttpExceptionFilter())
async create(@Body() createCatDto: CreateCatDto) {
  throw new ForbiddenException();
}

// @UseFilters() 装饰器需要从 @nestjs/common 包导入。
```

我们在这里使用了 @UseFilters() 装饰器。和 @Catch()装饰器类似，它可以使用单个过滤器实例，也可以使用逗号分隔的过滤器实例列表。 我们创建了 HttpExceptionFilter 的实例。另一种可用的方式是传递类（不是实例），让框架承担实例化责任并启用依赖注入。

```typescript
@Post()
@UseFilters(HttpExceptionFilter)
async create(@Body() createCatDto: CreateCatDto) {
  throw new ForbiddenException();
}

```

> 尽可能使用类而不是实例。由于 Nest 可以轻松地在整个模块中重复使用同一类的实例，因此可以减少内存使用。

在上面的示例中，HttpExceptionFilter**仅应用于单个 create() 路由处理程序**，使其成为方法范围的。 异常过滤器的作用域可以划分为不同的级别：方法范围，控制器范围或全局范围。 例如，要将过滤器设置为**控制器作用域**，您可以执行以下操作：

```typescript
@UseFilters(new HttpExceptionFilter())
export class CatsController {}
```

要创建一个 <font color=#e74c3c>全局范围</font> 的过滤器，您需要执行以下操作:

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalFilters(new HttpExceptionFilter())
  await app.listen(3000)
}
bootstrap()
```

全局过滤器用于整个应用程序、每个控制器和每个路由处理程序。就依赖注入而言，从任何模块外部注册的全局过滤器（使用上面示例中的 useGlobalFilters()）不能注入依赖，因为它们不属于任何模块。为了解决这个问题，你可以注册一个全局范围的过滤器直接为任何模块设置过滤器：

```typescript
// app.module.ts
import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    }
  ]
})
export class AppModule {}
```

#### 捕获异常

为了捕获每一个未处理的异常(不管异常类型如何)，将 @Catch() 装饰器的参数列表设为空，例如 @Catch()。

```typescript
// any-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus
} from '@nestjs/common'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url
    })
  }
}
```

### 管道 pipes

管道是具有 @Injectable() 装饰器的类。管道应实现 PipeTransform 接口。

![](https://qiniu.espe.work/blog/20220510110408.png)

管道有两个类型:

- 转换：管道将输入数据转换为所需的数据输出
- 验证：对输入数据进行验证，如果验证成功继续传递; 验证失败则抛出异常;

在这两种情况下, 管道 参数(arguments) 会由 控制器(controllers)的路由处理程序 进行处理. Nest 会在调用这个方法之前插入一个管道，管道会先拦截方法的调用参数,进行转换或是验证处理，然后用转换好或是验证好的参数调用原方法。

> 管道在异常区域内运行。这意味着当抛出异常时，它们由核心异常处理程序和应用于当前上下文的 异常过滤器 处理。<font color=#e74c3c>当在 Pipe 中发生异常，controller 不会继续执行任何方法</font>。

**内置管道**

Nest 自带八个开箱即用的管道，即

- ValidationPipe
- ParseIntPipe
- ParseBoolPipe
- ParseArrayPipe
- ParseUUIDPipe
- DefaultValuePipe
- ParseEnumPipe
- ParseFloatPipe

```typescript
// validate.pipe.ts
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common'

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return value
  }
}
```

> PipeTransform<T, R> 是一个通用接口，其中 T 表示 value 的类型，R 表示 transform() 方法的返回类型。

#### 验证管道

<font color=#3498db> 类验证器</font>

Nest 与 class-validator 配合得很好。这个优秀的库允许您使用基于装饰器的验证。装饰器的功能非常强大，尤其是与 Nest 的 Pipe 功能相结合使用时，因为我们可以通过访问 metatype 信息做很多事情，在开始之前需要安装一些依赖。

每个管道必须提供 transform() 方法。 这个方法有两个参数：

- value
- metadata

value 是当前处理的参数，而 metadata 是其元数据。元数据对象包含一些属性：

```typescript
export interface ArgumentMetadata {
  type: 'body' | 'query' | 'param' | 'custom'
  metatype?: Type<unknown>
  data?: string
}
```

这里有一些属性描述参数：

![](https://qiniu.espe.work/blog/20220510141821.png)

```typescript
import { IsString, IsInt } from 'class-validator'

export class CreateCatDto {
  @IsString()
  name: string

  @IsInt()
  age: number

  @IsString()
  breed: string
}
```

#### 转换管道

验证不是管道唯一的用处。在本章的开始部分，我已经提到管道也可以将输入数据转换为所需的输出。这是可以的，因为从 transform 函数返回的值完全覆盖了参数先前的值。在什么时候使用？有时从客户端传来的数据需要经过一些修改（例如字符串转化为整数），然后处理函数才能正确的处理。

还有种情况，比如有些数据具有默认值，用户不必传递带默认值参数，一旦用户不传就使用默认值。**转换管道被插入在客户端请求和请求处理程序之间用来处理客户端请求。**

```typescript
// parse-int.pipe.ts
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException
} from '@nestjs/common'

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10)
    if (isNaN(val)) {
      throw new BadRequestException('Validation failed')
    }
    return val
  }
}
```

如下所示, 我们可以很简单的配置管道来处理所参数 id:

```typescript
@Get(':id')
async findOne(@Param('id', new ParseIntPipe()) id) {
  return await this.catsService.findOne(id);
}

```

由于上述结构，ParseIntpipe 将在请求触发相应的处理程序之前执行。

另一个有用的例子是按 ID 从数据库中选择一个现有的用户实体。

```typescript
@Get(':id')
findOne(@Param('id', UserByIdPipe) userEntity: UserEntity) {
  return userEntity;
}

```

如果愿意你还可以试试 **ParseUUIDPipe** 管道, 它用来分析验证字符串是否是 UUID.

```typescript
@Get(':id')
async findOne(@Param('id', new ParseUUIDPipe()) id) {
  return await this.catsService.findOne(id);
}

```

### 守卫 guards

守卫是一个使用 @Injectable() 装饰器的类。 守卫应该实现 CanActivate 接口。

![](https://qiniu.espe.work/blog/20220510144109.png)

守卫有一个单独的责任。它们根据运行时出现的某些条件（例如权限，角色，访问控制列表等）来确定给定的请求是否由路由处理程序处理。 这通常称为授权。

> <font color=#e74c3c>守卫在每个中间件之后执行，但在任何拦截器或管道之前执行。</font>

#### 授权守卫

正如前面提到的，授权是保护的一个很好的用例，因为只有当调用者(通常是经过身份验证的特定用户)具有足够的权限时，特定的路由才可用。我们现在要构建的 AuthGuard 假设用户是经过身份验证的(因此，请求头附加了一个 token)。它将提取和验证 token，并使用提取的信息来确定请求是否可以继续。

```typescript
// auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    return validateRequest(request)
  }
}
```

validateRequest() 函数中的逻辑可以根据需要变得简单或复杂。本例的主要目的是说明保护如何适应请求/响应周期。

每个守卫必须实现一个 canActivate()函数。**此函数应该返回一个布尔值，指示是否允许当前请求**。它可以同步或异步地返回响应(通过 Promise 或 Observable)。Nest 使用返回值来控制下一个行为:

- 如果返回 true, 将处理用户调用。
- 如果返回 false, 则 Nest 将忽略当前处理的请求。

#### 基于角色认证

一个更详细的例子是一个 RolesGuard 。这个守卫只允许具有特定角色的用户访问。我们将从一个基本模板开始，并在接下来的部分中构建它。目前，它允许所有请求继续:

```typescript
// roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    return true
  }
}
```

#### 绑定守卫

与管道和异常过滤器一样，守卫可以是控制范围的、方法范围的或全局范围的。下面，我们使用 @UseGuards()装饰器设置了一个控制范围的守卫。这个装饰器可以使用单个参数，也可以使用逗号分隔的参数列表。也就是说，你可以传递几个守卫并用逗号分隔它们。

```typescript
@Controller('cats')
@UseGuards(RolesGuard)
export class CatsController {}

// @UseGuards() 装饰器需要从 @nestjs/common 包导入。
```

上例，我们已经传递了 RolesGuard 类型而不是实例, 让框架进行实例化，并启用了依赖项注入。与管道和异常过滤器一样，我们也可以传递一个实例:

```typescript
@Controller('cats')
@UseGuards(new RolesGuard())
export class CatsController {}
```

上面的构造将守卫附加到此控制器声明的每个处理程序。如果我们决定只限制其中一个, 我们只需要在方法级别设置守卫。为了绑定全局守卫, 我们使用 Nest 应用程序实例的 useGlobalGuards() 方法:

为了设置一个全局守卫，使用 Nest 应用程序实例的 useGlobalGuards() 方法：

```typescript
const app = await NestFactory.create(AppModule)
app.useGlobalGuards(new RolesGuard())
```

### 拦截器 Interceptors

拦截器是使用 @Injectable() 装饰器注解的类。拦截器应该实现 NestInterceptor 接口。
![](https://qiniu.espe.work/blog/20220510145733.png)

拦截器具有一系列有用的功能，这些功能受面向切面编程（AOP）技术的启发。它们可以：

- 在函数执行之前/之后绑定额外的逻辑
- 转换从函数返回的结果
- 转换从函数抛出的异常
- 扩展基本函数行为
- 根据所选条件完全重写函数 (例如, 缓存目的)

每个拦截器都有 intercept() 方法，它接收 2 个参数。 第一个是 ExecutionContext 实例（与守卫完全相同的对象）。 ExecutionContext 继承自 ArgumentsHost 。 ArgumentsHost 是传递给原始处理程序的参数的一个包装 ，它根据应用程序的类型包含不同的参数数组

#### 计算时间戳

第一个用例是使用拦截器在函数执行之前或之后添加额外的逻辑。当我们要记录与应用程序的交互时，它很有用，例如 存储用户调用，异步调度事件或计算时间戳。作为一个例子，我们来创建一个简单的例子

```typescript
// logging.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...')

    const now = Date.now()
    return next
      .handle()
      .pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)))
  }
}
```

**绑定拦截器**

为了设置拦截器, 我们使用从 @nestjs/common 包导入的 @UseInterceptors() 装饰器。与守卫一样, 拦截器可以是控制器范围内的, 方法范围内的或者全局范围内的。

```typescript
// cats.controller.ts
@UseInterceptors(LoggingInterceptor)
export class CatsController {}
// @UseInterceptors() 装饰器从 @nestjs/common 导入。
```

由此，CatsController 中定义的每个路由处理程序都将使用 LoggingInterceptor。当有人调用 GET /cats 端点时，您将在控制台窗口中看到以下输出：

```shell
Before...
After... 1ms

```

为了绑定全局拦截器, 我们使用 Nest 应用程序实例的 useGlobalInterceptors() 方法:

```typescript
const app = await NestFactory.create(ApplicationModule)
app.useGlobalInterceptors(new LoggingInterceptor())
```


### 参数装饰器

Nest 提供了一组非常实用的参数装饰器，可以结合 HTTP 路由处理器（route handlers）一起使用。下面的列表展示了Nest 装饰器和原生 Express（或 Fastify）中相应对象的映射。

![](https://qiniu.espe.work/blog/20220510150459.png)