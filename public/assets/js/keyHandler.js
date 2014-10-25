var keyState = [];

var KEY_LEFT=37, KEY_UP=38, KEY_RIGHT=39, KEY_DOWN=40, KEY_SPACE=32, KEY_P=80, KEY_W=87, KEY_A=65, KEY_S=83, KEY_D=68, KEY_J = 74;

function handleKeyPress(event){
    //console.log(event.keyCode);
    if(keyState[event.keyCode] != null){
	var theState = keyState[event.keyCode];    
        keyState[event.keyCode] = {
	pressed:true,
        wasPressed:theState.pressed
        }
    }else{
        keyState[event.keyCode] = 
        {
            pressed: true,
            wasPressed: false,
        }
    }
}
