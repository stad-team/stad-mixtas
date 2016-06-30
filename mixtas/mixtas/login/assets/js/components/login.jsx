import React from 'react';
import ReactDOM from 'react-dom';

class Hello extends React.Component{
	render(){
		return (
			<div>
				<h1>
					Login
				</h1>
				<form>
				</form>
			</div>
		);
	}
}

ReactDOM.render(<Hello />, document.getElementById('react-login'));