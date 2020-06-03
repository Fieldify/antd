import React from 'react'

import { Schema, Types, Input } from '@fieldify/antd'

import { Row, Col, Card, Tabs, Tag, Form, Radio, Divider } from 'antd';

import '@fieldify/antd/dist/index.css'
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
      company: {
        $doc: "Your company name",
        $type: "String",
        $position: 0
      },
      name: {
        $doc: "Civility",
        $type: "Name",
        $position: 1
      },

      email: {
        $doc: "Votre e-mail",
        $type: Types.Email,
        $position: 2
      },

      age: {
        $doc: "Age",
        $type: Types.Number,
        $position: 3
      },

      KV: {
        $doc: "Key and Value",
        $type: Types.KV,
        $position: 4
      },

      types: {
        $doc: 'What kind of number to accept',
        $required: true,
        $type: 'Select',
        $options: {
          default: 'both',
          items: {
            both: 'Both Integer & Float',
            integer: 'Only Integer',
            float: 'Only Float'
          }
        }
      },

      address: {
        $doc: "Address",
        home: {
          $doc: "Home",
          street: { $doc: "Street", $type: Types.String, $options: { min: 2, placeholder: "Your street" } },
          zip: { $doc: "ZIP", $type: Types.String },
          country: { $doc: "Country", $type: Types.String },
        },
        work: {
          $doc: "Work",
          street: { $doc: "Street", $type: Types.String },
          zip: { $doc: "ZIP", $type: Types.String },
          country: { $doc: "Country", $type: Types.String },
        },
      },

      nestedArray: [{
        $doc: "Array of Objects (nested)",
        name: {
          $doc: "Civility",
          $type: Types.Name,
          $position: 1
        },
        description: { $doc: "Description", $type: Types.String, $options: { strict: true } },
        price: { $doc: "Price", $type: Types.String },
        $array: {
          min: 2
        }
      }],

      inlinedArray: [{
        $required: true,
        $doc: "Array of User Defined types (non-nested)",
        $type: Types.Name,
        $options: { min: 2 },
        $array: {
          min: 2,
          max: 100
        }
      }],

      inlinedArrayString: [{
        $required: true,
        $doc: "Array of String type (non-nested)",
        $type: "String",
        $array: {
          min: 1,
          max: 100
        }
      }]
    }

    this.state = this.cycle({
      schema: initial,
      input: {
        company: "Test of the test",
        name: {
          first: "Michael",
          last: "Vergoz"
        },
        email: "mvcdsa@cdas.com",
        KV: {
          "testcas": "Awesome"
        },

        nestedArray: [{
          name: {
            first: "Michael",
            last: "Vergoz"
          },
          description: "This is a description"
        }],
        inlinedArray: [{ first: "Michael" }],

        inlinedArrayString: ['michael', 'vergoz', 'did', 'it', 'well']
      }
    }, true)
  }

  cycle(props, first) {
    const state = {
      schema: props.schema,
      input: props.input,

      form: {
        data: props.input,
        json: "",
        state: "Filling",
        color: "blue"
      },
      builder: {
        data: {},
        json: ""
      },
      render: {
        layout: "horizontal"
      }
    }

    // compile the schema
    state.schemaHandler = new FieldifySchema("test")
    state.schemaHandler.compile(state.schema)

    // create an input instance
    state.inputHandler = new Input(state.schemaHandler)
    state.inputHandler.setValue(state.input)

    state.builder.json = JSON.stringify(state.schemaHandler.export(), null, "  ")
    state.form.json = JSON.stringify(state.inputHandler.getValue(), null, "  ")

    return (state)
  }


  builderChanged(schema) {
    const state = {
      schema: this.state.schemaHandler.export(),
      builder: {},
      form: {
        data: this.state.inputHandler.getValue(),
        json: "",
        state: "Filling",
        color: "blue"
      },
    }

    // create an input instance
    state.inputHandler = new Input(this.state.schemaHandler)
    state.inputHandler.setValue(this.state.input)

    state.builder.json = JSON.stringify(this.state.schemaHandler.export(), null, "  ")
    state.form.json = JSON.stringify(this.state.inputHandler.getValue(), null, "  ")
    
    this.setState(state)
  }

  formChanged(value) {
    // run the verifier on each change to 
    // get the status into the title
    this.state.inputHandler.verify((result) => {

      const state = {
        form: {
          data: { ...value },
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
                  <FieldifySchemaBuilder schema={this.state.schemaHandler} onChange={this.builderChanged.bind(this)} />
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
                  {/* <FieldifySchemaForm schema={this.state.schemaHandler} input={this.state.inputHandler} onChange={this.formChanged.bind(this)} /> */}
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
                    onChange={({target}) => this.setState({ render: { layout: target.value } })}
                  >
                    <Radio.Button value="horizontal">Horizontal</Radio.Button>
                    <Radio.Button value="vertical">Vertical</Radio.Button>
                    <Radio.Button value="inline">Inline</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </Form>
              <Divider />
              {/* <FieldifySchemaRender schema={this.state.schemaHandler} input={this.state.form.data} layout={this.state.render.layout} /> */}
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  }
}

export default App
