import React, { Component } from 'react';
import RecycledComponent from 'react-recycling';

import {
  Col,
  Row,
  Form,
  Input
} from "antd";

export default class FieldifyTypeRender extends RecycledComponent {

  cycle(props) {
    const state = {
      schema: props.schema,
      value: props.value,
      injected: props.injected
    }

    return (state)
  }

  subRender(children) {

    if(this.state.injected === true) {
      return (
        <Form.Item
          label={this.state.schema.$doc}
          hasFeedback={true}
          validateStatus="success"
          style={{ marginBottom: "0px" }}
          wrapperCol={{ sm: 24 }}
        >
          {children}
        </Form.Item>
      )
    }
    return (
      <Form.Item
        label={this.state.schema.$doc}
        hasFeedback={true}
        validateStatus="success"
      >
        {children}
      </Form.Item>
    )
  }

  render() {
    return (this.subRender(
      <div style={{ width: "100%" }}>
        {this.state.value}
      </div>
    ));
  }
}

