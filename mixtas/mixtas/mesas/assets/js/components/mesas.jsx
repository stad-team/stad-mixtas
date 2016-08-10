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

const OBTENER_MESAS = 'OBTENER_MESAS';
const CREAR_MESA = 'CREAR_MESA';

const actionObtenerMesas = () => {
	const respuesta = axios.get('http://mixtas-costeno/pedidos/api/mesas/');

	return {
		type: OBTENER_MESAS,
		payload: respuesta
	};
};

const actionCrearMesa = (nombre, descripcion, locacion, numSillas) => {
	const respuesta = axios.post('http://mixtas-costeno/pedidos/api/mesas/',
		{
			name: nombre,
			description: descripcion,
			location: locacion,
			n_chairs: numSillas,
			n_people: 0,
			status: false
		},
		{
			headers: {
				'X-CSRFToken': tokenCSRF
			}
		}
	);

	return {
		type: CREAR_MESA,
		payload: respuesta
	};
};
////////////////////////////////////////////////

//     ____  __________  __  __________________  _____
//    / __ \/ ____/ __ \/ / / / ____/ ____/ __ \/ ___/
//   / /_/ / __/ / / / / / / / /   / __/ / /_/ /\__ \
//  / _, _/ /___/ /_/ / /_/ / /___/ /___/ _, _/___/ /
// /_/ |_/_____/_____/\____/\____/_____/_/ |_|/____/

const reductorObtenerMesas = (state=[], action) => {
	switch(action.type){
	case OBTENER_MESAS:
		return Object.assign([], state, action.payload.data);
	case CREAR_MESA:
		return state.concat(action.payload.data);
	default:
		return state;
	}
};
////////////////////////////////////////////////

class Mesas extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			nombreInput: '',
			descripcionInput: '',
			locacionInput: '',
			numSillasInput: ''
		};
	}

	componentWillMount() {
		const { dispatch, user, rol } = this.props;

		if (user === 'AnonymousUser' || rol === 'mesero') {
			window.location = '/auth/logout';
		} else {
			dispatch(actionObtenerMesas());
		}
	}

	obtenerValorInput() {
		const { nombre, descripcion, locacion, numSillas } = this.refs;

		this.setState({
			nombreInput: nombre.value,
			descripcionInput: descripcion.value,
			locacionInput: locacion.value,
			numSillasInput: numSillas.value,
		});
	}

	crearMesa() {
		const { dispatch } = this.props;
		const { nombreInput, descripcionInput, locacionInput, numSillasInput } = this.state;

		dispatch(actionCrearMesa(nombreInput, descripcionInput, locacionInput, numSillasInput));

		this.setState({
			nombreInput: '',
			descripcionInput: '',
			locacionInput: '',
			numSillasInput: ''
		});
	}

	render() {
		const { mesas } = this.props;

		let listado = null;

		if (!isEmpty(mesas)) {
			listado = mesas.map(mesa => {
				return (
						<tbody key={ mesa.id }>
						    <tr >
						     	<td>{ mesa.name }</td>
						     	<td> { mesa.description }</td>
						     	<td> { mesa.location }</td>
						     	<td> { mesa.n_chairs }</td>
						    </tr>
					    </tbody>
				);
			});
		}

		return (
			<div>
				<h1 className='title'>
					Creación de Mesas
				</h1>
				<hr />

				<div className="col-md-6">
					<div className="new-users">
						<h3>Nueva Mesa</h3>
						<div className='formulario'>
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
								<label>Descripcion:</label>
								<input
									ref='descripcion'
									type='text'
									className='form-control'
									onChange={ this.obtenerValorInput.bind(this) }
									value={ this.state.descripcionInput }
								/>
							</div>
							<div className='form-group col-xs-12'>
								<label>Locacion:</label>
								<input
									ref='locacion'
									type='text'
									className='form-control'
									onChange={ this.obtenerValorInput.bind(this) }
									value={ this.state.locacionInput }
								/>
							</div>
							<div className='form-group col-xs-12'>
								<label># Sillas:</label>
								<input
									ref='numSillas'
									type='text'
									className='form-control'
									onChange={ this.obtenerValorInput.bind(this) }
									value={ this.state.numSillasInput }
								/>
							</div>

							<button className='btn btn-primary center-block btn-crear' onClick={ this.crearMesa.bind(this) }>
								Crear Mesa
							</button>
						</div>
					</div>
				</div>

				<div className="col-md-6">
					<div className="my-users">
						<h3>Mis Mesas</h3>
					 	<table className="table table-hover">
							<thead>
							    <tr>
							    	<th>Mesa</th>
							    	<th>Descripcion</th>
							    	<th>Locacion</th>
							    	<th># Sillas</th>
							    </tr>
							</thead>
							{ listado }
						</table>
					</div>
				</div>

			</div>
		);
	}
}

const MesasConnect = connect(store => ({ mesas: store.listadoMesas }))(Mesas);


const reducer = combineReducers({
	listadoMesas: reductorObtenerMesas
});

const store = createStore(
	reducer, applyMiddleware(thunkMiddleware, promise));

const element = document.getElementById('react-mesas');
const dataUser = element.getAttribute('data-user');
const dataRol = element.getAttribute('data-rol');
const superUser = element.getAttribute('super-user');
const tokenCSRF = element.getAttribute('data-token');

ReactDOM.render(
	<Provider store={ store } >
		<MesasConnect user={ dataUser } rol={ dataRol } superUser={ superUser } />
	</Provider>,
	element
);