(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{35:function(t,e,a){t.exports=a(73)},70:function(t,e){},73:function(t,e,a){"use strict";a.r(e);var n=a(0),s=a.n(n),r=a(32),i=a.n(r),o=a(2),c=a(3),l=a(1),u=a(5),h=a(4),p=function(t){Object(u.a)(a,t);var e=Object(h.a)(a);function a(t){var n;return Object(o.a)(this,a),(n=e.call(this,t)).name="",n}return Object(c.a)(a,[{key:"render",value:function(){return s.a.createElement("div",{className:"Background"},s.a.createElement("h1",null,"The game"),s.a.createElement("label",null,"Please enter your name:"),s.a.createElement("input",{onChange:this.props.setName}),s.a.createElement("button",{onClick:this.props.play},"Continue"))}}]),a}(n.Component),m=function(t){Object(u.a)(a,t);var e=Object(h.a)(a);function a(t){return Object(o.a)(this,a),e.call(this,t)}return Object(c.a)(a,[{key:"render",value:function(){return s.a.createElement("div",{className:"Background"},s.a.createElement("div",null,"PLAYERS"),this.props.players.map((function(t){return s.a.createElement("div",{key:t.id},t.name,t.gameLeader&&" * GAMELEADER",t.finished&&" FINISHED w/ ".concat(t.speed," WPM"))})),s.a.createElement("div",null,"SPECTATORS"),this.props.spectators.map((function(t){return s.a.createElement("div",{key:t.id},t.name)})))}}]),a}(n.Component),d=a(34),v=function(t){Object(u.a)(a,t);var e=Object(h.a)(a);function a(t){var n;return Object(o.a)(this,a),(n=e.call(this,t)).state={words:0},n.textInput=s.a.createRef(),n.updateParent=n.updateParent.bind(Object(l.a)(n)),n.disallowMultipleSpace=n.disallowMultipleSpace.bind(Object(l.a)(n)),n}return Object(c.a)(a,[{key:"componentDidMount",value:function(){this.textInput.current.focus()}},{key:"updateParent",value:function(t){var e=this,a=this.props.excerpt.match(/\S+/g),n=t.target.innerHTML.replace(/&nbsp;/," ").match(/\S+/g),s=Object(d.a)(n);if(n){for(var r=n.length;r>=0;r--){console.log("comparing ",s[r]," to ",a[r]),s[r]!==a[r]&&s.splice(r,1)}this.setState({words:s.length},(function(){return e.props.update(e.state.words)})),console.log("words: ",n.length," excerpt: ",a.length),(n.length>a.length||s[s.length-1]===a[a.length-1])&&this.props.finish()}else this.setState({words:0});console.log("excerpt: ",a),console.log(n)}},{key:"disallowMultipleSpace",value:function(t){if(32===t.which&&t.target.innerHTML.endsWith("nbsp;"))return t.preventDefault(),!1}},{key:"render",value:function(){return s.a.createElement("div",{className:"Background"},this.props.excerpt,s.a.createElement("div",{ref:this.textInput,onKeyDown:this.disallowMultipleSpace,onKeyUp:this.updateParent,className:"typebox",contentEditable:"true",style:{border:"1px solid black"}}))}}]),a}(n.Component),f=a(33),k=a.n(f);function b(){this.time=0,this.callback=null}b.prototype.start=function(){var t=this;this.interval=setInterval((function(){t.time+=1,t.callback&&t.callback(t.time)}),1e3)},b.prototype.stop=function(){clearInterval(this.interval)},b.prototype.reset=function(){this.time=0},b.prototype.onTick=function(t){this.callback=t};var y=b,g=function(t){Object(u.a)(a,t);var e=Object(h.a)(a);function a(t){var n;return Object(o.a)(this,a),(n=e.call(this,t)).name="",n.timer=new y,n.socket=null,n.state={gameLeader:!1,showStart:!1,showWait:!1,start:!1,timer:null,time:3,words:0,message:"",players:[],spectators:[],excerpt:""},n.startGame=n.startGame.bind(Object(l.a)(n)),n.startClick=n.startClick.bind(Object(l.a)(n)),n.updateWords=n.updateWords.bind(Object(l.a)(n)),n.stopGame=n.stopGame.bind(Object(l.a)(n)),n}return Object(c.a)(a,[{key:"listenToMessages",value:function(){var t=this;this.socket=k()("https://e39e09819e6e.ngrok.io"),this.socket.emit("join",this.props.name),this.socket.on("start",(function(e){t.setState({excerpt:e,words:0,time:3}),t.startGame()})),this.socket.on("playerchange",(function(e){var a=JSON.parse(e);console.log("PLAYER CHANGE",a),t.socket.id===a.gameLeader&&t.setState({gameLeader:!0},(function(){t.state.start||t.setState({showStart:!0})})),t.setState({players:a.players,spectators:a.spectators})})),this.socket.on("gameupdate",(function(e){var a=JSON.parse(e);t.setState({players:a.players})})),this.socket.on("gamefinished",(function(){t.state.gameLeader&&t.setState({showStart:!0}),t.setState({showWait:!1})}))}},{key:"componentDidMount",value:function(){var t=this;this.listenToMessages(),this.timer.onTick((function(e){t.setState({time:e})}))}},{key:"sendUpdates",value:function(){var t=this;this.interval=setInterval((function(){t.socket.emit("update",{time:t.state.time,words:t.state.words})}),500)}},{key:"startClick",value:function(){this.socket.emit("startgame"),this.setState({showStart:!1})}},{key:"startGame",value:function(){var t=this;this.interval=setInterval((function(){t.setState({time:t.state.time-1}),0===t.state.time&&(clearInterval(t.interval),t.setState({start:!0,showStop:!0}),t.timer.start(),t.sendUpdates())}),1e3)}},{key:"isLeader",value:function(){var t=!1;return this.socket&&this.socket.id===this.gameLeader&&(t=!0),t}},{key:"stopGame",value:function(){this.setState({start:!1,showStop:!1,showWait:!0}),this.timer.stop(),clearInterval(this.interval),this.socket.emit("playerfinish",{words:this.state.words,time:this.state.time}),this.timer.reset()}},{key:"updateWords",value:function(t){this.setState({words:t})}},{key:"render",value:function(){return s.a.createElement("div",{className:"Background"},s.a.createElement(m,{spectators:this.state.spectators,players:this.state.players,gameLeader:this.state.gameLeader}),this.state.start?s.a.createElement(v,{update:this.updateWords,finish:this.stopGame,excerpt:this.state.excerpt}):"Loading",s.a.createElement("div",null,"Time: ",this.state.time),s.a.createElement("div",null,"Correct Words: ",this.state.words),s.a.createElement("div",null,"WPM: ",Math.round(60*this.state.words/this.state.time)),!this.state.start,this.state.showStart&&s.a.createElement("button",{onClick:this.startClick},"Start Game"),this.state.showWait&&s.a.createElement("div",null,"Please wait for other players to finish."))}}]),a}(n.Component),w=function(t){Object(u.a)(a,t);var e=Object(h.a)(a);function a(t){var n;return Object(o.a)(this,a),(n=e.call(this,t)).state={play:!1},n.play=n.play.bind(Object(l.a)(n)),n.setName=n.setName.bind(Object(l.a)(n)),n}return Object(c.a)(a,[{key:"play",value:function(){this.setState({play:!0})}},{key:"setName",value:function(t){this.name=t.target.value}},{key:"render",value:function(){return s.a.createElement("div",{className:"App"},this.state.play?s.a.createElement(g,{name:this.name}):s.a.createElement(p,{play:this.play,setName:this.setName}))}}]),a}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(s.a.createElement(s.a.StrictMode,null,s.a.createElement(w,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(t){t.unregister()})).catch((function(t){console.error(t.message)}))}},[[35,1,2]]]);
//# sourceMappingURL=main.5eb9c438.chunk.js.map