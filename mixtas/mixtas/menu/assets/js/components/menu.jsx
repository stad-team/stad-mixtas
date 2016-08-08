import React from 'react';
import ReactDOM from 'react-dom';

class Menu extends React.Component {

	constructor(props) {
		super(props);

		window.resizeTo(screen.availWidth, screen.availHeight);

		window.moveTo(0,0);
	}

	pedidos() {
		window.location = '/pedidos/mesas';
	}

	usuarios() {
		window.location = '/usuarios';
	}

	caja() {
		window.location = '/caja';
	}

	corteCaja() {
		window.location = '/caja/corte-caja';
	}

	render() {
		const { user, superUser } = this.props;

		let crearUsuarios = undefined;
		if (superUser === 'True') {
			crearUsuarios = (
				<div>
					<button className="btn btn-warning btn-outline btn-lg" onClick={ this.usuarios }>
						CREAR  USUARIOS
					</button>
				</div>
			);
		}

		let corteCaja = undefined;
		if (superUser === 'True') {
			corteCaja = (
				<div>
					<button className="btn btn-warning btn-outline btn-lg" onClick={ this.corteCaja }>
						CORTE DE CAJA
					</button>
				</div>
			);
		}

		let caja = undefined;
		if (superUser === 'True') {
			caja = (
				<div>
					<button className="btn btn-warning btn-outline btn-lg" onClick={ this.caja }>
						CAJA
					</button>
				</div>
			);
		}

		let pedidos = (
				<div>
					<button className="btn btn-warning btn-outline btn-lg" onClick={ this.pedidos }>
						ALTA DE PEDIDOS
					</button>
				</div>
			);

		let altaMesa = (
				<div>
					<button className="btn btn-warning btn-outline btn-lg" onClick={ this.altaMesa }>
						ALTA DE MESA
					</button>
				</div>
			);

		let miMenu = (
				<div>
					<button className="btn btn-warning btn-outline btn-lg" onClick={ this.miMenu }>
						MI MENU
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
					<div className="options-buttons">
						{ crearUsuarios }
						{ pedidos }
						{ caja }
						{ corteCaja }
						{ altaMesa }
						{ miMenu }
					</div>
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
