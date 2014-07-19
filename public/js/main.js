var game_template = (function () {
    
    var CANVAS_WIDTH = 600, CANVAS_HEIGHT = 600, FPS = 30;
    
    var canvas, stage, queue, frameCount, gameTimer, frames, previousGameState = "",
        currentGameState ="", score, mousePos;
    var walk, menu,gameMenu,instructions, blockArray,screenArray, snManager;
    var snManager;
    blockArray = [];
    
    
    var fileManifest = [
        {src:"bug.png", id:"bugs"},
        {src:"title_screen.jpg", id:"title_screen"},
        {src:"instruction_screen.jpg", id:"instructions"},
        {src:"gameover_screen.jpg", id:"gameover_screen"},
        {src:"menu.png", id:"menu"}
    ];
    
    function ScreenManager(){
        var screens = {};
        var numberScreens = [];
        
        return{
            addScreen : function(id, screen){
                screens[id] = screen;
                numberScreens.push(screen);
            },
            getScreen : function(id){
                return screens[id];
            },
            getAllScreens : function(){
                
                return numberScreens;
            },
            switchScreen : function(id){
                for(var x = 0; x < numberScreens.length; x++){
                    numberScreens[x].visible = false;
                }
                if(id !== "none")
                    screens[id].visible = true;
            }
        }
    }
    
    function Screen(bg){
        var visible = false;
        var image = new createjs.Bitmap(bg);
        var btns = new Array();
        stage.addChild(image);
        
        return {
            visible : false,
            draw : function (){
                
            },
            update: function (){
                if(this.visible){
                    image.visible = true;
                    for(var y = 0; y<btns.length;y++){
                        btns[y].visible = true;
                    }
                }
                else{
                    image.visible = false;
                    for(var y = 0; y<btns.length;y++){
                        //console.log(btns[y].visible);
                        btns[y].visible = false;
                    }
                }
            },
            addButton: function(btn, x, y){
                btn.x = x || 100;
                btn.y = y || 100;
                btns.push(btn);
                stage.addChild(btn);
            }
        }
    }
    /*
    function Button(x,y,width,height,bg){
        var content,action;
        var x = x; 
        var y = y;
        var width = width;
        var height = height;
        
        return{
            checkClick : function(mouseX,mouseY){
                // if()
                return false;
            },
            content : "",
            action : function(){}
            
        }
    }
    
    */
    
    gamestates = {
        "START" : function(){
            if(previousGameState !== currentGameState){
                
            }
            else{
                
            }
        },
        "TITLE" : function(){
            
            if(previousGameState !== currentGameState){
                
                var title = snManager.getScreen("title");
                title.visible = true;
                
                previousGameState = currentGameState;
                
            }
            else{
                
                
            }
            
            var length = snManager.getAllScreens().length;
            var list = snManager.getAllScreens()
            
            for(var x = 0; x < length; x++){
                var m = list[x];
                m.update();   
            }
            
        },
        "PLAYING" : function(){
            if(previousGameState !== currentGameState){
                runGameTimer();
                previousGameState = currentGameState;
            }
            else{
                if(gameTimer >= 10)currentGameState = "GAME_OVER";
            }
            var length = snManager.getAllScreens().length;
            var list = snManager.getAllScreens()
            
            for(var x = 0; x < length; x++){
                var m = list[x];
                m.update();   
            }
        },
        "INSTRUCTIONS" : function () {
            if(previousGameState !== currentGameState){
                
                previousGameState = currentGameState;
            }
            else{
                
            }
            var length = snManager.getAllScreens().length;
            var list = snManager.getAllScreens()
            
            for(var x = 0; x < length; x++){
                var m = list[x];
                m.update();   
            }
        },
        "LEVEL" : {
            
        },
        "GAME_OVER" : function(){
            if(previousGameState !== currentGameState){
                var screen = snManager.getScreen("gameover");
                screen.visible = true;
                previousGameState = currentGameState;
            }
            
            var length = snManager.getAllScreens().length;
            var list = snManager.getAllScreens()
            
            for(var x = 0; x < length; x++){
                var m = list[x];
                m.update();   
            }
        }
    };
    
    function handleClick(event) {
        currentGameState = "PLAYING";
        snManager.switchScreen("none");
    }
    
    function menuClick(event){
        currentGameState = "TITLE";
        snManager.switchScreen("title");
    }
    
    function instructClick(event){
        currentGameState = "INSTRUCTIONS";   
        snManager.switchScreen("instructions");
    }
    
    function loadFiles(){
        queue = new createjs.LoadQueue(true, "../images/");
        queue.installPlugin(createjs.Sound);
        queue.on("complete", loadComplete, this);
        queue.loadManifest(fileManifest);
    }
    
    function loadComplete(evt){
        var menuSheet = new createjs.SpriteSheet({
            images: [queue.getResult("menu")],
            frames:  [[0,0,156,61,0,1,1],[0,61,156,61,0,1,1],[0,122,213,59,0,1,1],[0,181,213,59,0,1,1],[0,240,235,59,0,1,1],[0,299,235,59,0,1,1]],
            animations: {
                play: [0,0, "play"],
                playHover: [1,1, "playHover"],
                instruct: [2,2, "instruct"],
                instructHover: [3,3, "instructHover"],
                menu:[4,4,"menu"],
                menuHover:[5,5,"menuHover"]
            }
        });
        //here I throw the frames into a sprite called 'blocks'
        //blocks = new createjs.Sprite(blockSheet);
        
        
        var walkSheet = new createjs.SpriteSheet({
            images: [queue.getResult("bugs")],//["bug.png"]
            frames: [[0,0,171,130,0,0,0],[0,130,171,135,0,0,0]],
            animations: {
                standRight: [0, 0, "standRight"],
                walkRight: [0, 1, "walkRight", .5]
            }     
        });
        
        walk = new createjs.Sprite(walkSheet);
        menu = new createjs.Sprite(menuSheet);
        gameMenu = new createjs.Sprite(menuSheet);
        var gameMenu2 = new createjs.Sprite(menuSheet);
        instructions = new createjs.Sprite(menuSheet);
        //displaySprites();
        
        var helper = new createjs.ButtonHelper(menu, "play", "playHover");
        var helper2 = new createjs.ButtonHelper(gameMenu, "menu", "menuHover");
        var helper3 = new createjs.ButtonHelper(instructions, "instruct", "instructHover");
        var helper4 = new createjs.ButtonHelper(gameMenu2, "menu", "menuHover");
        
        menu.addEventListener("click", handleClick);
        gameMenu.addEventListener("click", menuClick);
        gameMenu2.addEventListener("click", menuClick);
        instructions.addEventListener("click", instructClick);
        
        
        var title = Screen(queue.getResult("title_screen"));
        var game_over = Screen(queue.getResult("gameover_screen"));
        var instruct = Screen(queue.getResult("instructions"));
        
        snManager = new ScreenManager();
        snManager.addScreen("title", title);
        snManager.addScreen("gameover", game_over);
        snManager.addScreen("instructions", instruct);
        
        title.addButton(menu,120,300);
        title.addButton(instructions,280,300);
        game_over.addButton(gameMenu, CANVAS_WIDTH/2-20, 300);
        instruct.addButton(gameMenu2, CANVAS_WIDTH/2-20, 300);
        
        currentGameState = "TITLE";
        startLoop();
    }
    
    function displaySprites() {
        walk.x=100;
        walk.y=200;
        walk.gotoAndPlay("walkRight");
        stage.addChild(walk);
        stage.update();
        
    }
    
    function setup(){
        canvas = document.getElementById("game");
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
        stage = new createjs.Stage(canvas);
        stage.enableMouseOver(10);
        mousePos = new createjs.Text("Mouse", "20px Arial", "#f00");
        
        stage.on('stagemousemove', function(evt){
            mousePos.text = 'Mouse{X: ' + evt.stageX + ', Y:' + evt.stageY+"}";
        });
        stage.addChild(mousePos);
        currentGameState = "TITLE";
        // startLoop(); //temporary until I can preload
    }
    
    function resetGameTimer(){
        frames = 0;
        gameTimer = 0;
    }
    function runGameTimer(){
        frames += 1;
        /*if(frames%(FPS/10) === 0){
            gameTimer = frames/(FPS);   
        }*/
        setTimeout(function(){
            currentGameState ="GAME_OVER";
        }, 10000);
        /* gameTimer = setInterval(function(){
                init();
            }, 1000/FPS);*/
    }
    function update(){
        //var y = ScreenManager().getAllScreens();
        //console.log(y);
        /* for(var x = 0; x < ScreenManager().getAllScreens().length; x++){
           
       }*/
        stage.update();
    }
    function draw(){
        // console.log('UPDATING');
        gamestates[currentGameState]();
        // stage.fillText("SCORE: " + score, CANVAS_WIDTH-100, CANVAS_HEIGHT-20);
        //stage.fillText(mousePos, CANVAS_WIDTH-80, 20);
        
    }
    function loop(){
        frames++;
        update();
        draw();
    }
    //This creates the loop that workes like setInterval
    function startLoop() {
        createjs.Ticker.addEventListener("tick", loop);
        createjs.Ticker.setFPS(FPS);
        
    }
    
    function init(){
        setup();
        loadFiles();
    }
    
    return {
        playGame : function playGame(){
            init();
            
        }
    }
    
    
})();

(function(){
    game_template.playGame();
})();
