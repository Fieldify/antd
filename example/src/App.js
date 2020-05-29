import React from 'react'

import { Schema, Types, Input } from '@fieldify/antd'

import { Row, Col, Card, Tabs } from 'antd';

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
        $type: Types.Name,
        $position: 1
      },

      email: {
        $doc: "Votre e-mail",
        $type: Types.Email,
        $position: 2
      },

      address: {
        $doc: "Address",
        home: {
          $doc: "Home",
          street: { $doc: "Street", $type: Types.String, $options: { min: 2 } },
          zip: { $doc: "ZIP", $type: Types.String },
          country: { $doc: "Country", $type: Types.String },
        },
        work: {
          $doc: "Work",
          street: { $doc: "Street", $type: Types.String },
          zip: { $doc: "ZIP", $type: Types.String },
          country: { $doc: "Country", $type: Types.String },
        }
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
        $type: Types.String,
        $array: {
          min: 1,
          max: 100
        }
      }]
    }

    this.state = { 
      schema: initial,
      formJSON: ""
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

      nestedArray: [{
        name: {
          first: "Michael",
          last: "Vergoz"
        },
        description: "Un test"
      }],

      
      inlinedArray: [{first: "Michael"}],

      inlinedArrayString: ['michael', 'vergoz', 'did', 'it', 'well']
    })
    this.state.formJSON = JSON.stringify(this.input.getValue(), null, "  ")
  }

  formChanged(value) {
    this.setState({
      formJSON: JSON.stringify(value, null, "  ")
    })
    console.log("Form changed", value)
  }

  render() {
    const style = { padding: '8px' };

    return <div style={{ width: "100%" }}>
      <h1>Welcome in @fieldify/antd</h1>
      <h2>Schema Builder</h2>

      <Row>
        <Col span={8}>
          <div style={style}>
            <Card size="small" title="Pass #1 - Building">
              <Tabs defaultActiveKey="1">
                <TabPane tab="Visual Editor" key="1">
                  <FieldifySchemaBuilder schema={this.schema} />
                </TabPane>
                <TabPane tab="JSON Schema" key="2">
                  Coming soon
                </TabPane>
              </Tabs>
            </Card>
          </div>
        </Col>
        <Col span={8}>
          <div style={style}>
            <Card size="small" title="Pass #2 - Filling Form">
              <Tabs defaultActiveKey="1">
                <TabPane tab="Visual Rendering" key="1">
                  <FieldifySchemaForm schema={this.schema} input={this.input} onChange={this.formChanged.bind(this)}/>
                </TabPane>
                <TabPane tab="Sanatized Input" key="2">
                  <pre>
                    {this.state.formJSON}
                  </pre>
                </TabPane>
              </Tabs>
            </Card>
          </div>
        </Col>
        <Col span={8}>
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

      <h2>Email</h2>
    </div>
  }
}

export default App
