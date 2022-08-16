import ReactDOM from 'react-dom'
import { useState } from 'react'

import Lib from './lib'

function App() {
  const [value, setValue] = useState()

  return (
    <div>
      <Lib
        onResult={setValue}
        imageUploadOptions={{
          api: '/upload/image',
          code: 'image',
          processResult: responseData => `http://xxxx/xxx/images/${responseData.path}`
        }}
      >
        <div>上传</div>
      </Lib>
      <div dangerouslySetInnerHTML={{ __html: value }}></div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))
