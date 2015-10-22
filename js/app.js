'use strict';

var Detail = {
	currentDeck: ''
};

var UI = {
	loadBar: document.querySelector('.load-bar'),
	deckList: document.querySelector('.deck-list'),
	mainContainer: document.querySelector('.main-container'),
	deckListTmp: document.getElementById('deckListTemplate'),
	cardSearch: {
		matches: [],
		el: document.getElementById('cardSearch'),
		results: document.querySelector('.card-search-results'),
		cardResultTemplate: document.getElementById('cardResultTemplate'),
		lookUpCard: function() {
			var str = UI.cardSearch.el.value;
			UI.cardSearch.matches = [];
			if(str.length > 2) {	
				for(var i = 0; i < Cards.cardNames.length; i++){
				    if(Cards.cardNames[i].toLowerCase().includes(str)) {
				       	UI.cardSearch.matches.push(Cards.cardNames[i]);
				    }
				}
			}
			if(UI.cardSearch.matches.length > 0) {
				UI.cardSearch.renderResults();
			}
			else {
				UI.cardSearch.hideResults();
			}
		},
		renderResults: function() {
			UI.cardSearch.results.innerHTML = '';
			UI.cardSearch.results.className = 'card-search-results show';
			for(var i = 0; i < UI.cardSearch.matches.length; i++) {
				var template = UI.cardSearch.cardResultTemplate.content.cloneNode(true);
				template.querySelector('li').innerText = UI.cardSearch.matches[i];
				template.querySelector('li').onclick = Cards.getCard;
				UI.cardSearch.results.appendChild(template);
			}
		},
		hideResults: function() {
			UI.cardSearch.results.className = 'card-search-results';
		}
	},
	cardList: {
		cardTmp: document.getElementById('cardTemplate'),
		el: document.querySelector('.deck-cards'),
		list: [],
		sortList: function(a,b) {
		  if (a.cost < b.cost){
		    return -1;
		  }
		  if (a.cost > b.cost) {
		    return 1;
		  }
		  return 0;
		},
		addCardToList: function(card) {
			UI.cardList.list.push(card);
			UI.cardList.saveToDeck();
			UI.cardList.renderList();
		},
		renderList: function() {
			UI.cardList.el.innerHTML = '';
			if(UI.cardList.list) {	
				UI.cardList.list.sort(this.sortList);
				for(var i = 0; i < UI.cardList.list.length; i++) {
					var template = this.cardTmp.content.cloneNode(true);
					template.querySelector('li').innerHTML = UI.cardList.list[i].name;
					template.querySelector('li').setAttribute('data-cost', UI.cardList.list[i].cost);
					template.querySelector('li').className = UI.cardList.list[i].rarity.toLowerCase();
					this.el.appendChild(template);
				}
			}
		},
		saveToDeck: function() {
			var Deck = Parse.Object.extend('Deck');
			var query = new Parse.Query(Deck);
			query.equalTo('name', Detail.currentDeck);
			query.first({
			  success: function(updateDeck) {
			    updateDeck.set('deckList', UI.cardList.list);
			    updateDeck.save();
			  }
			});
		}
	},
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

var Cards = {
	result: {},
	query: '',
	cardNames: [],
	collectNames: function(obj) {
		for(var i = 0; i < obj.length; i++) {
			Cards.cardNames.push(obj[i].name);
		}
	},
	returnNames: function(data) {
		var resp = data.target.responseText;
		var obj = JSON.parse(resp);
		Cards.collectNames(obj);
	},
	buildNameArray: function() {
		Cards.getJSON(Cards.returnNames);
	},
	getJSON: function(callback){
	  var c = new XMLHttpRequest;
	  c.onload = callback;
	  c.open('GET', 'cards.json');
	  c.send();
	},
	returnCard: function(data) {
		var resp = data.target.responseText;
		var obj = JSON.parse(resp);
		for(var i = 0; i < obj.length; i++) {
			if(obj[i].name === Cards.query) {
				var card = obj[i];
				UI.cardList.addCardToList(card);
			}
		}
	},
	getCard: function() {
		Cards.query = this.innerText;
		Cards.getJSON(Cards.returnCard);
	}
};

var Decks = {
	createNewDeck: function(){	
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
		  	Decks.pullDeckList();
		  	UI.newDeckContainer.hide();
		  },
		  error: function(newDeck, error) {
		 
		  }
		});
	},
	renderDeckList: function(results) {
		UI.deckList.innerHTML = '';
		for(var i = 0; i < results.length; i++) {
			var template = UI.deckListTmp.content.cloneNode(true);
			template.querySelector('li').setAttribute('data-index', i);
			template.querySelector('li').innerHTML += results[i].get('name');
			template.querySelector('li').onclick = Decks.pullDeckByIndex;
			UI.deckList.appendChild(template);
		}
	},
	pullDeckList: function() {
		var Deck = Parse.Object.extend('Deck');
		var query = new Parse.Query(Deck);
		query.find({
		  success: function(results) {
		  	Decks.renderDeckList(results);
		  },
		  error: function(object, error) {
		  	console.log('something fucked up');
		  }
		});
	},
	pullDeckByIndex: function(e) {
		UI.loadBar.className = 'load-bar loading';
		var index = this.innerText;
		var Deck = Parse.Object.extend('Deck');
		var query = new Parse.Query(Deck);
		Detail.currentDeck = index;
		query.equalTo('name', index);
		query.find({
		  success: function(deck) {
		  	renderDetail(deck[0]);
		  },
		  error: function(object, error) {
		  	console.log('something fucked up');
		  }
		});
	},
};

var renderDetail = function(deck) {
	document.getElementById('deck-portrait').className = deck.get('heroClass');
	UI.mainContainer.querySelector('.deck-name').innerHTML = deck.get('name');
	UI.mainContainer.querySelector('.played').innerHTML = deck.get('played');
	UI.mainContainer.querySelector('.wins').innerHTML = deck.get('wins');
	UI.mainContainer.querySelector('.losses').innerHTML = deck.get('losses');
	UI.mainContainer.querySelector('.winrate').innerHTML = deck.get('winRate');
	if(deck.get('deckList') !== undefined) {
		UI.cardList.list = deck.get('deckList');
	}
	else {
		UI.cardList.list = [];
	}
	UI.cardList.renderList();
	UI.loadBar.className = 'load-bar loaded';
};

Cards.buildNameArray();
Decks.pullDeckList();