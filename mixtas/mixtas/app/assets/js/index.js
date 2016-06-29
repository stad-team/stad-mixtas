import React from 'react';
import ReactDOM from 'react-dom';

class Hello extends React.Component{
	render(){
		return (
			<h1>
				Hello, React Component!! Canin hola
			</h1>
		);
	}
}

ReactDOM.render(<Hello />, document.getElementById('react-app'));


// Option 2
// var React = require('react')
// var ReactDOM = require('react-dom')

// var Hello = React.createClass ({
//     render: function() {
//         return (
//             <h1>
//             Hello, React!!!
//             </h1>
//         )
//     }
// })

// ReactDOM.render(<Hello />, document.getElementById('container'))