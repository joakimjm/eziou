(function () {
    'use strict';

    angular
        .module('Events')
        .service('EventCalculator', Calculator);

    Calculator.$inject = [];

    function Calculator() {
        var event;

        function service(obj) {
            console.log("event calculator for", obj);
            event = obj;
            return service;
        }

        service.usage = calcUsage;
        service.share = calcShare;
        service.balance = calcBalance;
        service.cost = calcCost;
        service.splitTheBill = splitTheBill;
        return service;

        //#region private methods
        /**
         * Sum usage of an item by participants.
         *
         * @param {Object} The item tested for usage.
         * @param {Array} An array of participants.
         * @returns {Number} Integer of participants using the item.
         */
        function calcUsage(item) {
            if (!angular.isArray(event.participants)) {
                throw TypeError("Argument 'participants' must be an array.")
            }

            var usage = 0;

            for (var i = 0; i < event.participants.length; i++) {
                if (event.participants[i].usesItem(item)) {
                    usage++;
                }
            }

            return usage;
        }

        function calcShare(item) {
            var usage = calcUsage(item, event.participants);

            var price = parseFloat(item.price) || 0;

            if (usage === 0) {
                return 0;
            }

            return (price / usage);
        }

        function calcBalance(participant) {
            var balance = 0.0,
                cost = 0.0,
                price = 0,
                item;

            cost = calcCost(participant);
            balance = cost;
            
            /*
             * 1. Look through the items purchased by the participant.
             * 2. Check if anyone uses it.
             */
            for (var i = 0; i < participant.purchasedItems.length; i++) {
                item = participant.purchasedItems[i];
                if (calcUsage(item, event.participants) > 0) {
                    /*
                     * Someone uses it, and it should be subtracted from his share sum.
                     */
                    //console.log(participant.name + " bought item: ", item.name);
                    price = parseFloat(item.price) || 0;
                    balance -= price;
                }
            }

            //console.log(participant.name, sum);
            return balance;
        }

        function calcCost(participant) {
            var cost = 0.0;
            
            for (var i = 0; i < participant.items.length; i++) {
                cost += calcShare(participant.items[i], event.participants);
            }
            return cost;
        }


        function splitTheBill(event) {

            var peopleToPay = {};
            peopleToPay.addParticipantToList = addParticipantToList;
            peopleToPay.list = [];

            var peopleToReceive = {};
            peopleToReceive.list = [];
            peopleToReceive.addParticipantToList = addParticipantToList;
 
            
            angular.forEach(event.participants, function (participant) {
                
                var currentBalance = calcBalance(participant);
                if (currentBalance < 0) {
                    peopleToReceive.addParticipantToList({name: participant.name, balance: round(-currentBalance) });
                } else if (currentBalance > 0) {
                    peopleToPay.addParticipantToList({name: participant.name, balance: round(currentBalance) })
                }
            })

            showList(peopleToPay.list, "pay");
            showList(peopleToReceive.list, "receive");

            
            var maxIteration = 10;
            for (var iteration = 0; iteration < maxIteration; iteration++) {
                if (peopleToReceive.list.length == 0 || peopleToPay.list.length == 0) {
                    console.log("Stop splitting", iteration);
                    break;
                }

                //showList(peopleToPay.list,"pay");
                //showList(peopleToReceive.list, "receive");
                
                var currentPayer = peopleToPay.list.pop();
                var currentReceiver = peopleToReceive.list.shift();   
                if (currentPayer.balance === currentReceiver.balance) {
                    console.log(currentPayer.name + " betaler " + currentPayer.balance + " til " + currentReceiver.name);
                } else if (currentPayer.balance < currentReceiver.balance) {
                    console.log(currentPayer.name + " betaler " + currentPayer.balance + " til " + currentReceiver.name);

                    currentReceiver.balance -= currentPayer.balance
                    peopleToReceive.addParticipantToList(currentReceiver);
                } else {
                    console.log(currentPayer.name + " betaler " + currentReceiver.balance + " til " + currentReceiver.name);
                    currentPayer.balance -= currentReceiver.balance;                    
                    peopleToPay.addParticipantToList(currentPayer);
                }
                console.log("");
            }
        }

        //split the bill helper function
        function addParticipantToList(obj) {
            if (this.list.length == 0) {
                this.list.push(obj);
                return;
            };

            for (var i = 0; i < this.list.length; i++) {
                if(obj.balance > this.list[i].balance ){
                    this.list.splice(i, 0, obj);
                    return;
                }
                if (i == this.list.length - 1) {
                    this.list.push(obj);
                    return;
                }
            }
        }

        function round(float) {
            var decimalPoint = 5;
            return Math.round((float * 10 * decimalPoint)) / (10 * decimalPoint);
        }

        //split the bill helper function
        function showList(list,payOrReceive) {
            var string = "";
            
            angular.forEach(list, function (participant) {
                if (payOrReceive === "receive") {
                    string += participant.name + " mangler at modtage " + participant.balance + ", ";
                }
                if (payOrReceive === "pay") {
                    string += participant.name + " mangler at betale " + participant.balance + ", ";
                }

            });
            console.log(string);
        }


        //#endregion
    }
})();