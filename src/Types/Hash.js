
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

import { LinkOutlined as Icon } from '@ant-design/icons';

import TypeForm from '../lib/TypeForm';
import TypeRender from '../lib/TypeRender';
import TypeInfo from '../lib/TypeInfo';
import TypeBuilder from '../lib/TypeBuilder';

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Rendering of the field in a form
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class HashForm extends TypeForm {
  render() {
    return (super.render(
      <Input 
      value={this.state.value} 
      placeholder={this.state.options.placeholder} 
      onChange={({ target }) => this.changeValue(target.value)} 
      style={{width: "100%"}}
      />
    ));
  }
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Rendering of the field
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class HashRender extends TypeRender {
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Information of the field show fancy information of the type
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class HashInfo extends TypeInfo {
  render() {
    return (
      <span>
        <Tag color="#badb64" style={{ color: "#555555" }}><Icon /></Tag>
      </span>
    )
  }
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Field builder
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class HashBuilder extends TypeBuilder {
  constructor(props) {
    super(props)

    this.configure()
  }
}

/* <div class="ant-form-item-control-input">
  <div class="ant-form-item-control-input-content">
    <input type="text" class="ant-input" value="vdvfsdvfdsvfds" style="width: 100%;">
      </div><span class="ant-form-item-children-icon">
        <span role="img" aria-label="check-circle" class="anticon anticon-check-circle">
          <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="check-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true">
            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z">
              </path>
              </svg>
              </span>
              </span>
              </div> */



export default {
  code: types.Hash.code,
  description: types.Hash.description,
  class: types.Hash.class,

  Info: HashInfo,
  Builder: HashBuilder,
  Form: HashForm,
  Render: HashRender,
}


