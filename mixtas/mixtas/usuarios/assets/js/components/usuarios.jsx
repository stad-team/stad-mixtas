import React from 'react';
import ReactDOM from 'react-dom';

class Usuarios extends React.Component {

	render() {
		return (
			<div>
				<h1>
					Creación de Usuarios
				</h1>
			</div>
		);
	}
}

const element = document.getElementById('react-usuarios');
const user = element.getAttribute('data-user');
const superUser = element.getAttribute('super-user');

ReactDOM.render(
	<Usuarios user={ user } superUser={ superUser } />,
	element
);