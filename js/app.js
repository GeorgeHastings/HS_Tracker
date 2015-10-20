'use strict';

var UI = {
	loadBar: document.querySelector('.load-bar'),
	deckList: document.querySelector('.deck-list'),
	cardList: document.querySelector('.deck-cards'),
	mainContainer: document.querySelector('.main-container'),
	cardTmp: document.getElementById('cardTemplate'),
	deckListTmp: document.getElementById('deckListTemplate'),
	newDeckContainer: {
		el: document.getElementById('newDeckContainer'),
		name: document.getElementById('newDeckName'),
		class: document.getElementById('newDeckClass'),
		show: function() {
			UI.newDeckContainer.el.className = 'new-deck-container show';
		},
		hide: function() {
			UI.newDeckContainer.el.className = 'new-deck-container';
		}
	}
};

var Card = {
	toFind: '',
	isMatch: function(obj) {
		for(var i = 0; i < obj.length; i++) {
			if(obj[i].name === Card.toFind) {
				console.log(obj[i]);
				return obj[i];
			}
		}
	},
	getJSON: function(callback){
	  var c = new XMLHttpRequest;
	  c.onload = callback;
	  c.open('GET', 'data.json');
	  c.send();
	},
	returnCard: function(data) {
		var resp = data.target.responseText;
		var obj = JSON.parse(resp);
		Card.isMatch(obj.cards);
	},
	getCard: function(card) {
		this.toFind = card;
		Card.getJSON(Card.returnCard);
	}
};

var createNewDeck = function(){	
	event.preventDefault();
	var Deck = Parse.Object.extend('Deck');
	var newDeck = new Deck();

	newDeck.save({
	  name: UI.newDeckContainer.name.value,
	  heroClass: UI.newDeckContainer.class.value,
	  played: 0,
	  wins: 0,
	  losses: 0,
	  winRate:'0%'
	}, {
	  success: function() {
	  	pullDeckList();
	  	UI.newDeckContainer.hide();
	  },
	  error: function(newDeck, error) {
	 
	  }
	});
};

var pullDeckList = function() {
	var Deck = Parse.Object.extend('Deck');
	var query = new Parse.Query(Deck);
	query.find({
	  success: function(results) {
	  	renderDeckList(results);
	  },
	  error: function(object, error) {
	  	console.log('something fucked up');
	  }
	});
};

var pullDeckByIndex = function(e) {
	UI.loadBar.className = 'load-bar loading';
	var index = this.innerText;
	var Deck = Parse.Object.extend('Deck');
	var query = new Parse.Query(Deck);
	query.equalTo('name', index);
	query.find({
	  success: function(deck) {
	  	renderDetail(deck[0]);
	  },
	  error: function(object, error) {
	  	console.log('something fucked up');
	  }
	});
};

var renderDetail = function(deck) {
	document.getElementById('deck-portrait').className = deck.get('heroClass');
	UI.mainContainer.querySelector('.deck-name').innerHTML = deck.get('name');
	UI.mainContainer.querySelector('.played').innerHTML = deck.get('played');
	UI.mainContainer.querySelector('.wins').innerHTML = deck.get('wins');
	UI.mainContainer.querySelector('.losses').innerHTML = deck.get('losses');
	UI.mainContainer.querySelector('.winrate').innerHTML = deck.get('winRate');
	UI.loadBar.className = 'load-bar loaded';
};

var renderDeckList = function(results) {
	UI.deckList.innerHTML = '';
	for(var i = 0; i < results.length; i++) {
		var template = UI.deckListTmp.content.cloneNode(true);
		template.querySelector('li').setAttribute('data-index', i);
		template.querySelector('li').innerHTML += results[i].get('name');
		template.querySelector('li').onclick = pullDeckByIndex;
		UI.deckList.appendChild(template);
	}
};

Card.getCard('Mad Bomber');
pullDeckList();