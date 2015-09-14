'use strict';

var moment1 = {
	message: 'You are suddenly conscious, and remember nothing.',
	choices: [{message: 'Blink',link: 2}],
	// dropLoot: ['Sword of Saladin']
};

var moment2 = {
	message: 'You are standing in a dark woods.',
	choices: [{message: 'Look around',link: 3},{message: 'Check your belongings',link: 4}]
};

var moment3 = {
	message: 'The sun has just set. You are surrounded by trees bathed in twilight.',
	choices: [{message: 'Start walking',link: 5}]
};

var moment4 = {
	message: 'Looped to your belt you find a muddy hatchet.',
	choices: [{message: 'Look around',link: 3},{message: 'Start Walking',link: 5}],
	dropLoot: [getRandomLootByLevel(Weapons, 1)]
};

var moment5 = {
	message: 'You walk until you see a glowing light spidering through the trees.',
	choices: [{message: 'Take a closer look',link: 6},{message: 'Continue on',link: 9}]
};

var moment6 = {
	message: 'From behind a tree you see a goblin stoking a fire. With him is a man tied up, slumped at the base of a tree.',
	choices: [{message: 'Fight',link: 8},{message: 'Continue on',link: 9}]
};

var moment8 = {
	message: 'You step out and rush at the goblin.',
	enemy: 'Goblin Loan Shark',
	dropLoot: [getRandomLootByLevel(Armors, 1), 'Chicken Egg'],
	link: 10
};

var moment9 = {
	message: 'You find a road and begin walking west. Up ahead you see a figure on horseback galloping towards you.',
	choices: [{message: 'Keep walking',link: 14},{message: 'Hide',link: 15}]
};

var moment10 = {
	message: 'After taking a minute to recover, you turn to the captured man.',
	choices: [{message: '"Who are you?"',link: 11},{message: 'Take a closer look',link: 12}]
};

var moment12 = {
	message: 'As you lean in to check if the man is alive, he suddenly lunges at you.',
	enemy: 'Derranged Lunatic',
	dropLoot: [getRandomLootByLevel(Armors, 1), 'Message'],
	link: 13
};

var moment13 = {
	message: 'You done beat the ol maniac. Next to him is a locked chest. Since youre such a lock pro, you open that shit up no problem.',
	choices: [{message: 'Continue on',link: 9}],
	dropLoot: [getRandomLootByLevel(Consumables, 1)]
};

var moment14 = {
	message: 'As the man gets closer, he draws a sword.',
	choices: [{message: 'Fight',link: 16},{message: 'Hide',link: 15}]
};

var moment15 = {
	message: 'You run into the trees until you cannot see the road. You hear the figure pass. Ahead of you is a ruined mill.',
	choices: [{message: 'Check out the mill',link: 17},{message: 'Go back to the road',link: 18}]
};

var moment16 = {
	message: 'You draw your weapon and stand your ground.',
	enemy: 'Highway Bandit',
	dropLoot: [getRandomLootByLevel(Items, 1)],
	link: 18
};

var moment18 = {
	message: 'You walk for miles until you see a steeple poking up from the treeline ahead. It seems you found a town.',
	choices: [{message: 'Look around',link: 19},{message: 'Talk to someone',link: 20}]
};

var moment19 = {
	message: 'You walk to the town square and look around. Where would you like to go?',
	choices: [{message: 'The Arms Shop',link: 20},{message: 'The General Store',link: 21}, {message: 'The Inn',link: 22}, {message: 'The Town Hall',link: 24}]
};

var playerLost = {
	message: 'You were killed. Sorry.',
	choices: [{message: 'Start over',link: 1}]
};

var moment20 = {
	message: 'You enter the arms shop. "Ahoy there traveler," says the owner. "What can I do for you?"',
	shop: [getRandomLootByLevel(Weapons, 1), getRandomLootByLevel(Weapons, 1), getRandomLootByLevel(Weapons, 2), getRandomLootByLevel(Weapons, 2), getRandomLootByLevel(Armors, 1)],
	choices: [{message: 'Leave the shop', link: 19}]
};

var moment21 = {
	message: 'You enter the general store. "Hey baby," says the clerk. "What can I help you with?"',
	shop: [getRandomLootByLevel(Consumables, 1), getRandomLootByLevel(Consumables, 1), getRandomLootByLevel(Consumables, 2), getRandomLootByLevel(Consumables, 2)],
	choices: [{message: 'Leave the shop', link: 19}]
};

var moment22 = {
	message: 'You enter the inn. "Sup playa," says the innkeeper. "Would you like a room? Its 5 gold for the night."',
	choices: [{message: 'Yes please', link: 23}, {message: 'No thanks', link: 19}]
};

var moment23 = {
	message: 'You go up to your room and sleep off your wounds. You wake up feeling like a million bucks.',
	inn: 5,
	choices: [{message: 'Leave the inn', link: 19}, {message: 'Get another room', link: 23}]
};

var moment24 = {
	message: 'You stand in the large chamber of the Town Hall. Merchants and town leaders are assembled in discussion.',
	choices: [{message: 'Leave the hall', link: 19}, {message: 'Look around', link: 25}, {message: 'Ask for Jawn Peterson', link: 26}, {message: 'Talk to the tenant-in-chief', link: 27}]
};

var moment26 = {
	message: 'You approach a man writing at a desk near the entrance. "Do you know a man who goes by Jawn Peterson?" you ask. "The man points to two men standing near a side entrance."',
	choices: [{message: 'Go over', link: 27}, {message: 'Do something else', link: 24}]
};

var moment27 = {
	message: 'The men spot you approaching. "Are you Jawn Peterson? you ask." He seems to look you over until replying "Yes I am. Would you like to join me for a drink? You look like you could use it."',
	choices: [{message: 'Go with him', link: 28}, {message: 'Do something else', link: 24}]
};

var moment28 = {
	message: 'You walk outside and turn the corner. The cloaked man with Jawn Peterson suddenly pulls a dagger on you and attacks.',
	enemy: 'Cloaked Assassin',
	dropLoot: [getRandomLootByLevel(Items, 2)],
	link: 24
};

