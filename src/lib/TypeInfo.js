import { Component } from 'react';

export default class SignderivaTypeInfo extends Component {
  constructor(props) {
    super(props)
    this.props = props;
    if (props.match) this.path = props.match.path;
    this.state = {}
  }


  componentDidUpdate(prevProps, prevState) {
    const pNew = this.props.schema || {};
    const pOld = prevProps.schema || {};
    // console.log("SignderivaTypeInfo.update", pOld, pNew)
  }

}

