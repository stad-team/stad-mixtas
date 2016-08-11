import React from 'react';
import ReactDOM from 'react-dom';

import { connect, Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import promise from 'redux-promise';
import thunkMiddleware from 'redux-thunk';

import { isEmpty } from 'lodash';

//     ___   ____________________  _   _______
//    /   | / ____/_  __/  _/ __ \/ | / / ___/
//   / /| |/ /     / /  / // / / /  |/ /\__ \
//  / ___ / /___  / / _/ // /_/ / /|  /___/ /
// /_/  |_\____/ /_/ /___/\____/_/ |_//____/

import axios from 'axios';

const OBTENER_MENU = 'OBTENER_MENU';
const CREAR_MENU = 'CREAR_MENU';

const actionObtenerMenu = () => {
	const respuesta = axios.get('http://mixtas-costeno/pedidos/api/menu/');

	return {
		type: OBTENER_MENU,
		payload: respuesta
	};
};

const actionCrearPlatillo = (tipo, nombre, nombreCorto, precio) => {
	const respuesta = axios.post('http://mixtas-costeno/pedidos/api/menu/',
		{
			tipo: tipo,
			nombre: nombre,
			nombreCorto: nombreCorto,
			precio: precio
		},
		{
			headers: {
				'X-CSRFToken': tokenCSRF
			}
		}
	);

	return {
		type: CREAR_MENU,
		payload: respuesta
	};
};
////////////////////////////////////////////////

//     ____  __________  __  __________________  _____
//    / __ \/ ____/ __ \/ / / / ____/ ____/ __ \/ ___/
//   / /_/ / __/ / / / / / / / /   / __/ / /_/ /\__ \
//  / _, _/ /___/ /_/ / /_/ / /___/ /___/ _, _/___/ /
// /_/ |_/_____/_____/\____/\____/_____/_/ |_|/____/

const reductorObtenerMenu = (state=[], action) => {
	switch(action.type){
	case OBTENER_MENU:
		return Object.assign([], state, action.payload.data);
	case CREAR_MENU:
		return state.concat(action.payload.data);
	default:
		return state;
	}
};
////////////////////////////////////////////////

class MiMenu extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			tipoInput: '',
			nombreInput: '',
			nombreCortoInput: '',
			precioInput: ''
		};
	}

	componentWillMount() {
		const { dispatch, user, rol } = this.props;

		if (user === 'AnonymousUser' || rol === 'mesero' || rol === 'cajero') {
			window.location = '/auth/logouth';
		} else {
			dispatch(actionObtenerMenu());
		}

	}

	obtenerValorInput() {
		const { tipo, nombre, nombreCorto, precio } = this.refs;

		this.setState({
			tipoInput: tipo.value,
			nombreInput: nombre.value,
			nombreCortoInput: nombreCorto.value,
			precioInput: precio.value
		});
	}

	crearPlatillo() {
		const { dispatch } = this.props;
		const { tipoInput, nombreInput, nombreCortoInput, precioInput } = this.state;

		dispatch(actionCrearPlatillo(tipoInput, nombreInput, nombreCortoInput, precioInput));

		this.setState({
			tipoInput: '',
			nombreInput: '',
			nombreCortoInput: '',
			precioInput: ''
		});
	}

	getBodyTable(tipo) {
		let listadoBody = tipo.map(type => {
			return (
				<tbody key={ type.id }>
				    <tr >
				     	<td>{ type.tipo }</td>
				     	<td> { type.nombre }</td>
				     	<td> { type.nombreCorto }</td>
				     	<td> { type.precio }</td>
				    </tr>
			    </tbody>
			);
		});

		return listadoBody;
	}

	getFilter(tipo) {
		const { platillos } = this.props;
		let listaFilter = platillos.filter(platillo => {
			return platillo.tipo == tipo;
		});

		return listaFilter;
	}

	render() {
		const { user, superUser, rol, platillos } = this.props;

		let platillosDefault = ['Entradas', 'Quesadillas', 'Tacos', 'Chavindecas', 'Postres', 'Alambres-Volcanes', 'Bebidas'];
		let navegacionPlatillos;
		let classTab;

		let entradas;
		let listadoEntradas;

		let quesadillas;
		let listadoQuesadillas;

		let tacos;
		let listadoTacos;

		let chavindecas;
		let listadoChavindecas;

		let postres;
		let listadoPostres;

		let alambresVolcanes;
		let listadoAlambresVolcanes;

		let bebidas;
		let listadoBebidas;

		let tabContent;

		if (!isEmpty(platillos)) {
			// Filtrado de platillos
			entradas = this.getFilter('Entradas');
			quesadillas = this.getFilter('Quesadillas');
			tacos = this.getFilter('Tacos');
			chavindecas = this.getFilter('Chavindecas');
			postres = this.getFilter('Postres');
			alambresVolcanes = this.getFilter('Alambres-Volcanes');
			bebidas = this.getFilter('Bebidas');

			// Tabla de platillos
			listadoEntradas = this.getBodyTable(entradas);
			listadoQuesadillas = this.getBodyTable(quesadillas);
			listadoTacos = this.getBodyTable(tacos);
			listadoChavindecas = this.getBodyTable(chavindecas);
			listadoPostres = this.getBodyTable(postres);
			listadoAlambresVolcanes = this.getBodyTable(alambresVolcanes);
			listadoBebidas = this.getBodyTable(bebidas);


			// Navegacion de platillos
			navegacionPlatillos = platillosDefault.map((platillo, index) => {
				if (index == 1) {
					classTab = 'active';
				} else {
					classTab = '';
				}

				return (
					<li key={ `navTab-${ index }` } className={ `${ classTab }` }>
						<a data-toggle="tab" href={ `#${ platillo }`}>
							{ platillo }
						</a>
					</li>
				);
			});


			// Contenido de los platillos
			tabContent = platillosDefault.map((platillo, index) => {
				if (index == 1) {
					classTab = 'in active';
				} else {
					classTab = '';
				}
				return (
					<div key={ `tabContent-${ index }`} id={ `${ platillo }`} className={ `tab-pane fade ${ classTab }`}>
						<h3> { platillo } </h3>

						<table className="table table-hover">
							<thead>
							    <tr>
							    	<th>Tipo</th>
							    	<th>Nombre</th>
							    	<th>Nombre Corto</th>
							    	<th>Precio</th>
							    </tr>
							</thead>
							{
								platillo == 'Entradas' ? listadoEntradas
								: platillo == 'Quesadillas' ? listadoQuesadillas
								: platillo == 'Tacos' ? listadoTacos
								: platillo == 'Chavindecas' ? listadoChavindecas
								: platillo == 'Postres' ? listadoPostres
								: platillo == 'Alambres-Volcanes' ? listadoAlambresVolcanes
								: platillo == 'Bebidas' ? listadoBebidas : ''
							}
						</table>
					</div>
				);
			});
		}

		return (
			<div>
				<div className='row'>
					<div className='col-md-12 col-xs-12'>
						<div className='col-md-1 col-xs-1'>
							<a className='back-menu' href='/menu/'>
								<i className='fa fa-arrow-left fa-3x' aria-hidden='true'></i>
							</a>
						</div>
						<h1 className='title'>
							Creación de Platillos
						</h1>
					</div>
				</div>
				<hr />

				<div className="col-md-6">
					<div className="new-users">
						<h3>Nuevo Platillo</h3>
						<div className='formulario'>
							<div className='form-group col-xs-12'>
								<label>Tipo</label>
								<select className='form-control' id="lang" ref='tipo' onChange={ this.obtenerValorInput.bind(this) } value={ this.state.tipoInput }>
									<option value="Quesadillas">Quesadillas</option>
									<option value="Tacos">Tacos</option>
									<option value="Entradas">Entradas</option>
									<option value="Chavindecas">Chavindecas</option>
									<option value="Alambres-Volcanes">Alambres y Volcanes</option>
									<option value="Postres">Postres</option>
									<option value="Bebidas">Bebidas</option>
								</select>
							</div>
							<div className='form-group col-xs-12'>
								<label>Nombre:</label>
								<input
									ref='nombre'
									type='text'
									className='form-control'
									onChange={ this.obtenerValorInput.bind(this) }
									value={ this.state.nombreInput }
								/>
							</div>
							<div className='form-group col-xs-12'>
								<label>Nombre Corto:</label>
								<input
									ref='nombreCorto'
									type='text'
									className='form-control'
									onChange={ this.obtenerValorInput.bind(this) }
									value={ this.state.nombreCortoInput }
								/>
							</div>
							<div className='form-group col-xs-12'>
								<label>Precio:</label>
								<input
									ref='precio'
									type='number'
									className='form-control'
									onChange={ this.obtenerValorInput.bind(this) }
									value={ this.state.precioInput }
								/>
							</div>

							<button className='btn btn-primary center-block btn-crear' onClick={ this.crearPlatillo.bind(this) }>
								Crear Platillo
							</button>
						</div>
					</div>
				</div>

				<div className="col-md-6">
					<div className="my-users">
						<h3>Mis Platillos</h3>

						<ul className="nav nav-tabs">
							{ navegacionPlatillos }
						</ul>

						<div className="tab-content">
							{ tabContent }
						</div>
					</div>
				</div>

			</div>
		);

	}
}

const MiMenuConnect = connect(store => ({ platillos: store.listadoPlatillos }))(MiMenu);


const reducer = combineReducers({
	listadoPlatillos: reductorObtenerMenu
});

const store = createStore(
	reducer, applyMiddleware(thunkMiddleware, promise));

const element = document.getElementById('react-mi-menu');
const dataUser = element.getAttribute('data-user');
const dataRol = element.getAttribute('data-rol');
const superUser = element.getAttribute('data-super-user');
const tokenCSRF = element.getAttribute('data-token');


ReactDOM.render(
	<Provider store={ store } >
		<MiMenuConnect user={ dataUser } rol={ dataRol } superUser={ superUser } />
	</Provider>,
	element
);
