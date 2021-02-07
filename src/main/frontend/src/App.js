import React, {Component} from 'react';
import RulesView from "./components/RulesView";

class App extends Component {

    state = {rules: []};



    render() {
        return (
            <div className="App">
                <RulesView/>
            </div>
        );
    }
}

export default App;
