"use strict";Chart.defaults.global.responsive=!0;var Detail={currentDeck:""},Helpers={checkDoubles:function(e){for(var t=[],a=0;a<=e.length;a++){if(void 0!==t[e[a]])return!0;t[e[a]]=1}return!1},makePercent:function(e,t,a){return(e/t*100).toFixed(a)}},UI={loadBar:document.querySelector(".load-bar"),deckList:document.querySelector(".deck-list"),mainContainer:document.querySelector(".main-container"),played:document.querySelector(".played"),wins:document.querySelector(".wins"),losses:document.querySelector(".losses"),winrate:document.querySelector(".winrate"),classCharts:document.querySelector(".class-breakdown"),deckWinRates:document.querySelector(".deck-winrates"),deckListTmp:document.getElementById("deckListTemplate"),matchList:document.querySelector(".deck-match-list"),matchItemTmp:document.getElementById("matchItem"),cardSearch:{matches:[],el:document.getElementById("cardSearch"),results:document.querySelector(".card-search-results"),cardResultTemplate:document.getElementById("cardResultTemplate"),lookUpCard:function(){var e=UI.cardSearch.el.value;if(UI.cardSearch.matches=[],e.length>2)for(var t=0;t<Cards.cardNames.length;t++)Cards.cardNames[t].toLowerCase().includes(e)&&UI.cardSearch.matches.push(Cards.cardNames[t]);UI.cardSearch.matches.length>0?UI.cardSearch.renderResults():UI.cardSearch.hideResults()},renderResults:function(){UI.cardSearch.results.innerHTML="",UI.cardSearch.results.className="card-search-results show";for(var e=0;e<UI.cardSearch.matches.length;e++){var t=UI.cardSearch.cardResultTemplate.content.cloneNode(!0),a=t.querySelector("li");a.innerText=UI.cardSearch.matches[e],a.onclick=Cards.getCard,UI.cardSearch.results.appendChild(t)}},hideResults:function(){UI.cardSearch.results.className="card-search-results"}},cardList:{cardTmp:document.getElementById("cardTemplate"),el:document.querySelector(".deck-cards"),list:[],sortList:function(e,t){var a=e.cost,s=t.cost,r=e.name,c=t.name;return s>a?-1:a>s?1:c>r?-1:r>c?1:0},addCardToList:function(e){UI.cardList.list.push(e),UI.cardList.saveDeck(),UI.cardList.renderList()},removeCardFromList:function(){var e=this.innerHTML;UI.cardList.list.sort(this.sortList);for(var t=0;t<UI.cardList.list.length;t++)UI.cardList.list[t].name===e&&(document.getElementById(UI.cardList.list[t].id).setAttribute("data-count",""),UI.cardList.list.splice(t,1));UI.cardList.saveDeck(),UI.cardList.renderList()},renderList:function(){if(document.querySelector(".deck-cardlist h3").setAttribute("data-count",UI.cardList.list.length),UI.cardList.el.innerHTML="",UI.cardList.list){UI.cardList.list.sort(this.sortList);for(var e=0;e<UI.cardList.list.length;e++)if(e>0&&UI.cardList.list[e].id===UI.cardList.list[e-1].id)document.getElementById(UI.cardList.list[e].id).setAttribute("data-count",2);else{var t=this.cardTmp.content.cloneNode(!0),a=t.querySelector("li");a.innerHTML=UI.cardList.list[e].name,a.setAttribute("id",UI.cardList.list[e].id),a.setAttribute("data-cost",UI.cardList.list[e].cost),a.className=UI.cardList.list[e].rarity.toLowerCase(),a.onclick=UI.cardList.removeCardFromList,this.el.appendChild(t)}}},saveDeck:function(){var e=Parse.Object.extend("Deck"),t=new Parse.Query(e);t.equalTo("name",Detail.currentDeck),t.first({success:function(e){e.set("deckList",UI.cardList.list),e.save()}})}},newDeckContainer:{el:document.getElementById("newDeckContainer"),name:document.getElementById("newDeckName"),"class":document.getElementById("newDeckClass"),show:function(){UI.newDeckContainer.el.className="new-deck-container show"},hide:function(){UI.newDeckContainer.el.className="new-deck-container"}},classColors:["#F47D20","#A9D26D","#65CBF0","#F28AB8","#989798","#EFC418","#356CB4","#957FBB","#C69B69"]},Cards={result:{},query:"",cardNames:[],collectNames:function(e){for(var t=0;t<e.length;t++)Cards.cardNames.push(e[t].name)},returnNames:function(e){var t=e.target.responseText,a=JSON.parse(t);Cards.collectNames(a.results)},buildNameArray:function(){Cards.getJSON(Cards.returnNames)},getJSON:function(e){var t=new XMLHttpRequest;t.onload=e,t.open("GET","js/cards.json"),t.send()},returnCard:function(e){for(var t=e.target.responseText,a=JSON.parse(t),s=0;s<a.results.length;s++)if(a.results[s].name===Cards.query){var r=a.results[s];UI.cardList.addCardToList(r)}},getCard:function(){Cards.query=this.innerText,Cards.getJSON(Cards.returnCard)}},Decks={createNewDeck:function(){event.preventDefault();var e=Parse.Object.extend("Deck"),t=new e;t.save({name:UI.newDeckContainer.name.value,heroClass:UI.newDeckContainer["class"].value,played:0,wins:0,losses:0,winRate:"0%"},{success:function(){Decks.pullDeckList(),UI.newDeckContainer.hide()},error:function(e,t){}})},renderDeckList:function(e){UI.deckList.innerHTML="";for(var t=0;t<e.length;t++){var a=UI.deckListTmp.content.cloneNode(!0),s=a.querySelector("li");s.setAttribute("data-index",t),s.innerHTML+=e[t].get("name"),s.onclick=Decks.pullDeckByIndex,UI.deckList.appendChild(a)}},pullDeckList:function(){var e=Parse.Object.extend("Deck"),t=new Parse.Query(e);t.find({success:function(e){Decks.renderDeckList(e)},error:function(e,t){console.log("something fucked up")}})},pullDeckByIndex:function(e){UI.loadBar.className="load-bar loading";var t=this.innerText,a=Parse.Object.extend("Deck"),s=new Parse.Query(a);Detail.currentDeck=t,s.equalTo("name",t),s.find({success:function(e){renderDetail(e[0])},error:function(e,t){console.log("something fucked up")}})},pullFirstDeck:function(e){UI.loadBar.className="load-bar loading";var t=Parse.Object.extend("Deck"),a=new Parse.Query(t);a.first({success:function(e){Detail.currentDeck=e.get("name"),renderDetail(e)},error:function(e,t){console.log("something fucked up")}})}},Matchups={matchups:[],played:0,win:0,loss:0,oppClasses:{druid:[0,0],hunter:[0,0],mage:[0,0],paladin:[0,0],priest:[0,0],rogue:[0,0],shaman:[0,0],warlock:[0,0],warrior:[0,0]},getMatchups:function(){var e=Parse.Object.extend("Deck"),t=new Parse.Query(e);t.equalTo("name",Detail.currentDeck),t.first({success:function(e){e.get("matchUps")?Matchups.matchups=e.get("matchUps"):Matchups.matchups=[],Matchups.resetMatchups(),Matchups.calcStats(),Matchups.renderStats(),Matchups.calcMatchups(),Matchups.renderChart(),Matchups.renderMatchList()}})},calcStats:function(){var e=0,t=0,a=0;if(this.matchups)for(var s=0;s<this.matchups.length;s++)e++,"win"===this.matchups[s].outcome?t++:a++;Matchups.played=e,Matchups.win=t,Matchups.loss=a},resetMatchups:function(){for(var e in Matchups.oppClasses)Matchups.oppClasses[e]=[0,0]},calcMatchups:function(){for(var e=0;e<this.matchups.length;e++){var t=Matchups.oppClasses[this.matchups[e].opponent];t[1]++,"win"===this.matchups[e].outcome&&t[0]++}},getClassWinRates:function(){var e=[];for(var t in this.oppClasses)Helpers.makePercent(this.oppClasses[t][0],this.oppClasses[t][1],0)>0?e.push(Helpers.makePercent(this.oppClasses[t][0],this.oppClasses[t][1],0)):e.push(0);return e},getClassPlayCounts:function(){var e=[];for(var t in this.oppClasses)e.push(Helpers.makePercent(this.oppClasses[t][1],Matchups.matchups.length,0));return e},saveMatches:function(){var e=Parse.Object.extend("Deck"),t=new Parse.Query(e);t.equalTo("name",Detail.currentDeck),t.first({success:function(e){e.set("matchUps",Matchups.matchups),e.save()}})},createNewMatch:function(){var e={outcome:document.querySelector('input[name="outcome"]:checked').value,opponent:document.getElementById("opponentClass").value,archetype:document.getElementById("opponentArchetype").value};this.matchups.push(e),this.saveMatches(),this.resetMatchups(),this.calcStats(),this.renderMatchList(),this.calcMatchups(),this.renderChart()},removeMatch:function(){var e=this.parentNode.getAttribute("data-index");Matchups.matchups.splice(e,1),Matchups.saveMatches(),Matchups.resetMatchups(),Matchups.calcStats(),Matchups.renderMatchList(),Matchups.calcMatchups(),Matchups.renderChart()},clearMatchList:function(){UI.matchList.innerHTML=""},renderMatchList:function(){this.clearMatchList();for(var e=0;e<Matchups.matchups.length;e++){var t=UI.matchItemTmp.content.cloneNode(!0);t.querySelector("li").setAttribute("data-index",e),t.querySelector(".match-deck-name").innerHTML=Detail.currentDeck,t.querySelector(".match-outcome").innerHTML=Matchups.matchups[e].outcome,t.querySelector(".match-outcome").className+=" "+Matchups.matchups[e].outcome,t.querySelector(".match-opponent").innerHTML=Matchups.matchups[e].opponent,t.querySelector(".match-archetype").innerHTML=Matchups.matchups[e].archetype,t.querySelector(".delete-match").onclick=Matchups.removeMatch,UI.matchList.insertBefore(t,UI.matchList.firstChild)}},renderStats:function(){UI.played.innerHTML=this.played,UI.wins.innerHTML=this.win,UI.losses.innerHTML=this.loss,UI.winrate.innerHTML=Helpers.makePercent(this.win,this.played,2)+"%"},renderChart:function(){for(var e={labels:["Druid","Hunter","Mage","Paladin","Priest","Rogue","Shaman","Warlock","Warrior"],datasets:[{label:"Win Rate",fillColor:"rgba(220,220,220,0.5)",data:Matchups.getClassWinRates()},{label:"Play count",fillColor:"rgba(220,220,220,0.5)",data:Matchups.getClassPlayCounts()}]},t=document.getElementById("myChart").getContext("2d"),a=new Chart(t).Bar(e,{responsive:!0}),s=0;9>s;s++)a.datasets[0].bars[s].fillColor=UI.classColors[s];a.update()}},renderDetail=function(e){document.getElementById("deck-portrait").className=e.get("heroClass"),UI.mainContainer.querySelector(".deck-name").innerHTML=e.get("name"),UI.mainContainer.querySelector(".played").innerHTML=e.get("played"),UI.mainContainer.querySelector(".wins").innerHTML=e.get("wins"),UI.mainContainer.querySelector(".losses").innerHTML=e.get("losses"),UI.mainContainer.querySelector(".winrate").innerHTML=e.get("winRate"),void 0!==e.get("deckList")?UI.cardList.list=e.get("deckList"):UI.cardList.list=[],Matchups.getMatchups(),UI.cardList.renderList(),UI.loadBar.className="load-bar loaded"};Cards.buildNameArray(),Decks.pullDeckList(),Decks.pullFirstDeck();