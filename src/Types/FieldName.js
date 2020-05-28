
import { types } from 'fieldify'

import React from 'react';

import {
  InputNumber,
  Form,
  Space,
  Tag,
  Input,
  Col,
  Row
} from "antd";

import { FieldStringOutlined as Icon } from '@ant-design/icons';

import TypeForm from '../lib/TypeForm';
import TypeInfo from '../lib/TypeInfo';
import TypeBuilder from '../lib/TypeBuilder';

import String from './String'


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Rendering of the field in a form
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class FieldNameForm extends String.Form { 
  constructor(props){
    super(props)
  }

  verify(input, cb) {
    super.verify(input, (ret)=>{
      if(ret.status !== "success") {
        return(cb(ret))
      }

      // check if the key is already used
      if(this.props.user && input in this.props.user) {
        const msg = `Field name already used`
        
        this.onError(true, msg);
        return (cb({
          status: "error",
          feedback: true,
          help: msg
        }))
      }

      cb(ret)
    })
  }
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Information of the field show fancy information of the type
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class FieldNameInfo extends String.Info { }

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Field builder
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class FieldNameBuilder extends TypeBuilder {
  constructor(props) {
    super(props)

    this.default = {
      minSize: 1,
      maxSize: 128
    }

    // this.configure()
  }

  render() {
    return (
      <div>
        <Form.Item label="FieldName min/max size">
          {/* <Space>
            <InputNumber min={0} value={this.state.minSize} onChange={(value) => this.changeIt("minSize", value)} />

            <InputNumber min={0} value={this.state.maxSize} onChange={(value) => this.changeIt("maxSize", value)} />
          </Space> */}
        </Form.Item>

      </div>
    )
  }
}

export default {
  code: types.FieldName.code,
  description: types.FieldName.description,
  class: types.FieldName.class,

  Info: FieldNameInfo,
  Builder: FieldNameBuilder,
  Form: FieldNameForm
}


