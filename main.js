import React from "react";
import ReactDOM from "react-dom";
window.React = React;
var DataBase = {
	find : function(){
		var l = localStorage.length;
		var list = [];
		for(var i=0;i<l;i++){
			list.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
		}
		return list;
	},
	create : function(item){
		localStorage.setItem(item.id,JSON.stringify(item));
	},
	update : function(item){
		var data = JSON.parse(localStorage.getItem(item.id));
		for(var k in item){
			data[k] = item[k];
		}
		localStorage.setItem(item.id,JSON.stringify(data));
	},
	remove : function(id){
		localStorage.removeItem(id);
	}
}
var Header = React.createClass({
	create:function(e){
		if(e.keyCode==13&&e.target.value){
			this.props.payload.create({
				id : Date.now(),
				text : e.target.value,
				done : false
			});
			e.target.value = "";
		}
	},
	checkAll : function(e){
		this.props.payload.checkAll(e.target.checked);
	},
	render : function(){
		var payload = this.props.payload;
		console.log(payload);
		return (
			<header>
				<h1>TODOS</h1>
				<section className="item">
					<input onKeyUp={this.create} type="text" placeholder="input to be done ?"/>
				</section>
				<section className="item">
					<label><input type="checkbox" checked={payload.allDone} onChange={this.checkAll}/> check all completed</label>
				</section>
			</header>
			)
	}
})

var Main = React.createClass({
	remove : function(e){
		this.props.payload.remove(e.target.parentNode.id);
	},
	checkSingle : function(e){
		this.props.payload.checkSingle(e.target.parentNode.id,e.target.checked);
	},
	render : function(){
		var list = this.props.payload.list;
		var self = this;
		return (
				<main className="list">
					{
						list.map(function(item){
							return  (
								<div className="list-item" key={item.id} id={item.id}>
									<input type="checkbox" checked={item.done} onChange={self.checkSingle}/>
									<label style={{textDecoration:item.done?"line-through":"none"}}>{item.text}</label>
									<button className="remove" onClick={self.remove}>X</button>
								</div>
								)
						})
					}
				</main>
			)
	}
})

var Footer = React.createClass({
	removeDone : function(){
		this.props.payload.removeDone();
	},
	render : function(){
		var payload = this.props.payload;
		return (
			<footer>
				<label>{payload.left} item{payload.left>1?'s':''} left</label>
				<button className="removeDone" style={{
					display : payload.done?"inline-block":"none"
				}} onClick={this.removeDone}>clear all done</button>
			</footer>
			)
	}
})
var App = React.createClass({
	getInitialState : function(){
		return {
			list : DataBase.find()||[]
		}
	},
	create : function(item){
		DataBase.create(item);
		this.notify();
	},
	notify : function(){
		this.setState({
			list : DataBase.find()||[]
		});
	},
	checkAll : function(done){
		this.state.list.forEach(function(item){
			DataBase.update({
				id : item.id,
				done : done
			})
		});
		this.notify();
	},
	remove : function(id){
		DataBase.remove(id);
		this.notify();
	},
	checkSingle : function(id,done){
		DataBase.update({
			id:id,
			done : done
		})
		this.notify();
	},
	removeDone : function(){
		this.state.list.forEach(function(item){
			if(item.done)DataBase.remove(item.id);
		});
		this.notify();
	},
	render : function(){

		var list  = this.state.list,
			count = list.length,
			left  = list.filter(function(item){return !item.done;}).length,
			done  = count - left,
			allDone = (done == count)&&count;
			console.log(list);
		return (
			<section className="app">
				<Header payload={{
					allDone : allDone,
					checkAll:this.checkAll,
					create:this.create
				}}></Header>
				<Main payload={{
					list : list,
					remove : this.remove,
					checkSingle : this.checkSingle
				}}></Main> 
				<Footer payload={{
					left : left,
					done : done,
					removeDone:this.removeDone}}></Footer>
			</section>
			)
	}
})
ReactDOM.render(<App></App>,document.querySelector(".viewport"))