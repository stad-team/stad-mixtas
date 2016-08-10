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

const OBTENER_USUARIOS = 'OBTENER_USUARIOS';
const CREAR_USUARIO = 'CREAR_USUARIO';

const actionObtenerUsuarios = () => {
	const respuesta = axios.get('http://mixtas-costeno/usuarios/api/usuarios/');

	return {
		type: OBTENER_USUARIOS,
		payload: respuesta
	};
};

const actionCrearUsuario = (nombre, password, puesto) => {
	const respuesta = axios.post('http://mixtas-costeno/usuarios/api/usuarios/',
		{
			username: nombre,
			password: password,
			first_name: puesto
		},
		{
			headers: {
				'X-CSRFToken': tokenCSRF
			}
		}
	);

	return {
		type: CREAR_USUARIO,
		payload: respuesta
	};
};
////////////////////////////////////////////////

//     ____  __________  __  __________________  _____
//    / __ \/ ____/ __ \/ / / / ____/ ____/ __ \/ ___/
//   / /_/ / __/ / / / / / / / /   / __/ / /_/ /\__ \
//  / _, _/ /___/ /_/ / /_/ / /___/ /___/ _, _/___/ /
// /_/ |_/_____/_____/\____/\____/_____/_/ |_|/____/

const reductorObtenerUsuarios = (state=[], action) => {
	switch(action.type){
	case OBTENER_USUARIOS:
		return Object.assign([], state, action.payload.data);
	case CREAR_USUARIO:
		return state.concat(action.payload.data);
	default:
		return state;
	}
};
////////////////////////////////////////////////

class Usuarios extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			nombreInput: '',
			passwordInput: '',
			puestoInput: ''
		};
	}

	componentWillMount() {
		const { dispatch, user, rol } = this.props;

		if (user === 'AnonymousUser' || rol === 'mesero') {
			window.location = '/auth/logout';
		} else {
			dispatch(actionObtenerUsuarios());
		}
	}

	obtenerValorInput() {
		const { nombre, password, puesto } = this.refs;

		this.setState({
			nombreInput: nombre.value,
			passwordInput: password.value,
			puestoInput: puesto.value
		});
	}

	crearUsuario() {
		const { dispatch } = this.props;
		const { nombreInput, passwordInput, puestoInput } = this.state;

		dispatch(actionCrearUsuario(nombreInput, passwordInput, puestoInput));

		this.setState({
			nombreInput: '',
			passwordInput: '',
			puestoInput: ''
		});
	}

	render() {
		const { usuarios } = this.props;

		let listado = null;

		if (!isEmpty(usuarios)) {
			listado = usuarios.map(usuario => {
				return (
						<tbody key={ usuario.id }>
						    <tr >
						     	<td>{ usuario.username }</td>
						     	<td> { usuario.first_name}</td>
						    </tr>
					    </tbody>
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
							Creación de Usuarios
						</h1>
					</div>
				</div>
				<hr />

				<div className="col-md-6">
					<div className="new-users">
						<h3>Nuevo Usuario</h3>
						<div className='formulario'>
							<div className='form-group col-xs-12'>
								<label>Password:</label>
								<input
									ref='password'
									type='password'
									className='form-control'
									onChange={ this.obtenerValorInput.bind(this) }
									value={ this.state.passwordInput }
								/>
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
								<label>Puesto</label>
								<select className='form-control' id="lang" ref='puesto' onChange={ this.obtenerValorInput.bind(this) } value={ this.state.puestoInput }>
									<option value="admin">Admin</option>
									<option value="cajero">Cajero</option>
									<option value="mesero">Mesero</option>
								</select>
							</div>

							<button className='btn btn-primary center-block btn-crear' onClick={ this.crearUsuario.bind(this) }>
								Crear usuario
							</button>
						</div>
					</div>
				</div>

				<div className="col-md-6">
					<div className="my-users">
						<h3>Mis Usuarios</h3>
					 	<table className="table table-hover">
							<thead>
							    <tr>
							    	<th>Usuarios</th>
							    	<th>Puesto</th>
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

const UsuariosConnect = connect(store => ({ usuarios: store.listadoUsuarios }))(Usuarios);


const reducer = combineReducers({
	listadoUsuarios: reductorObtenerUsuarios
});

const store = createStore(
	reducer, applyMiddleware(thunkMiddleware, promise));

const element = document.getElementById('react-usuarios');
const dataUser = element.getAttribute('data-user');
const dataRol = element.getAttribute('data-rol');
const superUser = element.getAttribute('data-super-user');
const tokenCSRF = element.getAttribute('data-token');

ReactDOM.render(
	<Provider store={ store } >
		<UsuariosConnect user={ dataUser } rol={ dataRol } superUser={ superUser } />
	</Provider>,
	element
);