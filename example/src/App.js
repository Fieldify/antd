import React from 'react'

import { Schema, Types, Input } from '@fieldify/antd'

import { Row, Col, Card } from 'antd';

import '@fieldify/antd/dist/index.css'
import "antd/dist/antd.css";

const { 
  FieldifySchemaBuilder, 
  FieldifySchema, 
  FieldifySchemaForm 
} = Schema

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
      }]
    }

    this.state = { schema: initial }

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

      // nestedArray: [{
      //   name: {
      //     first: "Michael",
      //     last: "Vergoz"
      //   },
      //   description: "Un test"
      // }],

      // inlinedArray: ['michael', 'vergoz', 'did', 'it', 'well']
      // inlinedArray: [{first: "Michael"}]
    })
  }

  render() {
    const style = { padding: '8px' };

    return <div style={{ width: "100%" }}>
      <h1>Welcome in @fieldify/antd</h1>
      <h2>Schema Builder</h2>

      <Row>
        <Col span={8}>
          <div style={style}>
            <Card size="small" title="Builder">
              <FieldifySchemaBuilder schema={this.schema} />
            </Card>
          </div>
        </Col>
        <Col span={8}>
          <div style={style}>
            <Card size="small" title="Form">
              <FieldifySchemaForm schema={this.schema} input={this.input} verify={false}/>
            </Card>
          </div>
        </Col>
        <Col span={8}>
          <div style={style}>
            <Card size="small" title="Rendering">
              {/* <FieldifySchemaBuilder schema={this.schema} /> */}
            </Card>
          </div>
        </Col>
      </Row>

      <h2>Email</h2>
    </div>
  }
}

export default App
