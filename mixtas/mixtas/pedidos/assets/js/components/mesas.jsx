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
const CREAR_MESA_LLEVAR = 'CREAR_MESA_LLEVAR';

const actionObtenerMesas = () => {
	const respuesta = axios.get(
		'http://mixtas-costeno/pedidos/api/mesas/',
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

const actionCrearMesaLlevar = () => {
	const respuesta = axios.post(
		'http://mixtas-costeno/pedidos/api/mesas/',
		{
			name: 'Para Llevar',
			description: 'Orden para llevar',
			location: 'Llevar',
			n_chairs: 0,
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
		type: CREAR_MESA_LLEVAR,
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
	case CREAR_MESA_LLEVAR:
		return state.concat(action.payload.data);
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

	levantarPedido(id, idOrdenMesa) {
		if (idOrdenMesa) {
			window.location = '/pedidos/alta/'+id+'/'+idOrdenMesa;
		} else {
			window.location = '/pedidos/alta/'+id+'/new';
		}
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
				srcImagen = '/static/src/img/lleva.png';
			} else if (mesa.location == 'Barra') {
				srcImagen = '/static/src/img/barrita.png';
			} else {
				srcImagen = '/static/src/img/mesa.png';
			}

			return (
				<li className="mesa" key={ mesa.id }>
					<img className="image-element"
						src={ srcImagen }
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
	}

	crearMesaLlevar() {
		const { dispatch } = this.props;

		dispatch(actionCrearMesaLlevar());
	}

	render() {
		const { mesas, rol } = this.props;

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
							<button className='mas btn btn-success btn-lg pull-left' onClick={ this.crearMesaLlevar.bind(this) }>
								<i className='fa fa-plus' aria-hidden='true'></i>
							</button>
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

const element = document.getElementById('mesas');
const dataRol = element.getAttribute('data-rol');
const tokenCSRF = element.getAttribute('data-token');

ReactDom.render(
	<Provider store={ store } >
		<MesasConnect rol={ dataRol }/>
	</Provider>,
	element
);
