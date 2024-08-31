//rendering / DOM process

const displayController=(function(){
    const gameBoardElement=document.getElementById('board');

    function renderBoard(board){
        gameBoardElement.innerHTML='';

        //create 3x3 cell div structure
        //with event listeners on each
        // that extract the text content from our game_board
        // and append themselves to the main div as children
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cell=document.createElement('div');
                cell.classList.add('cell');
                cell.textContent=board.getCell(i,j);

                // uses the for loop iterators attached to 
                // each cell to know where to make a move
                // our coord system here lines up with how 
                //makemove method works.
                cell.addEventListener('click',()=>{
                    gameState.makeMove(i,j);
                    //recreate board when a move has been made
                    renderBoard(board);
                });

                gameBoardElement.appendChild(cell);

            }
        }

    }
    return{renderBoard};
})();

//GAME LOGIC
// make a board, set value on board, return a boards spaces value
const game_board= (function () {

    //initialize board
    const board=[];

    // making a 3x3 array
    for(let i=0;i<3;i++){
        let innerlist=[];
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


        //set of all winning combos
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

        //for loop to breakout if a win is detected

        for (let i = 0; i < win_coords.length; i++) {
            const [a, b, c] = win_coords[i];
            if (board.getCell(a[0], a[1]) &&
                board.getCell(a[0], a[1]) === board.getCell(b[0], b[1]) &&
                board.getCell(a[0], a[1]) === board.getCell(c[0], c[1])) {
                console.log(`${currentPlayer.getplayerName()} wins!`);
                gameOver = true;
                return;
            }
        }

        //inefficient,but check for a tie every iteration
        //we could implement a counter for when the board is full and do a final check and then send
        //it to tie_checks if the wincheck didnt return a win
        if(!gameOver){
            tieChecks();
        }

    }

    function tieChecks() {
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

        //backup check if the game is over
        if(gameOver){
            console.log('Game over!')
            return;
        }
        
        if(board.getCell(row,col)===''){
            board.setCell(row,col,currentPlayer.getplayerSymbol());

            winChecks();

            if(gameOver){
                return;
            }

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

    function resetGame(){
        for (let i=0;i<3;i++){
            for (let j=0;j<3;j++){
                board.setCell(i,j,'');
                
            }
        }
        currentPlayer=player1;
        gameOver=false;
        console.log('Game Reset')
    }

    return{startGame,makeMove,winChecks, resetGame, getcurrentPlayer:()=> currentPlayer}

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

        return {getplayerNum, getplayerName,getplayerSymbol};


    };

};

const createPlayer = createPlayerFactory();
const player1 = createPlayer('Player 1');
const player2 = createPlayer('Player 2');

gameState.startGame(player1, player2);




window.onload = function () {
    displayController.renderBoard(game_board);
};


//program execution example

// create a player factor
// make 2 players
// start a game with gameState method
// make moves
// coded to naturally swap btwn depending who is player1/player2