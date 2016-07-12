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
	constructor(props) {
		super(props);

		this.state = {
			elementosLista: []
		};
	}

	componentWillReceiveProps(nextProps, nextState) {
		this.setState({
			elementosLista: nextProps.listaOrdenes
		});
	}

	enviarOrden() {
		const { ordenCompuesta, listaOrdenes } = this.props;

		alert(listaOrdenes);
	}

	borrarPlato(index) {
		const { elementosLista } = this.state;

		delete elementosLista[index];
		this.setState({
			elementosLista: elementosLista
		});

	}

	render() {
		const { ordenCompuesta, listaOrdenes } = this.props;
		const { elementosLista } = this.state;

		let ordenes = elementosLista.map((orden, index) => {
			return (
				<div key={index}>
					<button className='btn btn-danger x-btn' onClick={ this.borrarPlato.bind(this, index) }>
						<i className="fa fa-trash-o"></i>
					</button>
					<p className='plato'>
						{ orden }
					</p>
				</div>

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
			ordenCompuesta: [],
			ordenLista: false,
			listaOrdenes: []
		};

	}
	setSinbolo(simbolo) {
		this.setState({
			ordenCompuesta: this.state.ordenCompuesta.concat(simbolo),
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

	borrarElemento() {
		this.state.ordenCompuesta.pop();
		this.setState({
			ordenCompuesta: this.state.ordenCompuesta
		});
	}

	render() {
		const mitad = (
			<button className='btn simbols btn-primary ' onClick={ this.setSinbolo.bind(this, ' /') }>
				/
			</button>
		);

		const dosPlatos = (
			<button className='btn simbols btn-info' onClick={ this.setSinbolo.bind(this, ' 1/2') }>
				1/2
			</button>
		);

		const ahogada = (
			<button className='btn simbols btn-warning' onClick={ this.setSinbolo.bind(this, ' ahogada') }>
				Ahogada
			</button>
		);

		const sin = (
			<button className='btn simbols btn-danger' onClick={ this.setSinbolo.bind(this, ' sin') }>
				Sin
			</button>
		);

		const con = (
			<button className='btn simbols btn-con' onClick={ this.setSinbolo.bind(this, ' con') }>
				Con
			</button>
		);

		const extra = (
			<button className='btn simbols btn-extra' onClick={ this.setSinbolo.bind(this, ' Extra') }>
				Extra
			</button>
		);


		return (
			<div className="row">
				<div className='col-md-8'>
					<div>
						<div className='simbology'>
							{ mitad }
							{ dosPlatos }
							{ ahogada }
							{ sin }
							{ con }
							{ extra }
							<button  className='mas btn btn-success btn-lg' onClick={ this.agregarOrden.bind(this) }>
								<i className="fa fa-plus" aria-hidden="true"></i>
							</button>

							<button  className='menos btn btn-danger pull-right' onClick={ this.borrarElemento.bind(this) }>
								<i className="fa fa-eraser" aria-hidden="true"></i>
							</button>

						</div>

						<OrdenPersonal ordenCompuesta={ this.state.ordenCompuesta } listaOrdenes={ this.state.listaOrdenes }/>
					</div>
					{ <LevantarOrden />}
				</div>
				<div className='col-md-2'>
					<div className='menus'>
						<div className='dropdown'>
				            <a id='dLabel' role='button' data-toggle='dropdown' className='btn btn-primary' data-target='#' href='#'>
				                Entradas <span className='caret'></span>
				            </a>
				    		<ul className='dropdown-menu multi-level' role='menu' aria-labelledby='dropdownMenu'>
				    			<li><a onClick={ this.setSinbolo.bind(this, ' Quesadilla') }>Quesadillas</a></li>
				    			<li className='divider'></li>
				    			<li><a onClick={ this.setSinbolo.bind(this, ' Nopales') }>Nopales</a></li>
				    			<li className='divider'></li>
				                <li><a onClick={ this.setSinbolo.bind(this, ' Guacamole') }>Guacamole</a></li>
				                <li className='divider'></li>
				                <li><a onClick={ this.setSinbolo.bind(this, ' Cebollitas') }>Cebollitas</a></li>
				                <li className='divider'></li>
				                <li><a onClick={ this.setSinbolo.bind(this, ' Frijoles Charros') }>Frijoles Charros</a></li>
				                <li className='divider'></li>
				                <li><a onClick={ this.setSinbolo.bind(this, ' Papa "El Costeño"') }>Papa "El Costeño"</a></li>
				                <li className='divider'></li>
				                <li><a onClick={ this.setSinbolo.bind(this, ' Chuy') }>Chuy</a></li>
				                <li className='divider'></li>
				                <li><a onClick={ this.setSinbolo.bind(this, ' Chenchitos') }>Chenchitos</a></li>
				            </ul>
				        </div>

				        <div className='dropdown'>
				            <a id='dLabel' role='button' data-toggle='dropdown' className='btn btn-primary' data-target='#' href='#'>
				                Quesadillas <span className='caret'></span>
				            </a>
				    		<ul className='dropdown-menu multi-level' role='menu' aria-labelledby='dropdownMenu'>
				    			<li><a onClick={ this.setSinbolo.bind(this, ' Sencilla') }>Sencilla</a></li>
				    			<li className='divider'></li>
				    			<li><a onClick={ this.setSinbolo.bind(this, ' Mixta') }>Mixta</a></li>
				    			<li className='divider'></li>
				    			<li><a onClick={ this.setSinbolo.bind(this, ' Mixta de Tripa') }>Mixta de Tripa</a></li>
				    			<li className='divider'></li>
				    			<li><a onClick={ this.setSinbolo.bind(this, ' Combinada de Tripa') }>Combinada de Tripa</a></li>
				    			<li className='divider'></li>
				                <li><a onClick={ this.setSinbolo.bind(this, ' Mixta Ahogada') }>Mixta Ahogada</a></li>
				                <li className='divider'></li>
				                <li><a onClick={ this.setSinbolo.bind(this, ' Mixta de Tripa Ahogada') }>Mixta de Tripa Ahogada</a></li>
				            </ul>
				        </div>

				        <div className='dropdown'>
				            <a id='dLabel' role='button' data-toggle='dropdown' className='btn btn-primary' data-target='#' href='#'>
				                Tacos <span className='caret'></span>
				            </a>
				    		<ul className='dropdown-menu multi-level' role='menu' aria-labelledby='dropdownMenu'>
				    			<li><a onClick={ this.setSinbolo.bind(this, ' Sencillo') }>Sencillo</a></li>
				    			<li className='divider'></li>
				    			<li><a onClick={ this.setSinbolo.bind(this, ' Combinado con Tripa') }>Combinado con Tripa</a></li>
				    			<li className='divider'></li>
				    			<li><a onClick={ this.setSinbolo.bind(this, ' Tripa') }>Tripa</a></li>
				    			<li className='divider'></li>
				    			<li><a onClick={ this.setSinbolo.bind(this, ' Mixto con Queso') }>Mixto con Queso</a></li>
				    			<li className='divider'></li>
				    			<li><a onClick={ this.setSinbolo.bind(this, ' Mixto Tripa con Queso') }>Mixto Tripa con Queso</a></li>
				    			<li className='divider'></li>
				                <li><a onClick={ this.setSinbolo.bind(this, ' Quesadilla tipo Taco') }>Quesadilla tipo Taco</a></li>
				            </ul>
				        </div>

				        <div className='dropdown'>
				            <a id='dLabel' role='button' data-toggle='dropdown' className='btn btn-primary' data-target='#' href='#'>
				                Chavindecas <span className='caret'></span>
				            </a>
				    		<ul className='dropdown-menu multi-level' role='menu' aria-labelledby='dropdownMenu'>
				    			<li><a onClick={ this.setSinbolo.bind(this, ' Chavindeca') }>Chavindeca</a></li>
				    			<li className='divider'></li>
				    			<li><a onClick={ this.setSinbolo.bind(this, ' De Tripa') }>De Tripa</a></li>
				    			<li className='divider'></li>
				    			<li><a onClick={ this.setSinbolo.bind(this, ' Ahogada') }>Ahogada</a></li>
				    			<li className='divider'></li>
				    			<li><a onClick={ this.setSinbolo.bind(this, ' Ahogada Tripa') }>Ahogada Tripa</a></li>
				            </ul>
				        </div>


				       	<div className='dropdown'>
				            <a id='dLabel' role='button' data-toggle='dropdown' className='btn btn-primary' data-target='#' href='#'>
				                Alambres/Volcanes <span className='caret'></span>
				            </a>
				    		<ul className='dropdown-menu multi-level' role='menu' aria-labelledby='dropdownMenu'>
				    			<li><a onClick={ this.setSinbolo.bind(this, ' Alambre De Queso') }>de Queso</a></li>
				    			<li className='divider'></li>
				    			<li><a onClick={ this.setSinbolo.bind(this, ' Volcan') }>Volcan</a></li>
				    			<li className='divider'></li>
				    			<li><a onClick={ this.setSinbolo.bind(this, ' De Tripa') }>De Tripa</a></li>
				    			<li className='divider'></li>
				    			<li><a onClick={ this.setSinbolo.bind(this, ' Carne "El Costeño"') }>Carne El costeño</a></li>
				    			<li className='divider'></li>
				                <li><a onClick={ this.setSinbolo.bind(this, ' Alambre') }>Alambre</a></li>
				                <li className='divider'></li>
				                <li><a onClick={ this.setSinbolo.bind(this, ' Alambre especial') }>Alambre especial</a></li>
				                <li className='divider'></li>
				                <li><a onClick={ this.setSinbolo.bind(this, ' Platillo El Costeño') }>Platillo El costeño</a></li>
				                <li className='divider'></li>
				                <li><a onClick={ this.setSinbolo.bind(this, ' Platillo de Carne Asada') }>Platillo de Carne Asada</a></li>
				            </ul>
				        </div>

				       	<div className='dropdown'>
				            <a id='dLabel' role='button' data-toggle='dropdown' className='btn btn-primary' data-target='#' href='#'>
				                Postres <span className='caret'></span>
				            </a>
				    		<ul className='dropdown-menu multi-level' role='menu' aria-labelledby='dropdownMenu'>
				    			<li><a onClick={ this.setSinbolo.bind(this, ' Gelatina') }>Gelatina</a></li>
				    			<li className='divider'></li>
				    			<li><a onClick={ this.setSinbolo.bind(this, ' Gelatina con Rompope') }>Gelatina con Rompope</a></li>
				    			<li className='divider'></li>
				    			<li><a onClick={ this.setSinbolo.bind(this, ' Tapioca') }>Tapioca</a></li>
				    			<li className='divider'></li>
				    			<li><a onClick={ this.setSinbolo.bind(this, ' Durazno en Almibar') }>Durazno en Almibar</a></li>
				    			<li className='divider'></li>
				    			<li><a onClick={ this.setSinbolo.bind(this, ' Chongos') }>Chongos</a></li>
				            </ul>
				        </div>

				       	<div className='dropdown'>
				            <a id='dLabel' role='button' data-toggle='dropdown' className='btn btn-primary' data-target='#' href='#'>
				                Agua <span className='caret'></span>
				            </a>
				    		<ul className='dropdown-menu multi-level' role='menu' aria-labelledby='dropdownMenu'>
				    			<li><a onClick={ this.setSinbolo.bind(this, ' Agua de Frutas') }>Agua de Frutas</a></li>
				    			<li className='divider'></li>
				    			<li><a onClick={ this.setSinbolo.bind(this, ' Refresco') }>Refresco</a></li>
				            </ul>
				        </div>

				       	<div className='dropdown'>
				            <a id='dLabel' role='button' data-toggle='dropdown' className='btn btn-primary' data-target='#' href='#'>
				                Refresco <span className='caret'></span>
				            </a>
				    		<ul className='dropdown-menu multi-level' role='menu' aria-labelledby='dropdownMenu'>
				    			<li><a onClick={ this.setSinbolo.bind(this, ' Agua de Frutas') }>Agua de Frutas</a></li>
				    			<li className='divider'></li>
				    			<li><a onClick={ this.setSinbolo.bind(this, ' Refresco') }>Refresco</a></li>
				            </ul>
				        </div>

				    </div>
				</div>
				<div className='col-md-2'>
					<div className='menus'>
						<div className='dropdown'>
				            <a id='dLabel' role='button' className='btn btn-primary' data-target='#' onClick={ this.setSinbolo.bind(this, ' Tripa') }>
				                Tripa
				            </a>
				            <a id='dLabel' role='button' className='btn btn-primary' data-target='#' onClick={ this.setSinbolo.bind(this, ' Carne') }>
				                Carne
				            </a>
				            <a id='dLabel' role='button' className='btn btn-primary' data-target='#' onClick={ this.setSinbolo.bind(this, ' Chorizo') }>
				                Chorizo
				            </a>
				            <a id='dLabel' role='button' className='btn btn-primary' data-target='#' onClick={ this.setSinbolo.bind(this, ' Pimiento') }>
				                Pimiento
				            </a>
				            <a id='dLabel' role='button' className='btn btn-primary' data-target='#' onClick={ this.setSinbolo.bind(this, ' Cebolla') }>
				                Cebolla
				            </a>
				            <a id='dLabel' role='button' className='btn btn-primary' data-target='#' onClick={ this.setSinbolo.bind(this, ' Queso') }>
				                Queso
				            </a>
				            <a id='dLabel' role='button' className='btn btn-primary' data-target='#' onClick={ this.setSinbolo.bind(this, ' Piña') }>
				                Piña
				            </a>
				            <a id='dLabel' role='button' className='btn btn-primary' data-target='#' onClick={ this.setSinbolo.bind(this, ' Champiñones') }>
				                Champiñones
				            </a>
				            <a id='dLabel' role='button' className='btn btn-primary' data-target='#' onClick={ this.setSinbolo.bind(this, ' Cilantro') }>
				                Cilantro
				            </a>
				        </div>
				    </div>
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
				{ <Simbolos /> }
			</div>
		);
	}
}

const element = document.getElementById('pedidos');

ReactDOM.render(
	<Pedidos />,
	element
);
