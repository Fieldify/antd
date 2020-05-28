import { Component } from 'react';

export default class SignderivaTypeBuilder extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.onChange = props.onChange ? props.onChange : () => { };

    if (props.match) this.path = props.match.path;

    this.state = { ...props.options };

    this.default = {};
  }

  componentDidUpdate(prevProps, prevState) {
    const pNew = this.props.options || {};
    const pOld = prevProps.options || {};
    
    var changed = 0;
    for (var key in this.default) {
      const o = pOld[key];
      const n = pNew[key];
      if (o !== n)
        changed++;
    }

    // console.log("TypeBuilder.update", changed, pOld, pNew)
    if (changed > 0) {
      this.setState(pNew);
      this.onChange({...pNew});
    }
    
  }

  setup(prev) {
    // console.log("setup")
    const state = { ...prev };

    // clean non valid field
    for (var a in state) {
      const p = this.default[a];
      if (!p) delete state[a]
    }

    // setup default
    for (var a in this.default) {
      if (!(a in state))
        state[a] = this.default[a];
    }
    return (state);
  }

  configure() {
    this.state = this.setup(this.state);
    this.onChange({ ...this.state });
  }

  changeIt(key, value) {
    const change = Object.assign({}, this.state);
    change[key] = value;

    // console.log("TypeBuilder", change)
    this.setState(change);
    this.onChange({...change});
  }

}
