import React from 'react'


import { Schema, Types, Input } from '@fieldify/antd'

import { Row, Col, Card, Tabs, Tag, Form, Radio, Divider } from 'antd';

import "antd/dist/antd.css";

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
        "$position": 32,
        "$options": {
          "placeholder": "cdsa",
          "help": "cdsa",
          "min": 321,
          "max": 32132
        }
      },
      // "checkbox": {
      //   "$type": "Checkbox",
      //   "$doc": "Ceci est une case a cocher"
      // }
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

  render() {
    const style = { padding: '8px' };

    return <div style={{ width: "100%" }}>
      <h1>Welcome in @fieldify/antd</h1>
      <h2>Schema Builder</h2>

      <Row>
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
        <Col sm={12} xxl={8}>
          <div style={style}>
            <Card size="small" title={<>Pass #2 - Filling Form <Tag color={this.state.form.color}>{this.state.form.state}</Tag></>}>
              <Tabs defaultActiveKey="1">
                <TabPane tab="Visual Rendering" key="1">
                  <Form>
                    <Form.Item label="Form Layout" name="layout">
                      <Radio.Group
                        value={this.state.form.layout}
                        onChange={({ target }) => this.setState({ form: { ...this.state.form, layout: target.value } })}
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
      </Row>
    </div>
  }
}

export default App
