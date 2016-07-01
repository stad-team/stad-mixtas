import React from 'react';
import ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import { reduxForm } from 'redux-form';
import { createStore, applyMiddleware, combineReducers, compose} from 'redux';
import promiseMiddleware from 'redux-promise';
import thunkMiddleware from 'redux-thunk';
import {reducer as formReducer} from 'redux-form';
import axios from 'axios';
import {NotificationContainer, NotificationManager} from 'react-notifications';


class Login extends React.Component{

	constructor(props){
		super(props);

		this.state = {
			username: ''
		};
	}

	handleChange(event){
		this.setState({
			username: event.target.value
		});
	}

	submit(){
		const request = axios.get(
			`http://127.0.0.1:8000/login/api/users/${ this.state.username }`
		).then(respuesta => {

			if (respuesta.status == 200 && respuesta.data.username === this.state.username) {
				NotificationManager.info('Acceso Correcto');
			}
		}).catch((errors) => {
			NotificationManager.error('Acceso Incorrecto');
		});
	}

	render(){

		return (
			<div>
				<h1>
					Login
				</h1>

				<input
					type='text'
					placeholder='Nombre'
					onChange={ this.handleChange.bind(this) }
				/>
				<button onClick={ this.submit.bind(this) }
					id='create-business-button'
					type="btn"
					className="btn btn-primary"
				>
					Acceder
				</button>

				{ this.state.username }

				<NotificationContainer />
			</div>
		);
	}
}


ReactDOM.render(
	<Login />,
	document.getElementById('react-login')
);




