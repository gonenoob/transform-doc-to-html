import React, { Component } from 'react'
import { Upload, Button } from 'antd'
import PropTypes from 'prop-types'

import { readFileAsArrayBuffer, transformFile } from './utils'

class Doc2Html extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  getUploadProps = () => {
    const { onResult, imageUploadOptions } = this.props

    return {
      beforeUpload: async file => {
        let html = await getHtmlFromDocFile(file, imageUploadOptions)

        if (html) {
          console.log(typeof html)
          onResult(html)
        }

        return false
      }
    }
  }

  render() {
    const { children } = this.props

    return (
      <Upload
        {...this.getUploadProps()}
      >
        {children || (
          <Button>上传文件</Button>
        )}
      </Upload>
    )
  }
}

export async function getHtmlFromDocFile(file, imageUploadOptions) {
  let arrayBuffer = await readFileAsArrayBuffer(file)
  let result = await transformFile(arrayBuffer, imageUploadOptions)

  return result.value
}

export default Doc2Html

Doc2Html.propTypes = {
  children: PropTypes.any,
  imageUploadOptions: PropTypes.object,
  onResult: PropTypes.func.isRequired
}
