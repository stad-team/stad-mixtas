import React from 'react';
import ReactDOM from 'react-dom';

class LevantarOrden extends React.Component {
	render() {
		const { orden } = this.props;

		return (
			<div>
				Componente levantar orden
				<div>
					{ orden }
				</div>
			</div>
		);
	}
}

class OrdenPersonal extends React.Component {

	enviarOrden() {
		const { ordenCompuesta, listaOrdenes } = this.props;

		alert(listaOrdenes);
	}

	render() {
		const { ordenCompuesta, listaOrdenes } = this.props;

		let ordenes = listaOrdenes.map((orden, index) => {
			return (
				<p className='plato' key={index}>
					{ orden + ` - orden numero ${index}` }
				</p>

			);
		});

		return (
			<div>
				<div className="platillox">
					{ ordenCompuesta }
				</div>
				<div className='order-list'>
				<h3>  Ordenes</h3>
				<hr />
				{ ordenes }
				</div>

				<div>
					<button className='btn btn-success' onClick={ this.enviarOrden.bind(this) }>
						FINALIZAR ORDEN
					</button>
				</div>

			</div>
		);
	}
}

class Simbolos extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			ordenCompuesta: '',
			ordenLista: false,
			listaOrdenes: []
		};

	}
	mitad() {
		const simboloMitad = '/';
		this.setState({
			ordenCompuesta: this.state.ordenCompuesta + simboloMitad,
			ordenLista: false
		});
	}

	dosPlatos() {
		const simboloPlatos = '1/2';
		this.setState({
			ordenCompuesta: this.state.ordenCompuesta + simboloPlatos,
			ordenLista: false
		});
	}

	ahogada() {
		const simboloAhogada = 'Ahogada';
		this.setState({
			ordenCompuesta: this.state.ordenCompuesta + simboloAhogada,
			ordenLista: false
		});
	}

	sin() {
		const simboloSin = 'Sin';
		this.setState({
			ordenCompuesta: this.state.ordenCompuesta + simboloSin,
			ordenLista: false
		});
	}

	con() {
		const simboloCon = 'Con';
		this.setState({
			ordenCompuesta: this.state.ordenCompuesta + simboloCon,
			ordenLista: false
		});
	}

	extra() {
		const simboloExtra = 'Extra';
		this.setState({
			ordenCompuesta: this.state.ordenCompuesta + simboloExtra,
			ordenLista: false
		});
	}

	agregarOrden() {
		const { ordenCompuesta } = this.props;

		this.setState({
			listaOrdenes: this.state.listaOrdenes.concat(this.state.ordenCompuesta),
			ordenCompuesta: ''
		});
	}

	render() {
		const mitad = (
			<button className='btn simbols btn-primary ' onClick={ this.mitad.bind(this) }>
				/
			</button>
		);

		const dosPlatos = (
			<button className='btn simbols btn-info' onClick={ this.dosPlatos.bind(this) }>
				1/2
			</button>
		);

		const ahogada = (
			<button className='btn simbols btn-warning' onClick={ this.ahogada.bind(this) }>
				Ahogada
			</button>
		);

		const sin = (
			<button className='btn simbols btn-danger' onClick={ this.sin.bind(this) }>
				Sin
			</button>
		);

		const con = (
			<button className='btn simbols btn-con' onClick={ this.con.bind(this) }>
				Con
			</button>
		);

		const extra = (
			<button className='btn simbols btn-extra' onClick={ this.extra.bind(this) }>
				Extra
			</button>
		);


		return (
			<div>
				<div className='simbology'>
					<h3> Simbología </h3>
					{ mitad }
					{ dosPlatos }
					{ ahogada }
					{ sin }
					{ con }
					{ extra }
				</div>

				<button  className='btn btn-success btn-lg' onClick={ this.agregarOrden.bind(this) }>
					Agregar Plato
				</button>
				<OrdenPersonal ordenCompuesta={ this.state.ordenCompuesta } listaOrdenes={ this.state.listaOrdenes }/>

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
			<div className='container'>
				<div className='col-md-6'>
					<h1> Bienvenido a Pedidos </h1>

					{ <Simbolos /> }

					{ <LevantarOrden />}
				</div>
				<div className='col-md-6'>
					{ <Platillos /> }
				</div>

			</div>
		);
	}
}

const element = document.getElementById('pedidos');

ReactDOM.render(
	<Pedidos />,
	element
);