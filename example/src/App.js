import React from 'react'

import { Schema, Types, Input } from '@fieldify/antd'

import { Row, Col, Card, Tabs, Tag } from 'antd';

import '@fieldify/antd/dist/index.css'
import "antd/dist/antd.css";

const {
  FieldifySchemaBuilder,
  FieldifySchema,
  FieldifySchemaForm
} = Schema

const { TabPane } = Tabs

class App extends React.Component {
  constructor(props) {
    super(props)

    const initial = {

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

    this.state = {
      schema: initial,

      form: {
        json: "",
        state: "Filling",
        color: "blue"
      },
      builder: {
        json: ""
      }
    }

    // compile the schema
    this.schema = new FieldifySchema("test")
    this.schema.compile(initial)

    // create an input instance
    this.input = new Input(this.schema)
    this.input.setValue({
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
    })
    this.state.builder.json = JSON.stringify(this.schema.export(), null, "  ")
    this.state.form.json = JSON.stringify(this.input.getValue(), null, "  ")
  }

  builderChanged(schema) {
    this.setState({
      builder: {
        json: JSON.stringify(schema, null, "  ")
      }
    })
  }

  formChanged(value) {
    // run the verifier on each change to 
    // get the status into the title
    this.input.verify((result) => {
      const state = {
        form: {
          ...this.state.form,
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
                  <FieldifySchemaBuilder schema={this.schema} onChange={this.builderChanged.bind(this)} />
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
                  <FieldifySchemaForm schema={this.schema} input={this.input} onChange={this.formChanged.bind(this)} />
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

              <Tabs defaultActiveKey="1">
                <TabPane tab="Verification Rendering" key="1">
                  {/* <FieldifySchemaBuilder schema={this.schema} /> */}
                </TabPane>
                <TabPane tab="Simple Rendering" key="2">
                  Coming soon
                </TabPane>
              </Tabs>


            </Card>
          </div>
        </Col>
      </Row>
    </div>
  }
}

export default App
