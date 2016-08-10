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

const OBTENER_FOLIOS = 'OBTENER_FOLIOS';

const actionObtenerFolios = () => {
	const today = new Date();
	const dd = today.getDate();
	const locale = 'en-us';
	const mm = today.toLocaleString(locale, {month: 'short'});
	const yyyy = today.getFullYear();

	const respuesta = axios.get(
		`http://mixtas-costeno/pedidos/api/folio/?date=${ mm }-${ dd }-${ yyyy }`,
		{
			headers: {
				'X-CSRFToken': tokenCSRF
			}
		}
	);

	return {
		type: OBTENER_FOLIOS,
		payload: respuesta
	};
};

////////////////////////////////////////////////


//     ____  __________  __  __________________  _____
//    / __ \/ ____/ __ \/ / / / ____/ ____/ __ \/ ___/
//   / /_/ / __/ / / / / / / / /   / __/ / /_/ /\__ \
//  / _, _/ /___/ /_/ / /_/ / /___/ /___/ _, _/___/ /
// /_/ |_/_____/_____/\____/\____/_____/_/ |_|/____/

const reductorObtenerFolios = (state=[], action) => {
	switch(action.type){
	case OBTENER_FOLIOS:
		return Object.assign([], state, action.payload.data);
	default:
		return state;
	}
};

////////////////////////////////////////////////


class CorteCaja extends React.Component {
	componentWillMount() {
		const { dispatch, user, rol } = this.props;

		if (user === 'AnonymousUser' || rol === 'mesero'){
			window.location = '/auth/logout';
		} else {
			dispatch(actionObtenerFolios());
		}
	}

	render() {
		const { folios } = this.props;

		let listadoFolios;
		let totalDia = 0;

		if (!isEmpty(folios)) {
			listadoFolios = folios.map(folio => {
				totalDia += folio.total;
				const date = new Date(folio.fecha);
				return (
					<tr>
						<td> { folio.id } </td>
						<td> { folio.nombreMesero } </td>
				     	<td> { date.getDate() }/{ date.toLocaleString('es', {month: 'long'}) }/{ date.getFullYear() } - { date.toLocaleTimeString() } </td>
				     	<td> { folio.total } </td>
					</tr>
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
						<h1 className='title-corte'> Corte Diario </h1>
					</div>
				</div>
				<hr />
				<div className='container'>
					<div className='col-md-12'>
						<div className='my-users'>
							<h3>Corte Diario</h3>
						 	<table className='table table-hover'>
								<thead>
								    <tr>
								    	<th>Folio</th>
								    	<th>Mesero</th>
								    	<th>Fecha</th>
								    	<th>Total</th>
								    </tr>
								</thead>
								<tbody key='orden-caja-1' className='orden-caja' >
									{ listadoFolios }
					    		</tbody>
							</table>
						</div>
						<h3> Total Dia </h3>
						<h3 className='total-dia'> { totalDia }</h3>
					</div>
				</div>
			</div>
		);
	}
}


const CorteCajaConnect = connect(store => ({folios : store.listadoFolios }))(CorteCaja);

const reducer = combineReducers({
	listadoFolios: reductorObtenerFolios
});

const store = createStore(
	reducer, applyMiddleware(thunkMiddleware, promise)
);

const element = document.getElementById('react-corte-caja');
const dataUser = element.getAttribute('data-user');
const dataRol = element.getAttribute('data-rol');
const tokenCSRF = element.getAttribute('data-token');


ReactDom.render(
	<Provider store={ store }>
		<CorteCajaConnect user={ dataUser } rol={ dataRol } />
	</Provider>,
	element
);



