'use strict';

Chart.defaults.global.responsive = true;
Chart.defaults.global.animationSteps = 20;
Chart.defaults.global.scaleOverride = true;
Chart.defaults.global.scaleSteps = 4;
Chart.defaults.global.scaleStepWidth = 25;
Chart.defaults.global.scaleStartValue = 0;
Chart.defaults.global.scaleLineColor = "rgba(0,0,0,.0)";
// Chart.defaults.global.scaleShowGridLines = false;

var Detail = {
	currentDeck: '',
	renderDetail: function(deck) {
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
		Matchups.getMatchups();
		UI.loadBar.className = 'load-bar loaded';
	}
};

var Helpers = {
	checkDoubles: function(a) {
    	var counts = [];
	    for(var i = 0; i <= a.length; i++) {
	        if(counts[a[i]] === undefined) {
	            counts[a[i]] = 1;
	        } else {
	            return true;
	        }
	    }
	    return false;
	},
	makePercent: function(amount, total, pts) {
		return (amount/total*100).toFixed(pts);
	}
};

var UI = {
	loadBar: document.querySelector('.load-bar'),
	deckList: document.querySelector('.deck-list'),
	mainContainer: document.querySelector('.main-container'),
	played: document.querySelector('.played'),
	wins: document.querySelector('.wins'),
	losses: document.querySelector('.losses'),
	winrate: document.querySelector('.winrate'),
	classCharts: document.querySelector('.class-breakdown'),
	deckWinRates: document.querySelector('.deck-winrates'),
	deckListTmp: document.getElementById('deckListTemplate'),
	matchList: document.querySelector('.deck-match-list'),
	matchItemTmp: document.getElementById('matchItem'),
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
				var el = template.querySelector('li');
				el.innerText = UI.cardSearch.matches[i];
				el.onclick = Cards.getCard;
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
		  var cost1 = a.cost;
		  var cost2 = b.cost;

		  var name1 = a.name;
		  var name2 = b.name;

		  if (cost1 < cost2) {return -1;}
		  if (cost1 > cost2) {return 1;}
		  if (name1 < name2) {return -1;}
		  if (name1 > name2) {return 1;}
		  return 0;
		},
		addCardToList: function(card) {
		  	var newCard = {
		  		id: card.get('id'),
		  		name: card.get('name'),
		  		cost: card.get('cost'),
		  		rarity: card.get('rarity')
		  	};
			UI.cardList.list.push(newCard);
			UI.cardList.saveDeck();
			UI.cardList.renderList();
		},
		removeCardFromList: function() {
			var name = this.innerHTML;
			UI.cardList.list.sort(this.sortList);
			for(var i = 0; i < UI.cardList.list.length; i++) {
				if(UI.cardList.list[i].name === name) {
					document.getElementById(UI.cardList.list[i].id).setAttribute('data-count', '');
					UI.cardList.list.splice(i, 1);
				}
			}
			UI.cardList.saveDeck();
			UI.cardList.renderList();
		},
		renderList: function() {
			document.querySelector('.deck-cardlist h3').setAttribute('data-count', UI.cardList.list.length);
			UI.cardList.el.innerHTML = '';
			if(UI.cardList.list) {	
				UI.cardList.list.sort(this.sortList);
				for(var i = 0; i < UI.cardList.list.length; i++) {
					if(i > 0 && UI.cardList.list[i].id === UI.cardList.list[i-1].id) {
						document.getElementById(UI.cardList.list[i].id).setAttribute('data-count', 2);
					}	
					else {
						var template = this.cardTmp.content.cloneNode(true);
						var el = template.querySelector('li');
						el.innerHTML = UI.cardList.list[i].name;
						el.setAttribute('id', UI.cardList.list[i].id);
						el.setAttribute('data-cost', UI.cardList.list[i].cost);
						el.className = UI.cardList.list[i].rarity.toLowerCase();
						el.onclick = UI.cardList.removeCardFromList;
						this.el.appendChild(template);
					}
				}
			}
		},
		saveDeck: function() {
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
	},
	classColors: [
		'#F47D20',
		'#A9D26D',
		'#65CBF0',
		'#F28AB8',
		'#989798',
		'#EFC418',
		'#356CB4',
		'#957FBB',
		'#C69B69'
	]
};

