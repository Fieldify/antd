import React from 'react'


import { Schema, Types, Input, Version as faVersion } from '@fieldify/antd'

import { Checkbox, Space, Row, Col, Card, Tabs, Tag, Form, Radio, Divider, Layout } from 'antd';

import "antd/dist/antd.css";
import "./index.css";

import { fieldifyType, version as fVersion } from 'fieldify';

import logoIcon from './fieldify.png'

const {
  FieldifySchemaBuilder,
  FieldifySchema,
  FieldifySchemaForm,
  FieldifySchemaRender
} = Schema

const { TabPane } = Tabs

class App extends React.Component {
  constructor(props) {
    super(props)

    const initial = {
      // "fds": {
      //   "$type": "Hash",
      //   "$doc": "ffre",
      //   "$position": 0,
      //   "$options": {
      //     "mode": "sha512"
      //   },
      //   "$required": false,
      //   "$read": true,
      //   "$write": true
      // },
      "cdsacdsa": {
        "$type": "String",
        "$position": 0,
        "$options": {
          "placeholder": "cdsa",
          "help": "cdsa",
          "min": 321,
          "max": 32132
        },
        "$required": false,
        "$read": true,
        "$write": true
      },

      "DateTimePicker": {
        "$type": "DateTimePicker",
        "$doc": "DateTimePicker",
      },

      "DatePicker": {
        "$type": "DatePicker",
        "$doc": "DatePicker"
      },
      "DatePickerRange": {
        "$type": "DatePickerRange",
        "$doc": "DatePickerRange"
      },

      "TimePicker": {
        "$type": "TimePicker",
        "$doc": "TimePicker"
      },
      "TimePickerRange": {
        "$type": "TimePickerRange",
        "$doc": "TimePickerRange"
      },

      "lala": {
        "$type": "Radio",
        "$doc": "Radio description",
        "$position": 1,
        "$options": {
          "default": "1",
          "items": {
            "1": "Une cle",
            "2": "2 Cle",
            "3": "key 3"
          },
          "horizontal": true
        }
      }
    }

    this.state = this.cycle({
      schema: initial,
      input: {}
    }, true)

  }

  cycle(props, first) {

    const state = {
      schema: props.schema,
      input: props.input,
      inputRender: { ...props.input },

      selector: {
        builder: true,
        form: false,
        rendered: false,
      },
      form: {
        layout: "horizontal",
        json: JSON.stringify(props.input, null, "  "),
        state: "Filling",
        color: "blue"
      },
      builder: {
        json: JSON.stringify(props.schema, null, "  ")
      },
      render: {
        layout: "horizontal"
      }
    }

    return (state)
  }


  builderChanged(schema) {
    const state = {
      schema: schema,
      builder: {
        json: JSON.stringify(schema, null, "  ")
      }
    }

    this.setState(state)
  }

  formChanged(input, value) {
    // run the verifier on each change to 
    // get the status into the title

    input.verify((result) => {

      const state = {
        inputRender: { ...result.result },
        form: {
          layout: this.state.form.layout,
          data: result.result,
          json: JSON.stringify(value, null, "  ")
        }
      }

      if (result.error === true) {
        state.form.color = "orange"
        state.form.state = "Verify Failed"
      }
      else {
        state.form.color = "green"
        state.form.state = "Passed"
      }

      this.setState(state)
    })
  }

  selector(key, value) {
    const res = { ...this.state.selector }
    res[key] = value
    this.setState({ selector: res })
  }

  render() {
    const style = { padding: '8px', };

    return <Layout style={{ margin: '0 auto', padding: 10}}>
      <Row>
        <h1><img src={logoIcon} width={40}/> @fieldify/antd</h1>
      </Row>

      <Row>
        <small><a href="https://github.com/mykiimike/fieldify">Fieldify Engine</a> v{fVersion} / <a href="https://github.com/Fieldify/antd">Fieldify For antd</a> v{faVersion}</small>
      </Row>

      <Row>
        <div>
          <Checkbox checked={this.state.selector.builder} onChange={({ target }) => this.selector("builder", target.checked)}>Show builder</Checkbox>
          <Checkbox checked={this.state.selector.form} onChange={({ target }) => this.selector("form", target.checked)}>Show form</Checkbox>
          <Checkbox checked={this.state.selector.rendered} onChange={({ target }) => this.selector("rendered", target.checked)}>Show rendered</Checkbox>
        </div>
      </Row>

      <Row>

        {this.state.selector.builder === true ?
          <Col sm={12} xxl={8}>
            <div style={style}>
              <Card size="small" title="Pass #1 - Building">
                <Tabs defaultActiveKey="1">
                  <TabPane tab="Visual Editor" key="1">
                    <FieldifySchemaBuilder schema={this.state.schema} onChange={this.builderChanged.bind(this)} />
                  </TabPane>
                  <TabPane tab="JSON Schema" key="2">
                    <pre>
                      {this.state.builder.json}
                    </pre>
                  </TabPane>
                </Tabs>
              </Card>
            </div>
          </Col>
          : null}

        {this.state.selector.form === true ?
          <Col sm={12} xxl={8}>
            <div style={style}>
              <Card size="small" title={<>Pass #2 - Filling Form <Tag color={this.state.form.color}>{this.state.form.state}</Tag></>}>
                <Tabs defaultActiveKey="1">
                  <TabPane tab="Visual Rendering" key="1">
                    <Form>
                      <Form.Item label="Form Layout" name="layout">
                        <Radio.Group
                          value={this.state.form.layout}
                          onChange={({ target }) => {
                            this.setState({ form: { ...this.state.form, layout: target.value } })
                          }}
                        >
                          <Radio.Button value="horizontal">Horizontal</Radio.Button>
                          <Radio.Button value="vertical">Vertical</Radio.Button>
                          <Radio.Button value="inline">Inline</Radio.Button>
                        </Radio.Group>
                      </Form.Item>
                    </Form>
                    <Divider />
                    <FieldifySchemaForm schema={this.state.schema} input={this.state.input} layout={this.state.form.layout} onChange={this.formChanged.bind(this)} />
                  </TabPane>
                  <TabPane tab="Sanatized JSON Input" key="2">
                    <pre>
                      {this.state.form.json}
                    </pre>
                  </TabPane>
                </Tabs>
              </Card>
            </div>
          </Col>
          : null}

        {this.state.selector.rendered === true ?
          <Col sm={12} xxl={8}>
            <div style={style}>
              <Card size="small" title="Pass #3 - Final Result">
                <Form>
                  <Form.Item label="Form Layout" name="layout">
                    <Radio.Group
                      value={this.state.render.layout}
                      onChange={({ target }) => this.setState({ render: { layout: target.value } })}
                    >
                      <Radio.Button value="horizontal">Horizontal</Radio.Button>
                      <Radio.Button value="vertical">Vertical</Radio.Button>
                      <Radio.Button value="inline">Inline</Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                </Form>
                <Divider />
                <FieldifySchemaRender schema={this.state.schema} input={this.state.inputRender} layout={this.state.render.layout} />
              </Card>
            </div>
          </Col>
          : null}

      </Row>
    </Layout >
  }
}

export default App
