import React from 'react';
import ReactDOM from 'react-dom';

class OrdenPersonal extends React.Component {
	render() {
		const { ordenCompuesta } = this.props;

		return (
			<div>
				{ ordenCompuesta }
			</div>
		);
	}
}

class Simbolos extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			ordenCompuesta: ''
		};

	}
	mitad() {
		const simboloMitad = '/';
		this.setState({
			ordenCompuesta: this.state.ordenCompuesta + simboloMitad
		});
	}

	dosPlatos() {
		const simboloPlatos = '1/2';
		this.setState({
			ordenCompuesta: this.state.ordenCompuesta + simboloPlatos
		});
	}

	ahogada() {
		const simboloAhogada = 'Ahogada';
		this.setState({
			ordenCompuesta: this.state.ordenCompuesta + simboloAhogada
		});
	}

	sin() {
		const simboloSin = 'Ahogada';
		this.setState({
			ordenCompuesta: this.state.ordenCompuesta + simboloSin
		});
	}

	con() {
		const simboloCon = 'Ahogada';
		this.setState({
			ordenCompuesta: this.state.ordenCompuesta + simboloCon
		});
	}

	extra() {
		const simboloExtra = 'Ahogada';
		this.setState({
			ordenCompuesta: this.state.ordenCompuesta + simboloExtra
		});
	}

	render() {
		const mitad = (
			<button onClick={ this.mitad.bind(this) }>
				/
			</button>
		);

		const dosPlatos = (
			<button onClick={ this.dosPlatos.bind(this) }>
				1/2
			</button>
		);

		const ahogada = (
			<button onClick={ this.ahogada.bind(this) }>
				Ahogada
			</button>
		);

		const sin = (
			<button onClick={ this.sin.bind(this) }>
				Sin
			</button>
		);

		const con = (
			<button onClick={ this.con.bind(this) }>
				Con
			</button>
		);

		const extra = (
			<button onClick={ this.extra.bind(this) }>
				Extra
			</button>
		);

		return (
			<div>
				{ mitad }
				{ dosPlatos }
				{ ahogada }
				{ sin }
				{ con }
				{ extra }

				<OrdenPersonal ordenCompuesta={ this.state.ordenCompuesta }/>
			</div>
		);
	}
}

class LevantarOrden extends React.Component {
	render() {
		return (
			<div>
				Componente levantar orden
			</div>
		);
	}
}


class Platillos extends React.Component {
	render() {
		return (
			<div>
				<h1>Platillos</h1>
				<h3>Entradas</h3>

				<table>
					<tbody>
					  <tr>
					    <td>Orden de choriqueso</td>
					  </tr>
					  <tr>
					    <td>Orden de Nopales</td>
					  </tr>
					  <tr>
					    <td>Orden de Guacamole</td>
					  </tr>
					</tbody>
				</table>
			</div>
		);
	}
}

class Pedidos extends React.Component {
	render() {

		return (
			<div>
				Bienvenido a Pedidos

				<p> Simbología </p>
				{ <Simbolos /> }

				<hr />
				{ <LevantarOrden /> }

				{ <Platillos /> }
			</div>
		);
	}
}

const element = document.getElementById('pedidos');

ReactDOM.render(
	<Pedidos />,
	element
);