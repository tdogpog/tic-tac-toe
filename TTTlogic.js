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

const gameState= (function () {
    
    //switch for ending the game
    let gameOver= false;

    //contains player objects for play
    let currentPlayer= null;

    //import our board for use across all functions
    const board=game_board;

    // players scoped for all of function
    // make sure they are let to allow reassignment
    //const keeps them as null
    let player1=null;
    let player2=null;

    function startGame(p1,p2){
        
        player1=p1; 
        player2=p2;
        currentPlayer=player1;
        gameOver=false;

    }
    
    function winChecks(){

        const win_coords=[
        // horz
        [[0,0], [0,1], [0,2]],
        [[1,0], [1,1], [1,2]],
        [[2,0], [2,1], [2,2]],
        // verts
        [[0,0], [1,0], [2,0]],
        [[0,1], [1,1], [2,1]],
        [[0,2], [1,2], [2,2]],
        // diags
        [[0,0], [1,1], [2,2]],
        [[0,2], [1,1], [2,0]],
        ];

        win_coords.forEach(combo=> {
            const [a,b,c]=combo;

            if(board.getCell(a[0],a[1]) &&
                board.getCell(a[0],a[1])=== board.getCell(b[0],b[1]) &&
                board.getCell(a[0],a[1])=== board.getCell(c[0],c[1])){
                console.log(`${currentPlayer.getplayerName()} wins!`);
                gameOver=true;
                //exit the loop early if you find the winning condition
                return;
                
            }
        });

        if(!gameOver){
            tie_checks();
        }

    }

    function tie_checks() {
        let allFilled = true;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board.getCell(i, j) === '') {
                    allFilled = false;
                    break;
                }
            }
            if (!allFilled) break;
        }
    
        if (allFilled) {
            console.log('It\'s a tie!');
            gameOver = true;
        }
    }

    function makeMove(row,col){

        if(gameOver){
            console.log('Game over!')
            return;
        }
        
        if(board.getCell(row,col)===''){
            board.setCell(row,col,currentPlayer.getplayerSymbol());
            winChecks();
            if (currentPlayer===player1){
                currentPlayer=player2;
            }
            else{
                currentPlayer=player1;
            }
        }
        else{
            console.log('Position taken.')
        }


    }

    return{startGame,makeMove,winChecks, getcurrentPlayer:()=> currentPlayer}

})();
  

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