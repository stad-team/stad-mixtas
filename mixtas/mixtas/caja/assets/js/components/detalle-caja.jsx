import React from 'react';
import ReactDom from 'react-dom';

import { connect, Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import promise from 'redux-promise';
import thunkMiddleware from 'redux-thunk';

import { isEmpty, remove } from 'lodash';

//     ___   ____________________  _   _______
//    /   | / ____/_  __/  _/ __ \/ | / / ___/
//   / /| |/ /     / /  / // / / /  |/ /\__ \
//  / ___ / /___  / / _/ // /_/ / /|  /___/ /
// /_/  |_\____/ /_/ /___/\____/_/ |_//____/

import axios from 'axios';

const OBTENER_ORDENES = 'OBTENER_ORDENES';
const OBTENER_MESAS2 = 'OBTENER_MESAS2';

const actionObtenerOrdenes = (id) => {
	const respuesta = axios.get(
		`http://mixtas-costeno/pedidos/api/orden/?idOrdenMesa=${ id }`,
		{
			headers: {
				'X-CSRFToken': tokenCSRF
			}
		}
	);

	return {
		type: OBTENER_ORDENES,
		payload: respuesta
	};
};

////////////////////////////////////////////////


//     ____  __________  __  __________________  _____
//    / __ \/ ____/ __ \/ / / / ____/ ____/ __ \/ ___/
//   / /_/ / __/ / / / / / / / /   / __/ / /_/ /\__ \
//  / _, _/ /___/ /_/ / /_/ / /___/ /___/ _, _/___/ /
// /_/ |_/_____/_____/\____/\____/_____/_/ |_|/____/

const reductorObtenerOrdenes = (state=[], action) => {
	switch(action.type){
	case OBTENER_ORDENES:
		return Object.assign([], state, action.payload.data);
	default:
		return state;
	}
};

////////////////////////////////////////////////



class DetalleCaja extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			qsFinal: []
		};
	}

	componentWillMount() {
		const { dispatch, idOrdenMesa, user, rol } = this.props;

		if (user === 'AnonymousUser' || rol === 'mesero') {
			window.location = '/auth/logout';
		} else {
			dispatch(actionObtenerOrdenes(idOrdenMesa));
		}
	}

	imprimir(total, qsFinal, qsTotal) {
		const { mesa, idOrdenMesa, locacion, user, ordenes } = this.props;

		axios.patch(`http://mixtas-costeno/pedidos/api/folio/${ idOrdenMesa }`,
			{
				total: total,
				qsFinal: qsFinal,
				qsTotal: qsTotal,
				mesa: mesa,
				folio: idOrdenMesa,
				mesero: user,
				print: 'imprimir'
			},
			{
				headers: {
					'X-CSRFToken': tokenCSRF
				}
			}
		);

	}

	cobrar(total, qsFinal, qsTotal) {
		const { mesa, idOrdenMesa, locacion, user, ordenes } = this.props;

		axios.patch(`http://mixtas-costeno/pedidos/api/folio/${ idOrdenMesa }`,
			{
				pagado: true,
				total: total,
				qsFinal: qsFinal,
				qsTotal: qsTotal,
				mesa: mesa,
				folio: idOrdenMesa,
				mesero: user
			},
			{
				headers: {
					'X-CSRFToken': tokenCSRF
				}
			}
		).then(responseFolio => {
			if (locacion == 'Llevar') {
				axios.delete(`http://mixtas-costeno/pedidos/api/mesas/${ mesa }`,
					{
						headers: {
							'X-CSRFToken': tokenCSRF
						}
					}
				).then(responseMesa1 => {
					window.location = '/caja/';
				});
			} else {
				axios.patch(`http://mixtas-costeno/pedidos/api/mesas/${ mesa }`,
					{
						status: false,
						idOrdenMesa: null
					},
					{
						headers: {
							'X-CSRFToken': tokenCSRF
						}
					}
				).then(responseMesa2 => {
					window.location = '/caja/';
				});
			}

		});
	}

	render() {
		const { ordenes } = this.props;

		let listadoOrdenes;
		let total;
		let precioFinal = 0;
		let totalPersona = 0;
		let muestraTotalPersona;
		let clienteFinal;
		let indexqsSinExtras;

		let qsSinExtras;
		let qsExtras;
		let qsFinal = [];

		if (!isEmpty(ordenes)) {

			qsSinExtras = remove(ordenes, orden => {
				return orden.cliente != 'extra';
			});
			qsExtras = remove(ordenes, orden => {
				return orden.cliente == 'extra';
			});

			// Agregar Extras al qsFinal
			qsFinal.push(qsExtras);

			indexqsSinExtras = qsSinExtras.length;
			clienteFinal = qsSinExtras.sort( (a, b) => {
				return parseFloat(a.cliente) - parseFloat(b.cliente);
			})[indexqsSinExtras - 1].cliente;

			for (var i = 1; i <= clienteFinal; i++) {
				qsFinal.push(
					qsSinExtras.filter(orden => {
						return parseInt(orden.cliente) == i;
					})
				);
			}

			listadoOrdenes = qsFinal.map((orden, index) => {
				totalPersona = 0;
				muestraTotalPersona = (<td></td>);

				return orden.map((obj, index) => {
					totalPersona += obj.precio;
					precioFinal += obj.precio;
					if (index + 1 == orden.length) {
						muestraTotalPersona = (
							<td className='total-persona'> { totalPersona } </td>
						);
					}

					return (
						<tr>
							<td> { obj.cliente } </td>
							<td> { obj.cantidad } </td>
					     	<td> { obj.platillo } </td>
					     	<td> { obj.precio } </td>
					     	{ muestraTotalPersona }
						</tr>
					);
				});
			});
		}

		return (
			<div>
				<div className='row'>
					<div className='col-md-12 col-xs-12'>
						<div className='col-md-1 col-xs-1'>
							<a className='back-menu' href='/caja/'>
								<i className='fa fa-arrow-left fa-3x' aria-hidden='true'></i>
							</a>
						</div>
						<h1 className='title-caja'> Detalle Caja </h1>
					</div>
				</div>
				<hr />
				<div className='container'>
					<div className='col-md-12'>
						<div className='my-users'>
							<h3>Pedidos</h3>
							<button className='btn btn-lg btn-block btn-success' onClick={ this.imprimir.bind(this, precioFinal, qsFinal, precioFinal) }>
								IMPRIMIR
							</button>
						 	<table className='table table-hover'>
								<thead>
								    <tr>
								    	<th>Cliente</th>
								    	<th>Cantidad</th>
								    	<th>Platillo</th>
								    	<th>Precio</th>
								    	<th>TOTAL</th>
								    </tr>
								</thead>
								<tbody key='orden-caja-1' className='orden-caja' >
									{ listadoOrdenes }
									<tr>
										<td></td>
										<td></td>
								     	<td></td>
								     	<td></td>
								     	<td style={{backgroundColor: 'orange'}}> { precioFinal } </td>
									</tr>
					    		</tbody>
							</table>
						</div>
						<button className='btn btn-lg btn-block btn-success' onClick={ this.cobrar.bind(this, precioFinal, qsFinal, precioFinal) }>
							Cobrar
						</button>
					</div>
				</div>
			</div>
		);
	}
}


// conectar el component con redux
export const DetalleCajaConnect = connect(store => ({ ordenes: store.listadoOrdenes }))(DetalleCaja);

const reducer = combineReducers({
	listadoOrdenes: reductorObtenerOrdenes
});

const store = createStore(
	reducer, applyMiddleware(thunkMiddleware, promise));

const element = document.getElementById('react-detalle-caja');
const idOrdenMesa = element.getAttribute('data-idOrdenMesa');
const tokenCSRF = element.getAttribute('data-token');
const dataMesa = element.getAttribute('data-mesa');
const dataLocacionMesa = element.getAttribute('data-locacion-mesa');

const elementUser = document.getElementById('user');
const dataUser = elementUser.getAttribute('data-user');
const dataRol = elementUser.getAttribute('data-rol');

ReactDom.render(
	<Provider store={ store } >
		<DetalleCajaConnect locacion={ dataLocacionMesa } idOrdenMesa={ idOrdenMesa } mesa={ dataMesa } user={ dataUser } rol={ dataRol }/>
	</Provider>,
	element
);


