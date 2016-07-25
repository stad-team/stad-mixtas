import React from 'react';
import ReactDom from 'react-dom';

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

const OBTENER_MESAS = 'OBTENER_MESAS';;
const CREAR_MESA = 'CREAR_MESA';;

const actionObtenerMesas = () => {
	const respuesta = axios.get('http://mixtas-costeno/pedidos/api/mesas/');

	return {
		type: OBTENER_MESAS,
		payload: respuesta
	};
};

const actionCrearMesas = (name, location) => {
	const data = {
		name: name,
		location: location
	};

	const respuesta = axios.post('url', data);

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
	default:
		return state;
	}
};
////////////////////////////////////////////////


class Mesas extends React.Component {
	componentWillMount() {
		const { dispatch } = this.props;

		dispatch(actionObtenerMesas());
	}

	levantarPedido(id) {
		window.location = '/pedidos/alta/'+id;
	}

	render() {
		const { mesas } = this.props;

		const listadoMesas = mesas.map(mesa => {
			let sillas = [];
			for (var i = 0; i <= mesa.n_chairs; i++) {
				sillas.push('silla ' + i);
			}

			const muestraSillas = sillas.map((silla, index) => {
				return (
					<p key={ index }>
						{ silla }
					</p>
				);
			});

			return (
				<li className="mesa" key={ mesa.id }>
					<img
						src="/static/src/img/mesa.png"
						onClick={ this.levantarPedido.bind(this, mesa.id) }
					/>
					<div className="mesa-name">
						{ mesa.name }
					</div>
				</li>
			);
		});

		return(
			<div>
				<h1 className="title-mesas "> Mesas </h1>
				<hr />
				<div className="container">
					<ul className="list-inline">{ listadoMesas }</ul>
				</div>
			</div>
		);
	}
}

// conectar el component con redux
const MesasConnect = connect(store => ({ mesas: store.listadoMesas }))(Mesas);

const reducer = combineReducers({
	listadoMesas: reductorObtenerMesas
});

const store = createStore(
	reducer, applyMiddleware(thunkMiddleware, promise));

const element = document.getElementById('mesas');

ReactDom.render(
	<Provider store={ store } >
		<MesasConnect />
	</Provider>,
	element
);
