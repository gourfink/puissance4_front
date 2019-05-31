import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import React from 'react';

const axios = require('axios');
const baseurl = 'http://192.168.99.1:8000';

export default class Grid extends React.Component{

	constructor(props) {
		super(props);
		this.state = {grid: [],p:1};
	}

	componentDidMount(){
		this.gridRefresh();
	}

	gridPopulation(){
		var self = this;
		var datas = this.state.grid;
		console.log(datas);
		var grid = [];
		let c = 0;
		for(let i = 0; i < 6; i++){
			let col = [];
			for(let j = 0; j < 7; j++ ){
				switch(datas[c]){
					case false:
					col.push(<Col key={c} onClick={() => self.move(c)} data-id={c}><span>{c}</span></Col>);
					break;
					case 1:
					col.push(<Col key={c} onClick={() => self.move(c)} data-id={c}><span>Joueur 1</span></Col>);
					break;
					case 2:
					col.push(<Col key={c} onClick={() => self.move(c)} data-id={c}><span>Joueur 2</span></Col>);
					break;
				}
				c++;
			}
			grid.push(<Row key={i}>{col}</Row>);
		}

		this.setState({
			grid:grid,
			p:this.state.p
		});
	}

	move(id){
		var self = this;
		axios.get(baseurl+'/move', {
			params: {
				p: this.state.p,
				m:id

			}
		})
		.then(function (response) {
			self.gridRefresh();
			var p;
			if(self.state.p == 1){
				p = 2;
			}else{
				p = 1;
			}
			self.setState({ p:p })
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


	render() {

		return(
			<div className="game">
			<Container>
			{ this.state.grid }
			</Container>
			</div>
			);
	}


};