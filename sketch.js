var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;

//create feed and lastFed variable here
var feed 
var lastFed


function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //create feed the dog button here
  feed=createButton("Feed your pet");
  feed.position(690,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();

  //console.log();

  //write code to read fedtime value from the database 
  var FedTimeVal = database.ref('FeedTime');
  FedTimeVal.on("value", function(data){
    lastFed = data.val();
  });

  //write code to display text lastFed time here
  if(lastFed>12){
    textSize(20);
    fill("white");
    text("Last fed at:" + (lastFed-12) + " PM", 330, 30);
  } else{
    textSize(20);
    fill("white");
    text("Last fed at:" + lastFed + " AM", 330, 30);
  }
  

  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);

  //write code here to update food stock and last fed time
  var foodStockVal = foodObj.getFoodStock();
  if(foodStockVal <= 0){
    foodObj.updateFoodStock(foodStockVal*0);
  } else{
    foodObj.updateFoodStock(foodStockVal-1);
    foodS--;
    database.ref('/').update({
      Food:foodS
    })
  }

  var currentHour = hour();
  database.ref("/").update({
    FeedTime: currentHour
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
