var game_template = (function () {
    
    var CANVAS_WIDTH = 600, CANVAS_HEIGHT = 600, FPS = 30;
    
    var canvas, stage, queue, frameCount, gameTimer, frames, previousGameState = "",
        currentGameState ="", score = 0, mousePos;
    var walk, menu,gamePlay,gameMenu,instructions, blockArray,screenArray, snManager;
    var snManager,textTime,date,gamePoints,gamePoints2,pauseTimer,keyText,keystate = {};
    blockArray = [];
    
    var KEYCODE_ENTER = 13;	//usefull keycode
    var KEYCODE_SPACE = 32;	//usefull keycode
    var KEYCODE_UP = 38;	//usefull keycode
    var KEYCODE_LEFT = 37;	//usefull keycode
    var KEYCODE_RIGHT = 39;	//usefull keycode
    var KEYCODE_DOWN = 40;
    var KEYCODE_W = 87;	//usefull keycode
    var KEYCODE_A = 65;	//usefull keycode
    var KEYCODE_D = 68;	//usefull keycode
    
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
   
    /*
     * Key Press
     * Be sure to add 
     * keyPressed[KEY_CODE] = false;
     * after an action so that the button is not pressed multiple times
     */
    window.onkeyup = function(event) {
    	keyPressed[event.keyCode] = true;
    }

    var fileManifest = [
        {src:"bug.png", id:"bugs"},
        {src:"title_screen.jpg", id:"title_screen"},
        {src:"instruction_screen.jpg", id:"instructions"},
        {src:"gameover_screen.jpg", id:"gameover_screen"},
        {src:"menu.png", id:"menu"},
        {src:"level-one.jpg", id:"level"}
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
                screens[id].visible = true;
            }
        }
    }
    
    function Screen(bg, left,top,animate,loop){
        var visible = false;
        var loop = loop;
        var tween;
        
        var image = new createjs.Bitmap(bg);
        image.x = left || 0;
        image.y = top || 0;
        if(animate !== "true")
            stage.addChild(image);        
        
        var btns = new Array();
        var txt = new Array();
        var objects = new Array();
        var lookObj = {};
        
        
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
                    for(var i = 0; i < txt.length; i++){
                        txt[i].visible = true;   
                    }
                    for(var i = 0; i < objects.length; i++){
                        objects[i].visible = true;   
                    }
                }
                else{
                    image.visible = false;
                    for(var y = 0; y<btns.length;y++){
                        //console.log(btns[y].visible);
                        btns[y].visible = false;
                    }
                    for(var i = 0; i < txt.length; i++){
                        txt[i].visible = false;   
                    }
                    for(var i = 0; i < objects.length; i++){
                        objects[i].visible = false;   
                    }
                }
            },
            addButton: function(btn, x, y){
                btn.x = x || 100;
                btn.y = y || 100;
                btns.push(btn);
                stage.addChild(btn);
            },
            addContent: function(text, x, y, font, color){
                text.x = x || 0;
                text.y = y || 0;
                text.font = font || text.font || "19px Arial";
                text.color = color || text.color || "#f00";
                stage.addChild(text);
                txt.push(text);
            },
            addObject: function(id, obj, x, y){
                
                obj.x = x || obj.x ||0;
                obj.y = y || obj.y ||0;
                objects.push(obj);
                lookObj[id] = obj;
                stage.addChild(obj);
            },
            getObject: function(id){
                return lookObj[id];
            },
            getAllObjects: function(){
                return objects;   
            },
            playTween : function(){
                image.visible = true;
                tween = createjs.Tween.get(image, {loop:false}).to({x:image.x, y:CANVAS_HEIGHT-395},1500, createjs.Ease.bounceOut).wait(1200).
                to({x:image.x,y:-400},1000,createjs.Ease.bounceOut).call(handleComplete);   
                
                stage.addChild(image);
            }
        }
    }
    
    gamestates = {
        "START" : function(){
            if(previousGameState !== currentGameState){
                
            }
        },
        "TITLE" : function(){
            
            if(previousGameState !== currentGameState){             
                snManager.switchScreen("title");
                previousGameState = currentGameState;
                
            }
            
            var length = snManager.getAllScreens().length;
            var list = snManager.getAllScreens()
            
            for(var x = 0; x < length; x++){
                var m = list[x];
                m.update();   
            }
            stage.update();
            
        },
        "PLAYING" : function(){
            var currentTime = new Date();
            var theTime;
            theTime = currentTime - date;
            theTime = Math.floor((theTime / 1000)*10)/10;
            if(previousGameState == "LEVEL"){
                console.log('LEVELING?');
                theTime = pauseTimer;
            }
            textTime.text = 'Time: ' + theTime.toFixed(1);
            
            if(previousGameState !== currentGameState){
                
                previousGameState = currentGameState;
            }
            // console.log("gametimer:" + gameTimer);
            if(theTime == 5){
                console.log("THETIME: " + theTime);
                pauseGameTimer(theTime);
                currentGameState = "LEVEL";
            }
            else if(theTime >= 10){
                currentGameState = "GAME_OVER";
            }
            
            var length = snManager.getAllScreens().length;
            var list = snManager.getAllScreens()
            
            for(var x = 0; x < length; x++){
                var m = list[x];
                m.update();   
            }
            
            gamePoints.text = 'Score: ' + score;
            stage.update();
            
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
        "LEVEL" : function() {
            if(previousGameState !== currentGameState){
                var lvl = snManager.getScreen("tween");
                lvl.visible = true;
                lvl.playTween();
                previousGameState = currentGameState;
            }
        },
        "GAME_OVER" : function(){
            if(previousGameState !== currentGameState){
                snManager.switchScreen("gameover");
                previousGameState = currentGameState;
                pauseTimer = 0;
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
        runGameTimer();
        displaySprites();
        snManager.switchScreen("gamePlay");
    }
    
    function menuClick(event){
        currentGameState = "TITLE";
        snManager.switchScreen("title");
    }
    
    function instructClick(event){
        currentGameState = "INSTRUCTIONS";   
        snManager.switchScreen("instructions");
    }
    function handleComplete(tween) {
        var ball = tween._target;
        console.log('ANIMATION COMPLETED');
        resetGameTimer(); 
    }
    
    function resetGameTimer(){
        frames = 0;
        currentGameState = "PLAYING";
        walk.gotoAndPlay("walkRight");
        
    }
    function pauseGameTimer(num){
        console.log('PAUSED TIME:' + num);
        pauseTimer= num + .1;   
        walk.gotoAndPlay("standRight");
        
    }
    function runGameTimer(){
        frames += 1;
        /*if(frames%(FPS/10) === 0){
            gameTimer = frames/(FPS);   
        }*/
        date = new Date();
        
    }
    
    function loadFiles(){
        queue = new createjs.LoadQueue(true, "assets/images/");
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
        var gamePlay = Screen();
        var shape = new createjs.Shape();
        var tween = Screen(queue.getResult("level"), 100, 0,"true");
        
        
        snManager = new ScreenManager();
        snManager.addScreen("tween", tween);
        snManager.addScreen("title", title);
        snManager.addScreen("gameover", game_over);
        snManager.addScreen("instructions", instruct);
        snManager.addScreen("gamePlay", gamePlay);
        
        
        title.addButton(menu,120,300);
        title.addButton(instructions,280,300);
        game_over.addButton(gameMenu, CANVAS_WIDTH/2-20, 300);
        instruct.addButton(gameMenu2, CANVAS_WIDTH/2-20, 300);
        
        mousePos = new createjs.Text("Mouse", "20px Arial", "#f00");
        textTime = new createjs.Text("Time: ", "20px Arial", "#f00");
        gamePoints = new createjs.Text("Score: " + score, "30px Arial", "#fff");
        gamePoints2 = new createjs.Text("Score: " + score, "30px Arial", '#fff');
        keyText = new createjs.Text("Keys held: {  } ", "20px Arial", "#fff" );
        
        stage.on('stagemousemove', function(evt){
            mousePos.text = 'Mouse{X: ' + evt.stageX + ', Y:' + evt.stageY+"}";
        });
        gamePlay.addContent(mousePos);
        gamePlay.addContent(textTime, CANVAS_WIDTH-190);
        gamePlay.addContent(gamePoints, 60, CANVAS_HEIGHT-30);
        game_over.addContent(gamePoints2, CANVAS_WIDTH/2-90, CANVAS_HEIGHT/2-90);
        instruct.addContent(keyText, 30, CANVAS_HEIGHT-100);
        
        
        currentGameState = "TITLE";
        startLoop();
    }
    
    function displaySprites() {
        var screen = snManager.getScreen('gamePlay');
        screen.addObject("bug", walk, 100, 180);
        walk.gotoAndPlay("walkRight");
        
    }
    
    function handleKeyDown(e) {
        if(!e){ var e = window.event; }
        switch(e.keyCode) {
            case KEYCODE_LEFT:	
                keyText.text = "Keys held: { LEFT }";
                break;
            case KEYCODE_RIGHT: 
                keyText.text = "Keys held: { RIGHT }";
                break;
            case KEYCODE_UP: 
                keyText.text = "Keys held: { UP }";
                break;
            case KEYCODE_DOWN: 
                keyText.text = "Keys held: { DOWN }";
                break;
        }
    }
    
    function handleKeyUp(e){
        //cross browser issues exist
        if(!e){ var e = window.event; }
        switch(e.keyCode) {
            case KEYCODE_LEFT: keyText.text = "Keys held: {  }"; break;
            case KEYCODE_RIGHT: keyText.text = "Keys held: {  }"; break;
            case KEYCODE_UP: keyText.text = "Keys held: {  }"; break;
            case KEYCODE_DOWN: keyText.text = "Keys held: {  }"; break;
        }
    }
    
    function setup(){
        canvas = document.getElementById("game");
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
        stage = new createjs.Stage(canvas);
        stage.enableMouseOver(10);
        
        currentGameState = "TITLE";
        
    }
    
    function update(){
        
        stage.update();
    }
    function draw(){
        gamestates[currentGameState]();
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
