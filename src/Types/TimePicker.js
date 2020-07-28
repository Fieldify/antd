import { types } from 'fieldify'

import React from 'react';

import {
  Checkbox,
  Form,
  Tag,
  Input,
  Col,
  Row,
  TimePicker
} from "antd";

import { FieldTimeOutlined } from '@ant-design/icons';

import TypeForm from '../lib/TypeForm';
import TypeRender from '../lib/TypeRender';
import TypeInfo from '../lib/TypeInfo';
import TypeBuilder from '../lib/TypeBuilder';


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Rendering of the field
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class TimePickerForm extends TypeForm {
  render() {
    return (super.render(
      <TimePicker defaultValue={this.state.value} onChange={(date, dateString) => this.changeValue(dateString)} />
    ));
  }
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Information of the field
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class TimePickerInfo extends TypeInfo {
  render() {
    return (
      <span>
        <Tag color="#ad2102"><FieldTimeOutlined /></Tag>
      </span>
    )
  }
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Rendering of the field
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class TimePickerRender extends TypeRender {
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Complement builder
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class TimePickerBuilder extends TypeBuilder {
  constructor(props) {
    super(props)
    this.configure()
  }
}


export default {
  code: types.TimePicker.code,
  description: types.TimePicker.description,
  class: types.TimePicker.class,

  Info: TimePickerInfo,
  Builder: TimePickerBuilder,
  Form: TimePickerForm,
  Render: TimePickerRender
}