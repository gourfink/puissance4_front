import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import React from 'react';

const axios = require('axios');
const baseurl = 'http://127.0.0.1:8000';

export default class Grid extends React.Component{

	constructor(props) {
		super(props);
		this.state = {grid: [],p:1,winn:false};
	}

	componentDidMount(){
		this.gridRefresh();
	}

	gridPopulation(){
		var self = this;
		var datas = this.state.grid;

		var grid = [];
		let c = 0;
		for(let i = 0; i < 6; i++){
			let col = [];
			for(let j = 0; j < 7; j++ ){
				switch(datas[c]){
					case false:
					col.push(<Col key={c} onClick={self.move.bind(self, c)} data-id={c}><span className="noplayer"></span></Col>);
					break;
					case '1':
					col.push(<Col key={c} onClick={self.move.bind(self, c)} data-id={c}><span className="player1"></span></Col>);
					break;
					case '2':
					col.push(<Col key={c} onClick={self.move.bind(self, c)} data-id={c}><span className="player2"></span></Col>);
					break;
				}
				c++;
			}
			grid.push(<Row key={i}>{col}</Row>);
		}

		this.setState({
			grid:grid,
			p:this.state.p,
			winn:this.state.winn
		});
	}

	move = (id, e) => {
		var self = this;
		axios.get(baseurl+'/move', {
			params: {
				p: this.state.p,
				m: id
			}
		})
		.then(function (response) {
			if( response.data.auth === true ){
				self.gridRefresh();
				var p;
				if(self.state.p == 1){
					p = 2;
				}else{
					p = 1;
				}
				self.setState({ p:p, winn:response.data.winn })
			}
		});  
	}

	gridRefresh(){
		var self = this;
		axios.get(baseurl+'/grid')
		.then(function (response) {
			self.setState({ grid: response.data.data })
			self.gridPopulation();
		});
	}
	

	clearGame(e){
		var self = this;
		axios.get(baseurl+'/clear')
		.then(function (response) {
			self.gridRefresh();
			self.setState({ grid: [],p:1,winn:false })
		});
	}


	render() {

		let youWinn;
		if( this.state.winn !== false ){
			youWinn = <div className="youwinn">Le Joueur {this.state.winn} gagne :) </div>
		}

		return(
			<div className="game">
			<Container>
			{ this.state.grid }
			</Container>
			{youWinn}
			<div>Joueur {this.state.p} <button onClick={this.clearGame.bind(this)} >Recommencer</button></div>
			</div>
			);
	}


};