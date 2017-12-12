import React, {Component} from 'react';
import { Route, withRouter } from 'react-router-dom';
import * as API from '../api/API';
import Login from "./Login";
import Message from "./Message";
import Welcome from "./Welcome";
import Chatbot from "./Chatbot";
import Graphs from "./Graphs";

class NewerHomePage extends Component {

    state = {
        isLoggedIn: false,
        message: '',
        username: ''
    };

    handleSubmit = (userdata) => {
        API.doLogin(userdata)
            .then((status) => {
                if (status === 201) {
                    this.setState({
                        isLoggedIn: true,
                        message: "Welcome to my App..!!",
                        username: userdata.username
                    });
                    this.props.history.push("/chatbot");
                } else if (status === 401) {
                    this.setState({
                        isLoggedIn: false,
                        message: "Wrong username or password. Try again..!!"
                    });
                }
            });
    };

    handleLogout = () => {
        console.log('logout called');
        API.logout()
            .then((status) => {
                if(status === 200){
                    this.setState({
                        isLoggedIn: false
                    });
                    this.props.history.push("/");
                }
            });
    };


    render() {
        return (
            <div className="container-fluid">
                <Route exact path="/" render={() => (
                    <div>
                        <Message message="You have landed on my App !!"/>
                        <button className="btn btn-success" onClick={() => {
                            this.props.history.push("/login");
                        }}>
                            Login
                        </button>
                    </div>
                )}/>

                <Route exact path="/login" render={() => (
                    <div>
                        <Login handleSubmit={this.handleSubmit}/>
                        <Message message={this.state.message}/>
                    </div>
                )}/>
                <Route exact path="/welcome" render={() => (
                    <Welcome handleLogout={this.handleLogout} username={this.state.username}/>
                )}/>
              <Route exact path="/chatbot" render={() => (
                  <div className="mainBodyChat" style={{width: "40%",marginLeft: "57%", border: "1px solid", borderColor: "#f1f1f1",bottom: 40,position: "fixed"}}>
                    <Chatbot/>
                    </div>
                )}/>

            </div>
        );
    }
}

export default withRouter(NewerHomePage);
