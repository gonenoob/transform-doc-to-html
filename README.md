## transform doc to html
### Installation
```js
npm install transform-doc-to-html
```
### Usage
as react lib

```js
import Doc2Html from 'transform-doc-to-html'

function App(){
  return (
    <Doc2Html
      onResult={html => doSomething(html)}
      imageUploadOptions={{}}
    >
      <div>上传doc</div>
    </Doc2Html>
  )
}
```
or

as function

```js
import { getHtmlFromDocFile } from 'transform-doc-to-html'

const html = await getHtmlFromDocFile(file, imageUploadOptions)
```

### options
* onResult: return html，required
* imageUploadOptions
    - api: upload interface
    - code: 'file' | 'image', interface param code
    - processResult: uploadResult => imageUrl