var Cards = {
	result: {},
	query: '',
	cardNames: [],
	collectNames: function(obj) {
		for(var i = 0; i < obj.length; i++) {
			Cards.cardNames.push(obj[i].get('name'));
		}
	},
	returnNames: function() {
		var Card = Parse.Object.extend('cards');
		var query = new Parse.Query(Card);
		query.limit(700).find({
		  success: function(results) {
		  	Cards.collectNames(results);
		  },
		  error: function(object, error) {
		  	console.log('something fucked up');
		  }
		});
	},
	getCard: function() {
		var card = this.innerText;
		var Card = Parse.Object.extend('cards');
		var query = new Parse.Query(Card);
		query.equalTo('name', card);
		query.first({
		  success: function(result) {
		  	UI.cardList.addCardToList(result);
		  },
		  error: function(object, error) {
		  	console.log('something fucked up');
		  }
		});
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
	deleteDeck: function() {
		var Deck = Parse.Object.extend('Deck');
		var query = new Parse.Query(Deck);
		var index = this.previousElementSibling.innerHTML;
		query.equalTo('name', index);
		query.find({
		  success: function(deck) {
  			var deleteDeck = confirm('Are you sure you want to delete this deck?');
  			if(deleteDeck) {
  				deck[0].destroy({
  				success: function(){	
  					Decks.pullDeckList();
  				}
  			});
  			}
		  },
		  error: function(object, error) {
		  	console.log('something fucked up');
		  }
		});
	},
	renderDeckList: function(results) {
		UI.deckList.innerHTML = '';
		for(var i = 0; i < results.length; i++) {
			var template = UI.deckListTmp.content.cloneNode(true);
			template.querySelector('li').setAttribute('data-index', i);
			template.querySelector('.deck-name').innerHTML = results[i].get('name');
			template.querySelector('.delete-deck').onclick = Decks.deleteDeck;
			template.querySelector('.deck-name').onclick = Decks.pullDeckByIndex;
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
	pullDeckByIndex: function() {
		UI.loadBar.className = 'load-bar loading';
		var index = this.innerText;
		var Deck = Parse.Object.extend('Deck');
		var query = new Parse.Query(Deck);
		Detail.currentDeck = index;
		query.equalTo('name', index);
		query.find({
		  success: function(deck) {
		  	Detail.renderDetail(deck[0]);
		  },
		  error: function(object, error) {
		  	console.log('something fucked up');
		  }
		});
	},
	pullFirstDeck: function() {
		UI.loadBar.className = 'load-bar loading';
		var Deck = Parse.Object.extend('Deck');
		var query = new Parse.Query(Deck);
		query.first({
		  success: function(deck) {
		  	Detail.currentDeck = deck.get('name');
		  	Detail.renderDetail(deck);
		  },
		  error: function(object, error) {
		  	console.log('something fucked up');
		  }
		});
	},
};

var Matchups = {
	matchups: [],
	played: 0,
	win: 0,
	loss: 0,
	oppClasses: {
		'druid': [0,0],
		'hunter': [0,0],
		'mage': [0,0],
		'paladin': [0,0],
		'priest': [0,0],
		'rogue': [0,0],
		'shaman': [0,0],
		'warlock': [0,0],
		'warrior': [0,0]
	},
	getMatchups: function(){
		var Deck = Parse.Object.extend('Deck');
		var query = new Parse.Query(Deck);
		query.equalTo('name', Detail.currentDeck);
		query.first({
		  success: function(deck) {
		    if(deck.get('matchUps')) {
		    	Matchups.matchups = deck.get('matchUps');
		    	Matchups.refreshMatchups();
		    }
		    else {
		    	Matchups.matchups = [];
		    	Matchups.clearMatchList();
		    	Matchups.renderChart();
		    }
		  }
		});
	},
	calcStats: function() {
		var played = 0,
			wins = 0,
			losses = 0;
		if(this.matchups) {	
			for(var i = 0; i < this.matchups.length; i++) {
				played++;
				if(this.matchups[i].outcome === 'win'){
					wins++;
				}
				else {
					losses++;
				}
			}
		}
		Matchups.played = played;
		Matchups.win = wins;
		Matchups.loss = losses;
	},
	renderStats: function() {
		UI.played.innerHTML = this.played;
		UI.wins.innerHTML = this.win;
		UI.losses.innerHTML = this.loss;
		UI.winrate.innerHTML = Helpers.makePercent(this.win, this.played, 2)+'%';
	},
	getClassWinRates: function() {
		var data = [];
		for(var prop in this.oppClasses) {
			if(Helpers.makePercent(this.oppClasses[prop][0], this.oppClasses[prop][1], 0) > 0) {
				data.push(Helpers.makePercent(this.oppClasses[prop][0], this.oppClasses[prop][1], 0));
			}
			else {
				data.push(0);
			}
		}
		return data;
	},
	getClassPlayCounts: function() {
		var data = [];
		for(var prop in this.oppClasses) {
			data.push(Helpers.makePercent(this.oppClasses[prop][1], Matchups.matchups.length, 0));
		}
		return data;
	},
	saveMatches: function() {
		var Deck = Parse.Object.extend('Deck');
		var query = new Parse.Query(Deck);
		query.equalTo('name', Detail.currentDeck);
		query.first({
		  success: function(updateDeck) {
		    updateDeck.set('matchUps', Matchups.matchups);
		    updateDeck.save();
		  }
		});
	},
	resetMatchups: function() {
		for(var prop in Matchups.oppClasses) {
			Matchups.oppClasses[prop] = [0,0];
		}
	},
	calcMatchups: function() {
		for(var i = 0; i < this.matchups.length; i++) {
			var oppClass = Matchups.oppClasses[this.matchups[i].opponent];
			oppClass[1]++;
			if(this.matchups[i].outcome === 'win') {
				oppClass[0]++;
			}
		}
	},
	refreshMatchups: function() {
		this.resetMatchups();
		this.calcStats();
		this.renderStats();
		this.renderMatchList();
		this.calcMatchups();
		this.renderChart();
	},
	createNewMatch: function() {
		var match = {
			outcome: document.querySelector('input[name="outcome"]:checked').value,
			opponent: document.getElementById('opponentClass').value,
			archetype: document.getElementById('opponentArchetype').value
		};
		this.matchups.push(match);
		this.saveMatches();
		this.refreshMatchups();
		
	},
	removeMatch: function() {
		var index = this.parentNode.getAttribute('data-index');
		Matchups.matchups.splice(index, 1);
		Matchups.saveMatches();
		Matchups.refreshMatchups();
	},
	clearMatchList: function() {
		UI.matchList.innerHTML = '';
	},
	renderMatchList: function() {
		this.clearMatchList();
		for(var i = 0; i < Matchups.matchups.length; i++) {
			var template = UI.matchItemTmp.content.cloneNode(true);
			template.querySelector('li').setAttribute('data-index', i);
			template.querySelector('.match-deck-name').innerHTML = Detail.currentDeck;
			template.querySelector('.match-outcome').innerHTML = Matchups.matchups[i].outcome;
			template.querySelector('.match-outcome').className += ' '+Matchups.matchups[i].outcome;
			template.querySelector('.match-opponent').innerHTML = Matchups.matchups[i].opponent;
			template.querySelector('.match-archetype').innerHTML = Matchups.matchups[i].archetype;
			template.querySelector('.delete-match').onclick = Matchups.removeMatch;
			UI.matchList.insertBefore(template, UI.matchList.firstChild);
		}
	},
	clearChart: function() {
		if(this.classMatchupChart) {
			this.classMatchupChart.destroy();
		}
 	},
	renderChart: function() {
		this.clearChart();
		var data = {
		    labels: ['Druid', 'Hunter', 'Mage', 'Paladin', 'Priest', 'Rogue', 'Shaman', 'Warlock', 'Warrior'],
		    datasets: [
		        {
		            label: 'Win Rate',
		            fillColor: 'rgba(220,220,220,0.5)',
		            data: Matchups.getClassWinRates()
		        },
		        {
		    		label: 'Play count',
		    		fillColor: 'rgba(220,220,220,0.5)',
		    		data: Matchups.getClassPlayCounts()
		    	}
		    ]
		};
		var ctx = document.getElementById('myChart').getContext('2d');
		this.classMatchupChart = new Chart(ctx).Bar(data, {responsive: true, scaleShowGridLines: false});
    	for(var i=0; i < 9; i++) {
    		this.classMatchupChart.datasets[0].bars[i].fillColor = UI.classColors[i];
    	}
    	this.classMatchupChart.update();
	}
};

Cards.returnNames();

document.addEventListener('DOMContentLoaded', function(){
	Decks.pullDeckList();
	Decks.pullFirstDeck();
});
