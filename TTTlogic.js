//board will be an IIFE

//players will be a factory

//IIFE for control gameflow


// make a board, set value on board, return a boards spaces value
const game_board= (function () {

    //initialize board
    const board=[];

    // making a 3x3 array
    for(let i=0;i<3;i++){
        innerlist=[];
        for(let j=0;j<3;j++){
            innerlist.push('');
        }
        board.push(innerlist);
    }

    function setCell(row,col,value){
        if(row>=0 && row <3 && col >=0 && col<3){
            board[row][col]=value;
        }
        else{
            console.error('Invalid write coord');
        }
    }

    function getCell(row,col){
        if(row>=0 && row <3 && col >=0 && col<3){
            return board[row][col];
        }
        else{
            console.error('Invalid read coord')
        }

    }

    return{setCell,getCell}

})();


//closure counter for assigning symbol
//
function createPlayerFactory(){

    // uses concept of closure to keep track of player
    // across object creations
    let playerCount=0;

    //return a function with a closure counter attached
    //that can produce players

    return function(name){

        playerCount++;

        let symbol;

        //mark assignment
        if(playerCount===1){
            symbol='X';
        }
        else{
            symbol='O';
        };

        //give methods for private vars 
        const getplayerNum= ()=> playerCount;
        const getplayerName=()=> name;
        const getplayerSymbol=()=> symbol;

        return {name, symbol, getplayerNum, getplayerName,getplayerSymbol};


    };

};