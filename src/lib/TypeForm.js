import React, { Component } from 'react';
import {
  Col,
  Row,
  Form
} from "antd";

export default class FieldifyTypeForm extends Component {
  constructor(props) {
    super(props)
    this.state = this.cycle(props)

    if (props.verify === true) {
      this.verify(props.value, (ret) => {
        this.state = { ...this.state, ...ret }
      })
    }
  }


  componentDidUpdate(props, state) {
    if (this.props !== props) {
      const cycle = this.cycle(this.props);

      // // verify information
      // if (cycle.verify === true) {
      //   this.changeValue(cycle.value, 50)

      // }

      this.setState(cycle)
    }
  }

  cycle(props) {
    this.schema = props.schema;

    const state = {
      value: props.value,
      verify: props.verify,
      feedback: false,
      status: null,
      help: this.schema.$help
    }

    this.isInjected = props.isInjected;

    this.onChanged = props.onChange ? props.onChange : () => { };
    this.onError = props.onError ? props.onError : () => { };

    if (!this.schema) return (state)

    state.options = this.schema.$options || {};
    this.handler = this.schema.$_type;

    return (state)
  }

  timedChange(cb, speed) {
    if (this._changeTimer) {
      this._changeTimerQueue++;
      this._changeTimerCb = cb;
      return;
    }

    cb = cb || this._changeTimerCb;
    if (!cb) return;

    delete this._changeTimerCb;
    this._changeTimerQueue = 0;
    this._changeTimer = setTimeout(() => {
      cb(() => {
        delete this._changeTimer;

        // update in queue ?
        if (this._changeTimerQueue > 0) {
          this.timedChange(cb, speed);
        }
      })
    }, speed)
  }

  changeValue(value, speed) {
    speed = speed || 500;

    this.setState({
      value: value
    })

    this._lastValue = value;

    this.timedChange((end) => {
      this.verify(this._lastValue, (ret) => {
        this.setState(ret);

        if (ret.error !== "success") {
          end();
          return;
        }

        this.onChanged(value);
        end();
      })
    }, speed)
  }

  verify(value, cb) {
    this.handler.verify(value, (error, message) => {
      if (error === false) {
        this.onError(false);
        return (cb({
          status: "success",
          feedback: true,
          help: null
        }));
      }

      
      this.onError(true, message);
      return (cb({
        status: "error",
        feedback: true,
        help: message
      }))
    })
  }


  render(children) {
    // return(children)

    if (!this.schema || this.isInjected === true) return (
      <Form.Item
        label={this.schema.$doc}
        required={this.schema.$required}
        validateStatus={this.state.status}
        hasFeedback={this.state.feedback}
        help={this.state.help}
        style={{ marginBottom: "0px" }}
        wrapperCol={{ sm: 24 }}
      >
        {children}
      </Form.Item>
    )

    return (
      <Form.Item
        label={this.schema.$doc}
        required={this.schema.$required}
        validateStatus={this.state.status}
        hasFeedback={this.state.feedback}
        help={this.state.help}
        style={{ marginBottom: "8px" }}
        wrapperCol={{ sm: 24 }}
      >
        {children}
      </Form.Item>
    )
  }
}

