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

	altaMesa() {
		window.location = '/mesas';
	}

	render() {
		const { user, superUser, rol } = this.props;

		let	crearUsuarios = (
				<div>
					<button className="btn btn-warning btn-outline btn-lg" onClick={ this.usuarios }>
						CREAR  USUARIOS
					</button>
				</div>
			);

		let corteCaja = (
			<div>
				<button className="btn btn-warning btn-outline btn-lg" onClick={ this.corteCaja }>
					CORTE DE CAJA
				</button>
			</div>
		);

		let caja = (
			<div>
				<button className="btn btn-warning btn-outline btn-lg" onClick={ this.caja }>
					CAJA
				</button>
			</div>
		);

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
		} else if (superUser === 'True' || rol === 'admin') {
			return (
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
		} else if (rol === 'mesero') {
			window.location = '/pedidos/mesas';
		} else if (rol === 'cajero') {
			return (
				<div>
					<h1>
						<p className="bienvenida"> Bienvenido  { user } </p>
					</h1>
					<div className="options-buttons">
						{ caja }
						{ corteCaja }
						{ pedidos }
					</div>
				</div>
			);
		}
	}
}

const element = document.getElementById('react-menu');
const dataUser = element.getAttribute('data-user');
const dataRol = element.getAttribute('data-rol');
const superUser = element.getAttribute('data-super-user');

ReactDOM.render(
	<Menu user={ dataUser } superUser={ superUser } rol={ dataRol } />,
	document.getElementById('react-menu')
);
