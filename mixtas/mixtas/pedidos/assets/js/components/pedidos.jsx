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

		elementosLista.splice(index, 1);
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
			ordenesUsuarios: [],
			precio: 0
		};

	}

	setSinbolo(simbolo, precioIngrediente=0, tipo) {
		const { ordenCompuesta, precio } = this.state;

		let simboloVar = simbolo;

		if (precioIngrediente > 0) {
			if (ordenCompuesta.indexOf(' Extra') > 1) {
				this.setState({
					ordenCompuesta: ordenCompuesta.concat(simboloVar),
					ordenLista: false,
					precio: precio + precioIngrediente
				});
			} else if (tipo !== 'Ingredientes'){
				this.setState({
					ordenCompuesta: ordenCompuesta.concat(simboloVar),
					ordenLista: false,
					precio: precioIngrediente
				});
			} else {
				this.setState({
					ordenCompuesta: ordenCompuesta.concat(simboloVar),
					ordenLista: false
				});
			}

		} else {
			if (parseInt(simboloVar) % 1 >= 0 && ordenCompuesta.length > 0 && typeof(simboloVar) !== 'string') {
				simboloVar = ordenCompuesta[0] + simboloVar;
				ordenCompuesta.shift();

			}
			this.setState({
				ordenCompuesta: ordenCompuesta.concat(simboloVar),
				ordenLista: false
			});
		}

	}


	agregarOrden() {
		const { ordenCompuesta, precio } = this.state;

		let precioPlato;
		if (precio) {
			if (parseInt(ordenCompuesta[0]) % 1 === 0) {
				precioPlato = parseInt(ordenCompuesta[0] * precio);
			} else {
				alert('Indique la cantidad, la cantidad debe de ir al inicio de la orden.');
			}
		}

		if (parseInt(ordenCompuesta[0]) % 1 === 0) {
			this.setState({
				listaOrdenes: this.state.listaOrdenes.concat(ordenCompuesta.join('') + ` ${ precioPlato }`),
				ordenCompuesta: []
			});
		}
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
		let indexPrecio = 0;
		let precioFinal = 0;
		let precioFinalOrden = 0;

		ordenSimplificada = (
			<div className='orden-personalizada plato' orden={ listaOrdenes } onClick={ this.editarOrdenPersonal.bind(this, listaOrdenes) }>
				{
					listaOrdenes.map((orden, index) => {

						indexPrecio = orden.split(' ').length;
						precioFinal += parseInt(orden.split(' ')[indexPrecio - 1]);
						precioFinalOrden = (
							<div className='costo-por-persona pull-right'>
								{ precioFinal }
							</div>
						);

						const ord = (
							<div className='orden-simple-x-usuario' key={ `orden-simple-${ index }`}>
								{ orden }
							</div>
						);

						return (
							<div>
								{ orden }
								<hr />
									{
										index + 1 === listaOrdenes.length ?
										precioFinalOrden : ''
									}
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
					if (menu.tipo === 'Ingredientes') {
						return (
							<li className='divider2 ' key={ `menu-${ menu.tipo }-${ index }` }>
								<a onClick={ this.setSinbolo.bind(this, `${ menu.nombreCorto }`, menu.precio, menu.tipo) }>
									{ menu.nombre }
								</a>
							</li>

						);
					}
					return (
						<li className='divider2' key={ `menu-${ menu.tipo }-${ index }` }>
							<a onClick={ this.setSinbolo.bind(this, `${ menu.nombreCorto }`, menu.precio, menu.tipo) }>
								{ menu.nombre }
							</a>
						</li>

					);
				}
			});
		}
		return lista;
	}

	finalizarOrden() {
		const { ordenesUsuarios } = this.state;
		const { user, mesa, idOrdenMesa } = this.props;

		let ordenes;
		let cantidad;
		let precio;
		let descripcion;
		let ordenDescompuesta;

		let idOrden;
		let metodo;
		let extraOrden;

		if (idOrdenMesa != 'new') {
			metodo = axios.patch;
			idOrden = idOrdenMesa;
			extraOrden = 'extra';
		} else {
			metodo = axios.post;
			idOrden = '';
			extraOrden = '';
		}

		metodo(`http://mixtas-costeno/pedidos/api/folio/${ idOrden }`,
			{
				nombreMesero: user,
			},
			{
				headers: {
					'X-CSRFToken': tokenCSRF
				}
			}
		).then(responseFolio => {
			for (var i = 0; i <= ordenesUsuarios.length - 1; i++) {
				ordenes = ordenesUsuarios[i].props.orden;

				ordenes.map((orden, index) => {
					ordenDescompuesta = orden.split(' ');

					cantidad = ordenDescompuesta.shift();
					precio = ordenDescompuesta.pop();
					descripcion = ordenDescompuesta.join(' ');

					axios.post('http://mixtas-costeno/pedidos/api/orden/',
						{
							cantidad: parseInt(cantidad),
							precio: parseInt(precio),
							platillo: descripcion,
							idOrden: responseFolio.data.id,
							cliente: !extraOrden ? i + 1 : extraOrden
						},
						{
							headers: {
								'X-CSRFToken': tokenCSRF
							}
						}
					);
				});
			}

			axios.patch(`http://mixtas-costeno/pedidos/api/mesas/${ mesa }`,
				{
					status: true,
					idOrdenMesa: responseFolio.data.id
				},
				{
					headers: {
						'X-CSRFToken': tokenCSRF
					}
				}
			).then(responseMesa => {
				window.location = '/pedidos/mesas/';
			});
		});

	}

	render() {
		const { simbolos, menus } = this.props;
		const { ordenesUsuarios } = this.state;

		let listaSimbolos;
		if (simbolos.length > 0) {
			listaSimbolos = simbolos.map(simbolo => {
				return (
					<button className={ `btn simbols ${ simbolo.claseColor }` } onClick={ this.setSinbolo.bind(this, ` ${ simbolo.simbolo }`, 0, 'simbolo') }>
						{ simbolo.simbolo }
					</button>
				);
			});
		}

		let listaEntradas = this.listadosMenus('Entradas', menus);
		let listaQuesadillas = this.listadosMenus('Quesadillas', menus);;
		let listatacos = this.listadosMenus('Tacos', menus);;
		let listaChavindecas = this.listadosMenus('Chavindecas', menus);;
		let listaAlambres = this.listadosMenus('Alambres-Volcanes', menus);;
		let listaPostres = this.listadosMenus('Postres', menus);;
		let listaBebidas = this.listadosMenus('Bebidas', menus);;
		let listaIngredientes = this.listadosMenus('Ingredientes', menus);;



		let listaNumeros = [];
		for (var i = 0; i < 10; i++) {
			const btn = (
				<button key={ `numero-${ i }` } className='btn btn-success numeros' onClick={ this.setSinbolo.bind(this, `${ i }`, 0) }>
					{ i }
				</button>
			);

			listaNumeros.push(btn);
		}


		return (
			<div className="row">
				<div className='col-md-10 col-sm-8'>
					<div>
						<div className='simbology'>
							<div className="row">
								<div className='col-md-4'>
									{ listaNumeros }
								</div>
								<div className='col-md-8 simbol-btns'>
									{ listaSimbolos }
								</div>

							</div>
						</div>
						<button className='mas btn btn-success btn-lg pull-right' onClick={ this.agregarOrden.bind(this) }>
								<i className="fa fa-plus" aria-hidden="true"></i>
						</button>

						<button className='menos btn btn-danger ' onClick={ this.borrarElemento.bind(this) }>
							<i className="fa fa-eraser" aria-hidden="true"></i>
						</button>

						<OrdenPersonal ordenCompuesta={ this.state.ordenCompuesta } listaOrdenes={ this.state.listaOrdenes }/>

						<div className='btn btn-success btn-fin pull-right' onClick={ this.agregarOrdenUsuario.bind(this) }>
							Agregar Orden de Usuario
						</div>

						<div className='btn btn-warning btn-fin-orden' onClick={ this.finalizarOrden.bind(this) }>
							Finalizar Orden
						</div>

						<div className='order-list'>
							<h3>  Ordenes Listas </h3>
							<hr />
							{ ordenesUsuarios }
						</div>

					</div>
				</div>
				<div className='col-md-2 col-sm-4' >
					<div className='menus'>
						<div className='dropdown'>
				            <a id='dLabel' role='button' data-toggle='dropdown' className='btn btn-warning menu-btns ingredients' data-target='#' href='#'>
				                Ingredientes <span className='caret'></span>
				            </a>
				    		<ul className='dropdown-menu multi-level' role='menu' aria-labelledby='dropdownMenu'>
				    			{ listaIngredientes }
				            </ul>
				        </div>

						<div className='dropdown'>
				            <a id='dLabel' role='button' data-toggle='dropdown' className='btn btn-primary menu-btns' data-target='#' href='#'>
				                Entradas <span className='caret'></span>
				            </a>
				    		<ul className='dropdown-menu multi-level' role='menu' aria-labelledby='dropdownMenu'>
				    			{ listaEntradas }
				            </ul>
				        </div>

				        <div className='dropdown'>
				            <a id='dLabel' role='button' data-toggle='dropdown' className='btn btn-primary menu-btns' data-target='#' href='#'>
				                Quesadillas <span className='caret'></span>
				            </a>
				    		<ul className='dropdown-menu multi-level' role='menu' aria-labelledby='dropdownMenu'>
				    			{ listaQuesadillas }
				            </ul>
				        </div>

				        <div className='dropdown'>
				            <a id='dLabel' role='button' data-toggle='dropdown' className='btn btn-primary menu-btns' data-target='#' href='#'>
				                Tacos <span className='caret'></span>
				            </a>
				    		<ul className='dropdown-menu multi-level' role='menu' aria-labelledby='dropdownMenu'>
				    			{ listatacos }
				            </ul>
				        </div>

				        <div className='dropdown'>
				            <a id='dLabel' role='button' data-toggle='dropdown' className='btn btn-primary menu-btns' data-target='#' href='#'>
				                Chavindecas <span className='caret'></span>
				            </a>
				    		<ul className='dropdown-menu multi-level' role='menu' aria-labelledby='dropdownMenu'>
				    			{ listaChavindecas }
				            </ul>
				        </div>


				       	<div className='dropdown'>
				            <a id='dLabel' role='button' data-toggle='dropdown' className='btn btn-primary menu-btns' data-target='#' href='#'>
				                Alambres/Volcanes <span className='caret'></span>
				            </a>
				    		<ul className='dropdown-menu multi-level' role='menu' aria-labelledby='dropdownMenu'>
				    			{ listaAlambres }
				            </ul>
				        </div>

				       	<div className='dropdown'>
				            <a id='dLabel' role='button' data-toggle='dropdown' className='btn btn-primary menu-btns' data-target='#' href='#'>
				                Postres <span className='caret'></span>
				            </a>
				    		<ul className='dropdown-menu multi-level' role='menu' aria-labelledby='dropdownMenu'>
				    			{ listaPostres }
				            </ul>
				        </div>

				       	<div className='dropdown'>
				            <a id='dLabel' role='button' data-toggle='dropdown' className='btn btn-primary menu-btns' data-target='#' href='#'>
				                Agua <span className='caret'></span>
				            </a>
				    		<ul className='dropdown-menu multi-level' role='menu' aria-labelledby='dropdownMenu'>
				    			{ listaBebidas }
				            </ul>
				        </div>

				       	<div className='dropdown'>
				            <a id='dLabel' role='button' data-toggle='dropdown' className='btn btn-primary menu-btns' data-target='#' href='#'>
				                Refresco <span className='caret'></span>
				            </a>
				    		<ul className='dropdown-menu multi-level' role='menu' aria-labelledby='dropdownMenu'>
				    			{ listaBebidas }
				            </ul>
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
		const { mesa, simbolos, menus, user, idOrdenMesa, rol } = this.props;

		return (
			<div className='contenedor-pedidos'>
				<div className='row'>
					<div className='col-md-1 col-xs-1'>
						<a className='back-menu' href='/pedidos/mesas/'>
							<i className='fa fa-arrow-left fa-3x' aria-hidden='true'></i>
						</a>
					</div>
					<div className='col-md-11 col-xs-11'>
						<h1> Mesa # { mesa } </h1>
					</div>
				</div>
				{
					<Simbolos
						simbolos={ simbolos }
						menus={ menus }
						user={ user }
						mesa={ mesa }
						idOrdenMesa={ idOrdenMesa }
					/>
				}
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
const dataUser = element.getAttribute('data-user');
const dataRol = element.getAttribute('data-rol');
const tokenCSRF = element.getAttribute('data-token');
const idOrdenMesa = element.getAttribute('data-idOrdenMesa');

ReactDOM.render(
	<Provider store={ store } >
		<PedidosConnect mesa={ dataMesa } user={ dataUser } idOrdenMesa={ idOrdenMesa } rol={ dataRol }/>
	</Provider>,
	element
);
