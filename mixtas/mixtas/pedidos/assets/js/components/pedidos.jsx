import React from 'react';
import ReactDOM from 'react-dom';

class LevantarOrden extends React.Component {
	render() {
		const { orden } = this.props;

		return (
				<div>
					{ orden }
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
					<button className='btn btn-success btn-fin' onClick={ this.enviarOrden.bind(this) }>
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
	setSinbolo(simbo) {
		this.setState({
			ordenCompuesta: this.state.ordenCompuesta + simbo,
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

			<button className='btn simbols btn-primary ' onClick={ this.setSinbolo.bind(this, '/') }>
				/
			</button>
		);

		const dosPlatos = (
			<button className='btn simbols btn-info' onClick={ this.setSinbolo.bind(this, '1/2') }>
				1/2
			</button>
		);

		const ahogada = (
			<button className='btn simbols btn-warning' onClick={ this.setSinbolo.bind(this, 'ahogada') }>
				Ahogada
			</button>
		);

		const sin = (
			<button className='btn simbols btn-danger' onClick={ this.setSinbolo.bind(this, 'sin') }>
				Sin
			</button>
		);

		const con = (
			<button className='btn simbols btn-con' onClick={ this.setSinbolo.bind(this, 'con') }>
				Con
			</button>
		);

		const extra = (
			<button className='btn simbols btn-extra' onClick={ this.setSinbolo.bind(this, 'Extra') }>
				Extra
			</button>
		);


		return (
			<div>
				<div className='simbology'>
					{ mitad }
					{ dosPlatos }
					{ ahogada }
					{ sin }
					{ con }
					{ extra }
					<button  className='mas btn btn-success btn-lg' onClick={ this.agregarOrden.bind(this) }>
						+
					</button>
				</div>

				<OrdenPersonal ordenCompuesta={ this.state.ordenCompuesta } listaOrdenes={ this.state.listaOrdenes }/>

			</div>
		);
	}
}



class Platillos extends React.Component {
	render() {
		return (

		<div className='menus'>
			<div className='dropdown'>
	            <a id='dLabel' role='button' data-toggle='dropdown' className='btn btn-primary' data-target='#' href='#'>
	                Entradas <span className='caret'></span>
	            </a>
	    		<ul className='dropdown-menu multi-level' role='menu' aria-labelledby='dropdownMenu'>
	    			<li><a href='#'>Choriqueso</a></li>
	    			<li className='divider'></li>
	    			<li><a href='#'>Nopales</a></li>
	    			<li className='divider'></li>
	                <li><a href='#'>Guacamole</a></li>
	                <li className='divider'></li>
	                <li><a href='#'>Cebollitas</a></li>
	                <li className='divider'></li>
	                <li><a href='#'>Frijoles Charros</a></li>
	                <li className='divider'></li>
	                <li><a href='#'>Papa "El costeño"</a></li>
	                <li className='divider'></li>
	                <li><a href='#'>Chuy</a></li>
	                <li className='divider'></li>
	                <li><a href='#'>Chenchitos</a></li>
	            </ul>
	        </div>

	        <div className='dropdown'>
	            <a id='dLabel' role='button' data-toggle='dropdown' className='btn btn-primary' data-target='#' href='#'>
	                Quesadillas <span className='caret'></span>
	            </a>
	    		<ul className='dropdown-menu multi-level' role='menu' aria-labelledby='dropdownMenu'>
	    			<li><a href='#'>Sencilla</a></li>
	    			<li className='divider'></li>
	    			<li><a href='#'>Mixta</a></li>
	    			<li className='divider'></li>
	    			<li><a href='#'>Mixta de Tripa</a></li>
	    			<li className='divider'></li>
	    			<li><a href='#'>Combinada de Tripa</a></li>
	    			<li className='divider'></li>
	                <li><a href='#'>Mixta Ahogada</a></li>
	                <li className='divider'></li>
	                <li><a href='#'>Mixta de Tripa Ahogada</a></li>
	            </ul>
	        </div>

	        <div className='dropdown'>
	            <a id='dLabel' role='button' data-toggle='dropdown' className='btn btn-primary' data-target='#' href='#'>
	                Tacos <span className='caret'></span>
	            </a>
	    		<ul className='dropdown-menu multi-level' role='menu' aria-labelledby='dropdownMenu'>
	    			<li><a href='#'>Sencillo</a></li>
	    			<li className='divider'></li>
	    			<li><a href='#'>Combinado con Tripa</a></li>
	    			<li className='divider'></li>
	    			<li><a href='#'>Tripa</a></li>
	    			<li className='divider'></li>
	    			<li><a href='#'>Mixto con Queso</a></li>
	    			<li className='divider'></li>
	    			<li><a href='#'>Mixto Tripa con Queso</a></li>
	    			<li className='divider'></li>
	                <li><a href='#'>Quesadilla tipo Taco</a></li>
	            </ul>
	        </div>

	        <div className='dropdown'>
	            <a id='dLabel' role='button' data-toggle='dropdown' className='btn btn-primary' data-target='#' href='#'>
	                Chavindecas <span className='caret'></span>
	            </a>
	    		<ul className='dropdown-menu multi-level' role='menu' aria-labelledby='dropdownMenu'>
	    			<li><a href='#'>Chavindeca</a></li>
	    			<li className='divider'></li>
	    			<li><a href='#'>De Tripa</a></li>
	    			<li className='divider'></li>
	    			<li><a href='#'>Ahogada</a></li>
	    			<li className='divider'></li>
	    			<li><a href='#'>Ahogada Tripa</a></li>
	            </ul>
	        </div>


	       	<div className='dropdown'>
	            <a id='dLabel' role='button' data-toggle='dropdown' className='btn btn-primary' data-target='#' href='#'>
	                Alambres/Volcanes <span className='caret'></span>
	            </a>
	    		<ul className='dropdown-menu multi-level' role='menu' aria-labelledby='dropdownMenu'>
	    			<li><a href='#'>de Queso</a></li>
	    			<li className='divider'></li>
	    			<li><a href='#'>Volcan</a></li>
	    			<li className='divider'></li>
	    			<li><a href='#'>De Tripa</a></li>
	    			<li className='divider'></li>
	    			<li><a href='#'>Carne El costeño</a></li>
	    			<li className='divider'></li>
	                <li><a href='#'>Alambre</a></li>
	                <li className='divider'></li>
	                <li><a href='#'>Alambre especial</a></li>
	                <li className='divider'></li>
	                <li><a href='#'>Platillo El costeño</a></li>
	                <li className='divider'></li>
	                <li><a href='#'>Platillo de Carne Asada</a></li>
	            </ul>
	        </div>

	       	<div className='dropdown'>
	            <a id='dLabel' role='button' data-toggle='dropdown' className='btn btn-primary' data-target='#' href='#'>
	                Postres <span className='caret'></span>
	            </a>
	    		<ul className='dropdown-menu multi-level' role='menu' aria-labelledby='dropdownMenu'>
	    			<li><a href='#'>Gelatina</a></li>
	    			<li className='divider'></li>
	    			<li><a href='#'>Gelatina con Rompope</a></li>
	    			<li className='divider'></li>
	    			<li><a href='#'>Tapioca</a></li>
	    			<li className='divider'></li>
	    			<li><a href='#'>Durazno en Almibar</a></li>
	    			<li className='divider'></li>
	    			<li><a href='#'>Chongos</a></li>
	            </ul>
	        </div>

	       	<div className='dropdown'>
	            <a id='dLabel' role='button' data-toggle='dropdown' className='btn btn-primary' data-target='#' href='#'>
	                Agua <span className='caret'></span>
	            </a>
	    		<ul className='dropdown-menu multi-level' role='menu' aria-labelledby='dropdownMenu'>
	    			<li><a href='#'>Agua de Frutas</a></li>
	    			<li className='divider'></li>
	    			<li><a href='#'>Refresco</a></li>
	            </ul>
	        </div>

	       	<div className='dropdown'>
	            <a id='dLabel' role='button' data-toggle='dropdown' className='btn btn-primary' data-target='#' href='#'>
	                Refresco <span className='caret'></span>
	            </a>
	    		<ul className='dropdown-menu multi-level' role='menu' aria-labelledby='dropdownMenu'>
	    			<li><a href='#'>Agua de Frutas</a></li>
	    			<li className='divider'></li>
	    			<li><a href='#'>Refresco</a></li>
	            </ul>
	        </div>

	    </div>
		);
	}
}

class Ingredientes extends React.Component {
	render() {
		return (

		<div className='menus'>
			<div className='dropdown'>
	            <a id='dLabel' role='button' className='btn btn-primary' data-target='#' href='#'>
	                Tripa
	            </a>
	            <a id='dLabel' role='button' className='btn btn-primary' data-target='#' href='#'>
	                Carne
	            </a>
	            <a id='dLabel' role='button' className='btn btn-primary' data-target='#' href='#'>
	                Chorizo
	            </a>
	            <a id='dLabel' role='button' className='btn btn-primary' data-target='#' href='#'>
	                Pimiento
	            </a>
	            <a id='dLabel' role='button' className='btn btn-primary' data-target='#' href='#'>
	                Cebolla
	            </a>
	            <a id='dLabel' role='button' className='btn btn-primary' data-target='#' href='#'>
	                Queso
	            </a>
	            <a id='dLabel' role='button' className='btn btn-primary' data-target='#' href='#'>
	                Piña
	            </a>
	            <a id='dLabel' role='button' className='btn btn-primary' data-target='#' href='#'>
	                Champiñones
	            </a>
	            <a id='dLabel' role='button' className='btn btn-primary' data-target='#' href='#'>
	                Chilantro
	            </a>
	        </div>
	    </div>
		);
	}
}

class Pedidos extends React.Component {
	render() {

		return (
			<div className='container'>
				<h1> Bienvenido a Pedidos </h1>
				<div className="row">
					<div className='col-md-8'>
						{ <Simbolos /> }
						{ <LevantarOrden />}
					</div>
					<div className='col-md-2'>
						{ <Platillos /> }
					</div>
					<div className='col-md-2'>
						{ <Ingredientes /> }
					</div>
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
