
import { types } from 'fieldify'

import React from 'react';

import {
  InputNumber,
  Form,
  Space,
  Tag,
  Input,
  Col,
  Row,
  Checkbox
} from "antd";

import { CheckSquareOutlined as Icon } from '@ant-design/icons';

import TypeForm from '../lib/TypeForm';
import TypeInfo from '../lib/TypeInfo';
import TypeBuilder from '../lib/TypeBuilder';
import TypeRender from '../lib/TypeRender';

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Rendering of the field in a form
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class CheckboxForm extends TypeForm {
  render() {
    return (super.render(
      <Checkbox
        checked={this.state.value}
        onChange={({ target }) => this.changeValue(target.checked)}
        style={{ width: "100%" }}
      >
        {this.state.options.placeholder}
      </Checkbox>
    ))
  }
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Information of the field show fancy information of the type
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class CheckboxInfo extends TypeInfo {
  render() {
    return (
      <span>
        <Tag color="#85144b" style={{ color: "white" }}><Icon /></Tag>
      </span>
    )
  }
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Rendering of the field
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class CheckboxRender extends TypeRender {
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Field builder
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class CheckboxBuilder extends TypeBuilder {
  constructor(props) {
    super(props)
    this.configure()
  }

}

export default {
  code: types.Checkbox.code,
  description: types.Checkbox.description,
  class: types.Checkbox.class,

  Info: CheckboxInfo,
  Builder: CheckboxBuilder,
  Form: CheckboxForm,
  Render: CheckboxRender,
}


