"use strict";function Item(e,n,o,t){this.name=e,this.level=n,this.rarity=o,this.flavorText=t}var Weapons=[],Armors=[],Consumables=[];Item.prototype.use=function(){this.hasOwnProperty("effect")&&(this.effect.run(this.effectAmt),Player.updateStats())},Item.prototype.removeEquipBuff=function(){this.hasOwnProperty("effect")&&this.effect.run(-this.effectAmt)},Item.prototype.desc=function(){return this.effect.desc(this.effectAmt)},Item.prototype.getRarityMultiplier=function(){return"none"===this.rarity?.5:"common"===this.rarity?1:"rare"===this.rarity?1.5:"legendary"===this.rarity?2:void 0},Item.prototype.getSalePrice=function(){return 10*this.level*this.getRarityMultiplier()},Item.prototype.getPurchasePrice=function(){return 10*this.level*this.getRarityMultiplier()+10*this.level};var Effect=function(e,n,o){this.amt=e,this.runEffects=n,this.description=o};Effect.prototype.run=function(){for(var e=0;e<this.runEffects.length;e++)Player[this.runEffects[e]]+=this.amt},Effect.prototype.desc=function(){return this.description+" +"+this.amt};var addStrength=new Effect(2,["strength","healthTotal","healthMax","armor"],"Strength");Item.effects={addStrength:{run:function(e){Player.strength+=e,Player.healthTotal+=e,Player.healthMax+=e,Player.armor+=e},desc:function(e){return"Strength +"+e}},addQuickness:{run:function(e){Player.quickness+=e},desc:function(e){return"Quickness +"+e}},buffMaxDamage:{run:function(e){var n;Player.equippedWeapon?(Player.equippedWeapon.damageMax+=e,n="Your "+Player.equippedWeapon.name+"s max attack is increased by "+e):n="You need to equip a weapon to use this",UI.combatLog.renderCombatLog(n)},desc:function(e){return"Increase your equipped weapons max damage by "+e}},buffMinDamage:{run:function(e){var n;Player.equippedWeapon?(Player.equippedWeapon.damageMin+=e,n="Your "+Player.equippedWeapon.name+"s min attack is increased by "+e):n="You need to equip a weapon to use this",UI.combatLog.renderCombatLog(n)},desc:function(e){return"Increase your equipped weapons min damage by "+e}},healPlayer:{run:function(e){var n="You are healed for "+e,o=Player.healthMax-Player.healthTotal;o>=e?Player.healthTotal+=e:Player.healthTotal+=o,UI.combatLog.renderCombatLog(n)},desc:function(e){return"Restore "+e+" hp"}}};var Weapon=function(e,n,o,t,a,r,s,u){var p=new Item(e,n,o,t);return p.damageMin=a,p.damageMax=r,p.itemType="weapon",s&&u&&(p.effect=Item.effects[s],p.effectAmt=u),p},Armor=function(e,n,o,t,a,r,s){var u=new Item(e,n,o,flavorText);return u.slot=t,u.armorAmt=a,u.itemType="armor",r&&s&&(u.effect=Item.effects[r],u.effectAmt=s),u},Consumable=function(e,n,o,t,a,r){var s=new Item(e,n,o,t);return s.effect=Item.effects[a],s.effectAmt=r,s.itemType="consumable",s};Weapons.push(new Weapon("Muddy Hatchet",1,"none","",1,3)),Weapons.push(new Weapon("Rusty Short Sword",1,"none","",2,4)),Weapons.push(new Weapon("Dull Axe",1,"none","",1,5)),Weapons.push(new Weapon("Wooden Staff",1,"none","",2,3)),Weapons.push(new Weapon("Bent Spear",1,"none","",1,4)),Weapons.push(new Weapon("Iron Dagger",1,"common","",3,4,"addStrength",1)),Weapons.push(new Weapon("Short Spear",1,"common","",1,6)),Weapons.push(new Weapon("Blacksmith Hammer",1,"common","",2,5)),Weapons.push(new Weapon("Bronze Short Sword",1,"common","",3,4)),Weapons.push(new Weapon("Rusty Battle Axe",2,"none","",1,6)),Weapons.push(new Weapon("Oak Club",2,"none","",2,5)),Weapons.push(new Weapon("Old Longsword",2,"none","",3,4)),Weapons.push(new Weapon("Logging Axe",2,"none","",2,6)),Weapons.push(new Weapon("Bronze Spear",2,"common","",1,8)),Weapons.push(new Weapon("Oily Dagger",2,"common","",3,5,"addQuickness",1)),Weapons.push(new Weapon("Fang Claws",2,"common","",2,7)),Weapons.push(new Weapon("Iron Short Sword",2,"common","",3,6)),Weapons.push(new Weapon("Sword of Saladin",15,"legendary","",30,60,"addQuickness",20)),Armors.push(new Armor("Wool Shirt",1,"none","Chest",2)),Armors.push(new Armor("Twine Cinch",1,"none","Belt",1)),Armors.push(new Armor("Ragged Trousers",1,"none","Pants",1)),Armors.push(new Armor("Damp Boots",1,"none","Boots",1)),Armors.push(new Armor("Linen Shirt",1,"common","Chest",2,"addQuickness",1)),Armors.push(new Armor("Leather Belt",1,"common","Belt",2)),Armors.push(new Armor("Wool Cap",1,"common","Head",2)),Armors.push(new Armor("Wool Cloak",1,"common","Back",2)),Consumables.push(new Consumable("Chicken Egg",1,"none","","healPlayer",4)),Consumables.push(new Consumable("Peasant Bread",1,"none","","healPlayer",5)),Consumables.push(new Consumable("Jerky",1,"common","","healPlayer",6)),Consumables.push(new Consumable("Dried Trout",2,"none","","healPlayer",8)),Consumables.push(new Consumable("Sharpsword Oil",2,"rare","","buffMaxDamage",2)),Consumables.push(new Consumable("Whetstone",2,"common","","buffMinDamage",1));var Items=Weapons.concat(Armors,Consumables);Items.push(new Item("Message",1,"epic",'It reads: "To be delivered to Jawn Peteron"'));