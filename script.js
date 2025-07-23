/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
  // your code here
  document.getElementById("coffee_counter").innerText = coffeeQty;
}

function clickCoffee(data) {
  // your code here
  data.coffee +=1;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  // your code here
  producers.forEach(producer => {
    if(producer.price / 2 <= coffeeCount) producer.unlocked = true;
  });
}

function getUnlockedProducers(data) {
  // your code here
  return data.producers.filter(producer => producer.unlocked === true);
}

function makeDisplayNameFromId(id) {
  // your code here
  return id
  .split('_').map(word => word[0].toUpperCase() + word.slice(1))
  .join(' ');
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'producer';
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  // your code here
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function renderProducers(data) {
  // your code here
  const producerContainer = document.getElementById('producer_container');
  deleteAllChildNodes(producerContainer);
  unlockProducers(data.producers, data.coffee);
  getUnlockedProducers(data).forEach(producer => {
    producerContainer.appendChild(makeProducerDiv(producer));
  });
}

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  // your code here
  for (let i=0; i<data.producers.length; i++) {
    if (data.producers[i].id === producerId) return data.producers[i];
  }
}

function canAffordProducer(data, producerId) {
  // your code here
  if(data.coffee >= getProducerById(data, producerId).price) return true;
  return false
}

function updateCPSView(cps) {
  // your code here
  document.getElementById('cps').innerText = cps;
}

function updatePrice(oldPrice) {
  // your code here
  return Math.floor(oldPrice*1.25);
}

function attemptToBuyProducer(data, producerId) {
  // your code here
  if(canAffordProducer(data, producerId)) {
    let producer = getProducerById(data, producerId);
    producer.qty += 1;
    data.coffee -= producer.price;
    producer.price = updatePrice(producer.price);
    data.totalCPS += producer.cps;

    return true;
  }
  else return false;
}

function buyButtonClick(event, data) {
  // your code here
  if(event.target.tagName === 'BUTTON') {
    const producerId = event.target.id.split('buy_')[1];

    if(attemptToBuyProducer(data, producerId)) {
      updateCoffeeView(data.coffee);
      updateCPSView(data.totalCPS);
      renderProducers(data);
    
    } 
    else window.alert('Not enough coffee!');
  }
}

function tick(data) {
  // your code here
  data.coffee += data.totalCPS;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

function saveDateToLocal(data){
  localStorage.setItem('coffeeData', JSON.stringify(data));
}

function getData() {
  let dataFromStorage = JSON.parse(localStorage.getItem('coffeeData'));
  if (dataFromStorage !== null) {
    return dataFromStorage;

  } 
  else
     return window.data;
}

function renderAllData(data){
  updateCoffeeView(data.coffee);
  renderProducers(data);
  updateCPSView(data.totalCPS);
}

if (typeof process === 'undefined') {
  // Get starting data from the window object
  // (This comes from data.js)
  const data = getData();
  renderAllData(data);

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById('big_coffee');
  bigCoffee.addEventListener('click', () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById('producer_container');
  producerContainer.addEventListener('click', event => {
    buyButtonClick(event, data);
  });

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);
  setInterval(() => saveDateToLocal(data), 5000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick
  };
}
