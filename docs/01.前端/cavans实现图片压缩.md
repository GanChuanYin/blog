---
title: cavans实现图片压缩
date: 2022-11-28 18:13:12
permalink: /pages/c37f65/
categories:
  - 前端
tags:
  - Javascript
---
## 核心原理

1. canvas 的`toDataURL` 能压缩格式为 image/jpeg 或者 image/webp 的图片

2. canvas 绘制图片 ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)

3. 二分法求最接近目标大小的值

4. 将压缩好的 dataURL(base64)转为 File

5. 根据 `createObjectURL` 和 新建a标签, 手动触发 `click` 事件下载压缩好的文件

## 上代码

canvas 压缩 根据画质压缩图片

```typescript
/**
 *
 * @param {file: File|Blob, maxSize: number, scale: 0-1}
 * @return {name: string, blob: Blob, dataURL: base64}
 */
export function compress(file: File, maxSize = 500, scale = 0.5) {
  maxSize *= 1024 // maxSize 单位为kb，这里转为b
  const { size: sourceSize, name } = file
  const fileType = name.replace(/^.*\.(\w*)$/, '$1').toLowerCase()
  if (!['jpg', 'jpeg', 'png', 'webp'].includes(fileType))
    return Promise.reject('文件格式不支持！')
  const blobUrl = URL.createObjectURL(file)
  const tmpImg = new Image()
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  return new Promise((resolve, reject) => {
    tmpImg.onload = async function (e: any) {
      const img = e.target
      // URL.revokeObjectURL(file) // 清理图片缓存
      let { width, height } = img
      width *= scale
      height *= scale
      //如果图片大于四百万像素，重写缩放比例比并将大小压至400万以下
      if ((width * height) / 4e6 > 1) {
        scale = 4e6 / (width * height)
        width *= scale
        height *= scale
      }
      // 设置画布大小
      canvas.width = width
      canvas.height = height
      context!.fillStyle = '#fff' // 填充底色，处理png背景为黑色的问题
      context!.fillRect(0, 0, width, height)
      // canvas 绘图，这一步将图片按比例缩放，并处理瓦片问题
      drawImage(context, img, scale)
      compressCalculation(canvas, maxSize).then((res: any) => {
        console.log(
          '压缩完成，压缩前：',
          sourceSize,
          ' => 压缩后：',
          res.blob.size
        )
        let file = dataURLtoFile(res.dataURL, name)
        resolve(file)
      })
    }
    tmpImg.src = blobUrl
  })
}

/**
 * @description 将图片绘制到画布上，并根据缩放比例进行缩放，若图片大于2000000像素则进行瓦片处理
 * @param {context: canvasContext, img: imgObj, scale: 0-1}
 */
function drawImage(context: any, img: any, scale: number) {
  const { width: sourceWidth, height: sourceHeight } = img
  const pSize = sourceWidth * sourceHeight
  const targetWidth = sourceWidth * scale,
    targetHeight = sourceHeight * scale
  const defSize = 1000 // 设置瓦片默认宽高
  const cols = pSize > 2e6 ? ~~(targetWidth / defSize) + 1 : 1 // 列数
  const rows = pSize > 2e6 ? ~~(targetHeight / defSize) + 1 : 1 // 行数
  // 瓦片绘图
  for (let i = 0; i < rows; i++) {
    // 遍历列
    for (let j = 0; j < cols; j++) {
      // 遍历行
      const canvasWidth = j === cols - 1 ? targetWidth % defSize : defSize
      const canvasHeight = i === rows - 1 ? targetHeight % defSize : defSize
      const canvasLeft = j * defSize
      const canvasTop = i * defSize
      const imgWidth = canvasWidth / scale
      const imgHeight = canvasHeight / scale
      const imgLeft = canvasLeft / scale
      const imgTop = canvasTop / scale
      context.drawImage(
        img,
        imgLeft,
        imgTop,
        imgWidth,
        imgHeight,
        canvasLeft,
        canvasTop,
        canvasWidth,
        canvasHeight
      )
    }
  }
}

/**
 * @param {canvas: Canvas, maxSize: number}
 */
function compressCalculation(canvas: any, maxSize: number) {
  let count = 1 // 记录循环次数，防止死循环
  let quality = 1 // 图片质量
  let maxQuality = 1,
    minQuality = 0 // 定义图片质量范围
  return new Promise(function (resolve, reject) {
    async function fn() {
      quality = (maxQuality + minQuality) / 2
      // 获取压缩后结果
      let res = await compressBlob(canvas, quality)
      const { blob, dataURL }: any = res
      const { size } = blob
      console.log(`第${count}次压缩:`, quality, size)
      // 二分法获取最接近值
      function partition() {
        count++
        if (size > maxSize) {
          maxQuality = quality
        } else {
          minQuality = quality
        }
        fn()
      }
      if (count < 10 && size !== maxSize) {
        // 默认循环不大于20次，认为10次内的结果已足够接近
        partition()
      } else if (size > maxSize) {
        // 若限制次数之后size > maxSize，则继续执行，至结果小于maxSize
        partition()
      } else {
        resolve(res)
      }
    }
    fn()
  })
}

/**
 * @description 该步骤为关键步骤，通过canvas的toDataURL和toBlob对图片进行压缩
 * @param {canvas: Canvas, quality: 0-1 图片质量}
 */
function compressBlob(canvas: any, quality: number) {
  const type = 'image/jpeg' // 只有jpeg格式图片支持图片质量压缩
  const dataURL = canvas.toDataURL(type, quality)
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      function (blob: Blob) {
        resolve({
          dataURL,
          blob
        })
      },
      type,
      quality
    )
  })
}

/**
 * 下载File 或者 base64类型文件
 * @param data  File类型 或者 base64类型
 * @param fileType  fileType 文件类型
 */
export function downloadFile(data: File | string, fileType: string) {
  const fileStream = new Blob([data], { type: fileType })
  let url = window.URL.createObjectURL(fileStream)
  let link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', '压缩后')
  document.body.appendChild(link)
  link.click()
  link.remove()
}

/**
 * base64 转 File
 */
export function dataURLtoFile(
  base64Str: string,
  fileName: string = 'test'
): File {
  let arr: any = base64Str.split(',')
  let mime = arr[0].match(/:(.*?);/)[1]
  let bstr = atob(arr[1])
  let n = bstr.length
  let u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], fileName, { type: mime })
}
```
