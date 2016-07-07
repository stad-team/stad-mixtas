import React from 'react';
import ReactDOM from 'react-dom';

class Simbolos extends React.Component {
	mitad() {
		alert('mitad');
	}

	dosPlatos() {
		alert('dos platos');
	}

	ahogada() {
		alert('ahogada');
	}

	render() {
		const mitad = (
			<button onClick={ this.mitad }>
				/
			</button>
		);

		const dosPlatos = (
			<button onClick={ this.dosPlatos }>
				1/2
			</button>
		);

		const ahogada = (
			<button onClick={ this.ahogada }>
				Ahogada
			</button>
		);

		const sin = (
			<button onClick={ this.sin }>
				Sin
			</button>
		);

		const con = (
			<button onClick={ this.con }>
				Con
			</button>
		);

		const extra = (
			<button onClick={ this.extra }>
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

class Pedidos extends React.Component {
	render() {

		return (
			<div>
				Bienvenido a Pedidos

				<p> Simbología </p>
				{ <Simbolos /> }

				<hr />
				{ <LevantarOrden /> }
			</div>
		);
	}
}

const element = document.getElementById('pedidos');

ReactDOM.render(
	<Pedidos />,
	element
);