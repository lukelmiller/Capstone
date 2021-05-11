import React, { Component } from 'react';
import './ToastMessage.css';

class ToastMessage extends Component {
    constructor(props) {
        super(props);
        this.state = { toastMessage: '', toastStyle : {
            width: '0%',
            height: '12%'
        }}
    }

setToastStyle(style) {
    this.setState({ toastStyle: style });
    clearInterval(this.start);
}

openToast = (message) => {
    const toastStyle = { width : '17%', height: '12%' };
    this.setState({ toastStyle, toastMessage: message });
    this.closeToast();
}

closeToast = () => {
    this.start = setInterval(() => {
      const toastStyle = { width : '0%', height: '12%' };
      this.setToastStyle(toastStyle);
    }, 3000); 
}

render() {
    return (
    <div className="toast" style={this.state.toastStyle}>
      <textarea defaultValue={this.state.toastMessage} className="toast-message"/>
    </div>
    );
  }
}

export default ToastMessage;