import React from 'react';
import ReactDom from 'react-dom';

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

const actionObtenerMesas = () => {
	const respuesta = axios.get(
		'http://mixtas-costeno/pedidos/api/mesas/?caja=True',
		{
			headers: {
				'X-CSRFToken': tokenCSRF
			}
		}
	);

	return {
		type: OBTENER_MESAS,
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
		const { dispatch, user, rol } = this.props;

		if (user === 'AnonymousUser' || rol === 'mesero') {
			window.location = '/auth/logout';
		} else {
			dispatch(actionObtenerMesas());
		}
	}

	levantarPedido(mesa, locacion, idOrdenMesa) {
		window.location = `/caja/detalle-caja/${ mesa }/${ locacion }/${ idOrdenMesa }`;
	}

	getMesas(tipoMesa) {
		const { mesas } = this.props;

		return mesas.filter(mesa => {
			return mesa.location == tipoMesa;
		});
	}

	getListadoMesas(mesas) {
		return mesas.map(mesa => {
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

			let srcImagen;

			if (mesa.location == 'Llevar') {
				srcImagen = 'http://icon-icons.com/icons2/549/PNG/512/1455739788_Kitchen_Bold_Line_Color_Mix-05_icon-icons.com_53393.png';
			} else if (mesa.location == 'Barra') {
				srcImagen = 'https://image.freepik.com/iconos-gratis/mesa-de-la-cocina-y-los-asientos-conjunto-de-muebles_318-63454.png'
			} else {
				srcImagen = '/static/src/img/mesa.png';
			}

			return (
				<li className="mesa" key={ mesa.id }>
					<img
						src={ srcImagen }
						onClick={ this.levantarPedido.bind(this, mesa.id, mesa.location, mesa.idOrdenMesa) }
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
	}

	render() {
		const { mesas } = this.props;

		let mesasP1;
		let listadoMesasP1;

		let mesasP2;
		let listadoMesasP2;

		let barra;
		let listadoBarra;

		let llevar;
		let listadoParaLlevar;

		if (!isEmpty(mesas)) {
			mesasP1 = this.getMesas('P1');
			mesasP2 = this.getMesas('P2');
			barra = this.getMesas('Barra');
			llevar = this.getMesas('Llevar');

			listadoMesasP1 = this.getListadoMesas(mesasP1);
			listadoMesasP2 = this.getListadoMesas(mesasP2);
			listadoBarra = this.getListadoMesas(barra);
			listadoParaLlevar = this.getListadoMesas(llevar);
		}


		return(
			<div>
				<div className='row'>
					<div className='col-md-12 col-xs-12'>
						<div className='col-md-1 col-xs-1'>
							<a className='back-menu' href='/menu/'>
								<i className='fa fa-arrow-left fa-3x' aria-hidden='true'></i>
							</a>
						</div>
						<h1 className='title-caja'> Caja </h1>
					</div>
				</div>
				<hr />
				<div className="container">
					<ul className="nav nav-tabs">
						<li className="active"><a data-toggle="tab" href="#P1">Planta Baja</a></li>
						<li><a data-toggle="tab" href="#P2">Planta Alta</a></li>
						<li><a data-toggle="tab" href="#Barra">Barra</a></li>
						<li><a data-toggle="tab" href="#Llevar">Para Llevar</a></li>
					</ul>

					<div className="tab-content">
						<div id="P1" className="tab-pane fade in active">
							<h3>Planta Baja</h3>
							<ul className="list-inline">{ listadoMesasP1 }</ul>
						</div>
						<div id="P2" className="tab-pane fade">
							<h3>Planta Alta</h3>
							<ul className="list-inline">{ listadoMesasP2 }</ul>
						</div>
						<div id="Barra" className="tab-pane fade">
							<h3>Barra</h3>
							<ul className="list-inline">{ listadoBarra }</ul>
						</div>
						<div id="Llevar" className="tab-pane fade">
							<h3>Para Llevar</h3>
							<ul className="list-inline">{ listadoParaLlevar }</ul>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

// conectar el component con redux
export const MesasConnect = connect(store => ({ mesas: store.listadoMesas }))(Mesas);

const reducer = combineReducers({
	listadoMesas: reductorObtenerMesas
});

const store = createStore(
	reducer, applyMiddleware(thunkMiddleware, promise));

const element = document.getElementById('react-caja');
const dataUser = element.getAttribute('data-user');
const dataRol = element.getAttribute('data-rol');
const tokenCSRF = element.getAttribute('data-token');

ReactDom.render(
	<Provider store={ store } >
		<MesasConnect user={ dataUser } rol={ dataRol }/>
	</Provider>,
	element
);
