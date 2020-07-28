import { types } from 'fieldify'

import React from 'react';

import {
  Checkbox,
  Form,
  Tag,
  Input,
  Col,
  Row,
  DatePicker
} from "antd";

import { FieldTimeOutlined } from '@ant-design/icons';

import TypeForm from '../lib/TypeForm';
import TypeRender from '../lib/TypeRender';
import TypeInfo from '../lib/TypeInfo';
import TypeBuilder from '../lib/TypeBuilder';

const { RangePicker } = DatePicker;

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Rendering of the field
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class DatePickerRangeForm extends TypeForm {
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
class DatePickerRangeInfo extends TypeInfo {
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
class DatePickerRangeRender extends TypeRender {
  render() {
    return (this.subRender(
      <div style={{ width: "100%" }}>
        {typeof this.state.value === "object" && this.state.value.from && this.state.value.to ? 
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
class DatePickerRangeBuilder extends TypeBuilder {
  constructor(props) {
    super(props)
    this.configure()
  }
}


export default {
  code: types.DatePickerRange.code,
  description: types.DatePickerRange.description,
  class: types.DatePickerRange.class,

  Info: DatePickerRangeInfo,
  Builder: DatePickerRangeBuilder,
  Form: DatePickerRangeForm,
  Render: DatePickerRangeRender
}