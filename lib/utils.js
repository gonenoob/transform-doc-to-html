import axios from 'axios'

import mammoth from './mammoth.browser'

export function dataURLtoFile(dataURI, type) {
  let b = window.atob(dataURI)
  let arr = []

  for(let i =0; i < b.length; i++) {
    arr.push(b.charCodeAt(i))
  }

  return new Blob([new Uint8Array(arr), {type}])
}

export function base64toFile(base64, mime) {
  let blob = dataURLtoFile(base64, mime)
  let suf = '.' + mime.split('/')[1]

  return new File([blob], new Date() + suf)
}

export function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = function(e) {
      const arrayBuffer = e.target['result']

      resolve(arrayBuffer)
    }

    reader.onerror = e => {
      reject(e)
    }

    reader.readAsArrayBuffer(file)
  })
}

export async function uploadImage(base64Image, mime, api) {
  const formData = new FormData()

  formData.append('image', base64toFile(base64Image, mime))

  return await axios({
    method: 'POST',
    credentials: 'include',
    url: api, // 本地图片上传的API地址
    data: formData,
    config: { headers: { 'Content-Type': 'multipart/form-data' } }
  }).then(response => {
    const responseData = response.data || {}

    if (responseData.success) {
      return responseData.data
    } else {
      throw new Error(responseData.msg || 'request error')
    }
  })
}

export async function transformFile(arrayBuffer, imageUploadOptions) {
  const { api, processResult } = imageUploadOptions

  return await mammoth.convertToHtml({ arrayBuffer }, {
    convertImage: mammoth.images.imgElement(function(image) {
      return image.read('base64').then(async (imageBuffer) => {
        let { cx, cy } = image
        let result = {
          src: 'data:' + image.contentType + ';base64,' + imageBuffer
        }
        if (cx) {
          Object.assign(result, {
            width: cx.slice(0, 3) + 'px'
          })
        }

        if (cy) {
          Object.assign(result, {
            height: cy.slice(0, 3) + 'px'
          })
        }

        if (api) {
          try {
            let src = await uploadImage(imageBuffer, image.contentType, api)

            result.src = processResult ? processResult(src) : src
          } catch(e) {}
        }

        return result
      })
    })
  })
}

export async function getHtmlFromDocFile(file, imageUploadOptions) {
  let arrayBuffer = await readFileAsArrayBuffer(file)
  let result = await transformFile(arrayBuffer, imageUploadOptions)

  return result.value
}

export async function extractRawText(file) {
  let arrayBuffer = await readFileAsArrayBuffer(file)

  return await mammoth.extractRawText({ arrayBuffer })
}
