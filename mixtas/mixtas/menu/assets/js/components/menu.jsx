import React from 'react';
import ReactDOM from 'react-dom';

class Menu extends React.Component {

	constructor(props) {
		super(props);

		window.resizeTo(screen.availWidth, screen.availHeight);

		window.moveTo(0,0);
	}

	pedidos() {
		window.location = '/pedidos';
	}

	render() {
		const { user, superUser } = this.props;

		let crearUsuarios = undefined;
		if (superUser === 'True') {
			crearUsuarios = (
				<div>
					Creación de Usuarios
				</div>
			);
		}

		let pedidos = (
				<div>
					<button className="crear-usr-btn btn-primary btn-outline btn-lg" onClick={ this.pedidos }>
						Pedidos
					</button>
				</div>
			);

		if (user === 'AnonymousUser') {
			window.location = '/auth/login';
			return <div> Acceso Denegado </div>;
		} else {
			return(
				<div>
					<h1>
						<p className="bienvenida"> Bienvenido  { user }</p>
					</h1>
					<div className="crear-usr-btn btn btn-primary btn-outline btn-lg">
						{ crearUsuarios }
					</div>
					{ pedidos }
				</div>
			);
		}
	}
}

const element = document.getElementById('react-menu');
const user = element.getAttribute('data-user');
const superUser = element.getAttribute('super-user');

ReactDOM.render(
	<Menu user={ user } superUser={ superUser } />,
	document.getElementById('react-menu')
);