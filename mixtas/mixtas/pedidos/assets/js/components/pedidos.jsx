import React from 'react';
import ReactDOM from 'react-dom';

import { connect, Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import promise from 'redux-promise';
import thunkMiddleware from 'redux-thunk';


//     ___   ____________________  _   _______
//    /   | / ____/_  __/  _/ __ \/ | / / ___/
//   / /| |/ /     / /  / // / / /  |/ /\__ \
//  / ___ / /___  / / _/ // /_/ / /|  /___/ /
// /_/  |_\____/ /_/ /___/\____/_/ |_//____/

import axios from 'axios';

const OBTENER_SIMBOLOS = 'OBTENER_SIMBOLOS';

const actionObtenerSimbolos = () => {
	const respuesta = axios.get('http://mixtas-costeno/pedidos/api/simbolos/');

	return {
		type: OBTENER_SIMBOLOS,
		payload: respuesta
	};
};

const OBTENER_MENUS = 'OBTENER_MENUS';

const actionObtenerMenus = () => {
	const respuesta = axios.get('http://mixtas-costeno/pedidos/api/menu/');

	return {
		type: OBTENER_MENUS,
		payload: respuesta
	};
};

////////////////////////////////////////////////


//     ____  __________  __  __________________  _____
//    / __ \/ ____/ __ \/ / / / ____/ ____/ __ \/ ___/
//   / /_/ / __/ / / / / / / / /   / __/ / /_/ /\__ \
//  / _, _/ /___/ /_/ / /_/ / /___/ /___/ _, _/___/ /
// /_/ |_/_____/_____/\____/\____/_____/_/ |_|/____/

const reductorObtenerSimbolos = (state=[], action) => {
	switch(action.type){
	case OBTENER_SIMBOLOS:
		return Object.assign([], state, action.payload.data);
	default:
		return state;
	}
};


const reductorObtenerMenus = (state=[], action) => {
	switch(action.type){
	case OBTENER_MENUS:
		return Object.assign([], state, action.payload.data);
	default:
		return state;
	}
};


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

		let ordenes = elementosLista.reverse().map((orden, index) => {
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
			listaOrdenes: [],
			ordenesUsuarios: []
		};

	}
	setSinbolo(simbolo, precio=false) {
		this.setState({
			ordenCompuesta: this.state.ordenCompuesta.concat(simbolo),
			ordenLista: false
		});
	}


	agregarOrden() {
		const { ordenCompuesta } = this.state;

		this.setState({
			listaOrdenes: this.state.listaOrdenes.concat(ordenCompuesta.join('')),
			ordenCompuesta: []
		});
	}

	borrarElemento() {
		const { ordenCompuesta } = this.state;

		if (ordenCompuesta.lenght !== 0) {
			ordenCompuesta.pop();
			this.setState({
				ordenCompuesta: ordenCompuesta
			});
		}
	}

	editarOrdenPersonal(ordenesActualizar){
		const { listaOrdenes, ordenesUsuarios } = this.state;

		if (listaOrdenes.length !== 0) {
			alert('Terminar Orden en procesor antes de editar');
		} else {
			this.setState({
				listaOrdenes: ordenesActualizar
			});

			for (var i = 0; i <= ordenesUsuarios.length; i++) {
				if (ordenesUsuarios[i].props.orden === ordenesActualizar) {
					delete ordenesUsuarios[i];
					this.setState({
						ordenesUsuarios: ordenesUsuarios
					});
					break;
				}
			}
		}
	}

	agregarOrdenUsuario(){
		const { listaOrdenes, ordenesUsuarios } = this.state;

		let ordenSimplificada;
		ordenSimplificada = (
			<div className='orden-personalizada plato' orden={ listaOrdenes } onClick={ this.editarOrdenPersonal.bind(this, listaOrdenes) }>
				{
					listaOrdenes.map((orden, index) => {
						return (
							<div className='orden-simple-x-usuario' key={ `orden-simple-${ index }`}>
								{ orden }
							</div>
						);
					})
				}
			</div>
		);


		this.setState({
			ordenesUsuarios: [ordenSimplificada].concat(ordenesUsuarios),
			ordenCompuesta: [],
			listaOrdenes: []
		});
	}

	listadosMenus(tipos, menus) {
		let lista;
		if (menus.length > 0) {
			lista = menus.map((menu, index) => {
				if (menu.tipo == tipos){
					return (
						<li className='divider2' key={ `menu-${ menu.tipo }-${ index }` }>
							<a onClick={ this.setSinbolo.bind(this, ` ${ menu.nombreCorto }`, 50) }>
								{ menu.nombre }
							</a>
						</li>

					);
				}
			});
		}
		return lista;
	}

	render() {
		const { simbolos, menus } = this.props;
		const { ordenesUsuarios } = this.state;

		let listaSimbolos;
		if (simbolos.length > 0) {
			listaSimbolos = simbolos.map(simbolo => {
				return (
					<button className={ `btn simbols ${ simbolo.claseColor }` } onClick={ this.setSinbolo.bind(this, ` ${ simbolo.simbolo }`) }>
						{ simbolo.simbolo }
					</button>
				);
			});
		}

		let listaEntradas = this.listadosMenus('Entrada', menus);
		let listaQuesadillas = this.listadosMenus('Quesadillas', menus);;
		let listatacos = this.listadosMenus('Taco', menus);;
		let listaChavindecas = this.listadosMenus('Chavindecas', menus);;
		let listaAlambres = this.listadosMenus('Alambres y Volcanes', menus);;
		let listaPostres = this.listadosMenus('Postres', menus);;
		let listaBebidas = this.listadosMenus('Bebidas', menus);;



		let listaNumeros = [];
		for (var i = 0; i < 10; i++) {
			const btn = (
				<button key={ `numero-${ i }` } className='btn btn-success numeros' onClick={ this.setSinbolo.bind(this, `${ i }`) }>
					{ i }
				</button>
			);

			listaNumeros.push(btn);
		}


		return (
			<div className="row">
				<div className='col-md-8'>
					<div>
						<div className='simbology'>
							<div className="row">
								<div className='col-md-7'>
									{ listaSimbolos }
								</div>
								<div className='col-md-5'>
									{ listaNumeros }
								</div>
							</div>
						</div>
						<button className='mas btn btn-success btn-lg' onClick={ this.agregarOrden.bind(this) }>
								<i className="fa fa-plus" aria-hidden="true"></i>
						</button>

						<button className='menos btn btn-danger pull-right' onClick={ this.borrarElemento.bind(this) }>
							<i className="fa fa-eraser" aria-hidden="true"></i>
						</button>

						<OrdenPersonal ordenCompuesta={ this.state.ordenCompuesta } listaOrdenes={ this.state.listaOrdenes }/>

						<div className='btn btn-success btn-fin'>
							<button onClick={ this.agregarOrdenUsuario.bind(this) }>
								Agregar Orden de Usuario
							</button>
						</div>

						<div className='order-list'>
							<h3>  Ordenes Listas </h3>
							<hr />
							{ ordenesUsuarios }
						</div>

					</div>
				</div>
				<div className='col-md-2'>
					<div className='menus'>
						<div className='dropdown'>
				            <a id='dLabel' role='button' data-toggle='dropdown' className='btn btn-primary' data-target='#' href='#'>
				                Entradas <span className='caret'></span>
				            </a>
				    		<ul className='dropdown-menu multi-level' role='menu' aria-labelledby='dropdownMenu'>
				    			{ listaEntradas }
				            </ul>
				        </div>

				        <div className='dropdown'>
				            <a id='dLabel' role='button' data-toggle='dropdown' className='btn btn-primary' data-target='#' href='#'>
				                Quesadillas <span className='caret'></span>
				            </a>
				    		<ul className='dropdown-menu multi-level' role='menu' aria-labelledby='dropdownMenu'>
				    			{ listaQuesadillas }
				            </ul>
				        </div>

				        <div className='dropdown'>
				            <a id='dLabel' role='button' data-toggle='dropdown' className='btn btn-primary' data-target='#' href='#'>
				                Tacos <span className='caret'></span>
				            </a>
				    		<ul className='dropdown-menu multi-level' role='menu' aria-labelledby='dropdownMenu'>
				    			{ listatacos }
				            </ul>
				        </div>

				        <div className='dropdown'>
				            <a id='dLabel' role='button' data-toggle='dropdown' className='btn btn-primary' data-target='#' href='#'>
				                Chavindecas <span className='caret'></span>
				            </a>
				    		<ul className='dropdown-menu multi-level' role='menu' aria-labelledby='dropdownMenu'>
				    			{ listaChavindecas }
				            </ul>
				        </div>


				       	<div className='dropdown'>
				            <a id='dLabel' role='button' data-toggle='dropdown' className='btn btn-primary' data-target='#' href='#'>
				                Alambres/Volcanes <span className='caret'></span>
				            </a>
				    		<ul className='dropdown-menu multi-level' role='menu' aria-labelledby='dropdownMenu'>
				    			{ listaAlambres }
				            </ul>
				        </div>

				       	<div className='dropdown'>
				            <a id='dLabel' role='button' data-toggle='dropdown' className='btn btn-primary' data-target='#' href='#'>
				                Postres <span className='caret'></span>
				            </a>
				    		<ul className='dropdown-menu multi-level' role='menu' aria-labelledby='dropdownMenu'>
				    			{ listaPostres }
				            </ul>
				        </div>

				       	<div className='dropdown'>
				            <a id='dLabel' role='button' data-toggle='dropdown' className='btn btn-primary' data-target='#' href='#'>
				                Agua <span className='caret'></span>
				            </a>
				    		<ul className='dropdown-menu multi-level' role='menu' aria-labelledby='dropdownMenu'>
				    			{ listaBebidas }
				            </ul>
				        </div>

				       	<div className='dropdown'>
				            <a id='dLabel' role='button' data-toggle='dropdown' className='btn btn-primary' data-target='#' href='#'>
				                Refresco <span className='caret'></span>
				            </a>
				    		<ul className='dropdown-menu multi-level' role='menu' aria-labelledby='dropdownMenu'>
				    			{ listaBebidas }
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
	componentWillMount() {
		const { dispatch } = this.props;

		dispatch(actionObtenerSimbolos());
		dispatch(actionObtenerMenus());
	}

	render() {
		const { mesa, simbolos, menus } = this.props;

		return (
			<div className='container'>
				<h1> Bienvenido a Pedidos  Mesa # { mesa } </h1>
				{ <Simbolos simbolos={ simbolos } menus={ menus }/> }
			</div>
		);
	}
}


// conectar el component con redux
const PedidosConnect = connect(store => ({ simbolos: store.listadoSimbolos, menus: store.listadoMenus }))(Pedidos);


const reducer = combineReducers({
	listadoSimbolos: reductorObtenerSimbolos,
	listadoMenus: reductorObtenerMenus,
});


const store = createStore(
	reducer, applyMiddleware(thunkMiddleware, promise));

const element = document.getElementById('pedidos');
const dataMesa = element.getAttribute('data-mesa');

ReactDOM.render(
	<Provider store={ store } >
		<PedidosConnect mesa={ dataMesa }/>
	</Provider>,
	element
);
