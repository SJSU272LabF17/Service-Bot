import React, {Component} from 'react';
//import ChatBubble from 'react-chat-bubble';
import ChatBubble from './ChatBubble';
import * as API from '../api/API';
class Chatbot extends Component {

  func1(a,b){
    this.state.messages.push({
          "type" : a,
          "image": "favicon.ico",
          "text": b
      });
    this.setState({
      messages:this.state.messages
    });

    API.callChatbot({question:b})
        .then((res) => {
            console.log(res.resp);
            this.state.messages.push({
              "type":1,
              "image":"favicon.ico",
              "text":res.resp
            });
            this.setState({
              messages:this.state.messages
            });

        });
  }

  onInputChange(term){
   this.setState({term:term});
 }
  state={
    messages :
  [{
        "type" : 0,
        "image": "favicon.ico",
        "text": "Hello! Good Morning!"
    }, {
        "type": 1,
        "image": "favicon.ico",
        "text": "Hello! Good Afternoon!"
    },
    {
          "type" : 0,
          "image": "favicon.ico",
          "text": "Hello! Good Morning!"
      }, {
          "type": 1,
          "image": "favicon.ico",
          "text": "Hello! Good Afternoon!"
      }
  ],
  term:''
  }
  render() {
    return(
      <ChatBubble messages = {this.state.messages} onNewMessage={(newM)=>this.func1(0,newM)}/>
      )
  }
}
export default Chatbot;
