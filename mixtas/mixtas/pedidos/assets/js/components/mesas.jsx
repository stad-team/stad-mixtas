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

const OBTENER_MESAS1 = 'OBTENER_MESAS1';
const OBTENER_MESAS2 = 'OBTENER_MESAS2';

const actionObtenerMesasP1 = () => {
	const respuesta = axios.get(
		'http://mixtas-costeno/pedidos/api/mesas/?floor=P1',
		{
			headers: {
				'X-CSRFToken': tokenCSRF
			}
		}
	);

	return {
		type: OBTENER_MESAS1,
		payload: respuesta
	};
};

const actionObtenerMesasP2 = () => {
	const respuesta = axios.get(
		'http://mixtas-costeno/pedidos/api/mesas/?floor=P2',
		{
			headers: {
				'X-CSRFToken': tokenCSRF
			}
		}
	);

	return {
		type: OBTENER_MESAS2,
		payload: respuesta
	};
};
////////////////////////////////////////////////


//     ____  __________  __  __________________  _____
//    / __ \/ ____/ __ \/ / / / ____/ ____/ __ \/ ___/
//   / /_/ / __/ / / / / / / / /   / __/ / /_/ /\__ \
//  / _, _/ /___/ /_/ / /_/ / /___/ /___/ _, _/___/ /
// /_/ |_/_____/_____/\____/\____/_____/_/ |_|/____/

const reductorObtenerMesas1 = (state=[], action) => {
	switch(action.type){
	case OBTENER_MESAS1:
		return Object.assign([], state, action.payload.data);
	default:
		return state;
	}
};

const reductorObtenerMesas2 = (state=[], action) => {
	switch(action.type){
	case OBTENER_MESAS2:
		return Object.assign([], state, action.payload.data);
	default:
		return state;
	}
};
////////////////////////////////////////////////


class Mesas extends React.Component {
	componentWillMount() {
		const { dispatch } = this.props;

		dispatch(actionObtenerMesasP1());
		dispatch(actionObtenerMesasP2());
	}

	levantarPedido(id, idOrdenMesa) {
		if (idOrdenMesa) {
			window.location = '/pedidos/alta/'+id+'/'+idOrdenMesa;
		} else {
			window.location = '/pedidos/alta/'+id+'/new';
		}
	}

	render() {
		const { mesas1, mesas2, rol } = this.props;

		const listadoMesas1 = mesas1.map(mesa => {
			let mesaStatus;
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

			if (mesa.status) {
				mesaStatus = 'text-danger';
			} else {
				mesaStatus = 'text-success';
			}

			return (
				<li className="mesa" key={ mesa.id }>
					<img
						src="/static/src/img/mesa.png"
						onClick={ this.levantarPedido.bind(this, mesa.id, mesa.idOrdenMesa) }
					/>
					<span className="fa-stack fa-lg">
						<i className={ `fa fa-circle fa-stack-2x ${ mesaStatus }` }></i>
						<i className="fa fa-lightbulb-o fa-stack-1x fa-inverse"></i>
					</span>
					<div className="mesa-name">
						{ mesa.name }
					</div>
				</li>
			);
		});

		const listadoMesas2 = mesas2.map(mesa => {
			let mesaStatus;
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

			if (mesa.status) {
				mesaStatus = 'text-danger';
			} else {
				mesaStatus = 'text-success';
			}

			return (
				<li className="mesa" key={ mesa.id }>
					<img
						src="/static/src/img/mesa.png"
						onClick={ this.levantarPedido.bind(this, mesa.id, mesa.idOrdenMesa) }
					/>
					<span className="fa-stack fa-lg">
						<i className={ `fa fa-circle fa-stack-2x ${ mesaStatus }` }></i>
						<i className="fa fa-lightbulb-o fa-stack-1x fa-inverse"></i>
					</span>
					<div className="mesa-name">
						{ mesa.name }
					</div>
				</li>
			);
		});


		let backButton;

		if (rol !== 'mesero') {
			backButton = (
				<a className='back-menu' href='/menu/'>
					<i className='fa fa-arrow-left fa-3x' aria-hidden='true'></i>
				</a>
			);
		}

		return(
			<div>
				<div className='row'>
					<div className='col-md-12 col-xs-12'>
						<div className='col-md-1 col-xs-1'>
							{ backButton }
						</div>
						<h1 className="title-mesas"> Mesas </h1>
					</div>
				</div>
				<hr />
				<div className="container">
					<ul className="nav nav-tabs">
						<li className="active"><a data-toggle="tab" href="#home">Planta Baja</a></li>
						<li><a data-toggle="tab" href="#menu1">Planta Alta</a></li>
					</ul>

					<div className="tab-content">
						<div id="home" className="tab-pane fade in active">
							<h3>Planta Baja</h3>
							<ul className="list-inline">{ listadoMesas1 }</ul>
						</div>
						<div id="menu1" className="tab-pane fade">
							<h3>Planta Alta</h3>
							<ul className="list-inline">{ listadoMesas2 }</ul>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

// conectar el component con redux
export const MesasConnect = connect(store => ({ mesas1: store.listadoMesas1, mesas2: store.listadoMesas2 }))(Mesas);

const reducer = combineReducers({
	listadoMesas1: reductorObtenerMesas1,
	listadoMesas2: reductorObtenerMesas2
});

const store = createStore(
	reducer, applyMiddleware(thunkMiddleware, promise));

const element = document.getElementById('mesas');
const dataRol = element.getAttribute('data-rol');
const tokenCSRF = element.getAttribute('data-token');

ReactDom.render(
	<Provider store={ store } >
		<MesasConnect rol={ dataRol }/>
	</Provider>,
	element
);
