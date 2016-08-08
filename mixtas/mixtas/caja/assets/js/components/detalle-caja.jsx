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
	componentWillMount() {
		const { dispatch, idOrdenMesa } = this.props;

		dispatch(actionObtenerOrdenes(idOrdenMesa));
	}

	cobrar() {
		const { mesa, idOrdenMesa } = this.props;

		axios.patch(`http://mixtas-costeno/pedidos/api/folio/${ idOrdenMesa }`,
			{
				pagado: true
			},
			{
				headers: {
					'X-CSRFToken': tokenCSRF
				}
			}
		).then(responseFolio => {
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
			).then(responseMesa => {
				window.location = '/caja/';
			});
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
			<div className='container'>
				<div className='col-md-12'>
					<div className='my-users'>
						<h3>Pedidos</h3>
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
					<button className='btn btn-lg btn-block btn-success' onClick={ this.cobrar.bind(this) }>
						Cobrar
					</button>
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

ReactDom.render(
	<Provider store={ store } >
		<DetalleCajaConnect idOrdenMesa={ idOrdenMesa } mesa={ dataMesa }/>
	</Provider>,
	element
);


