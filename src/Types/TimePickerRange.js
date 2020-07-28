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

const { RangePicker } = TimePicker;

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Rendering of the field
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class TimePickerRangeForm extends TypeForm {
  render() {
    return (super.render(
      <RangePicker onChange={(date, dateString) => {
        if(date) {
          const res = {
            from: dateString[0],
            to: dateString[1],
          }
          this.changeValue(res);
        }
        else {
          const res = {
            from: null,
            to: null,
          }
          this.changeValue(res);
        }
      }} />
    ));
  }
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Information of the field
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class TimePickerRangeInfo extends TypeInfo {
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
class TimePickerRangeRender extends TypeRender {
  render() {
    return (this.subRender(
      <div style={{ width: "100%" }}>
        {typeof this.state.value === "object" ? 
          `${this.state.value.from} - ${this.state.value.to}` : `-`}
      </div>
    ));
  }
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Complement builder
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class TimePickerRangeBuilder extends TypeBuilder {
  constructor(props) {
    super(props)
    this.configure()
  }
}


export default {
  code: types.TimePickerRange.code,
  description: types.TimePickerRange.description,
  class: types.TimePickerRange.class,

  Info: TimePickerRangeInfo,
  Builder: TimePickerRangeBuilder,
  Form: TimePickerRangeForm,
  Render: TimePickerRangeRender
}