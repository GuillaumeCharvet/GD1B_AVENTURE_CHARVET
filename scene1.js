var gamepad;
var gamepadA;
var gamepad_used;
    
var player;
var hp_player = 1;
var gold_player = 6;
var x_0 = 600;
var y_0 = 300;
var angle = 0;
var velocity = 600;
    
var hpText;
var goldText;
var endText;
var style = { font: "40px Arial", fill: "#52bace", align: "center" , backgroundColor: "#395B75"};
var cursors;
var move;
var bg;
var murs;
var brics;
var murVertical;
var murVertical1;

var golds;

var power_up;
var power_up_collected;

var image_red;

var miels;

var start = true;


class scene1 extends Phaser.Scene{
    
    constructor ()
    {
        super("scene1");
        this.pad = null;
    }
    
    preload ()
    {   
        this.load.image('dude', 'assets/images/dude.png');
        this.load.image('bloc', 'assets/images/platform.png');
        this.load.image('bric', 'assets/images/bric.png');
        this.load.image('bg', 'assets/images/bg3.png');
        this.load.image('power_up', 'assets/images/power_up.png');
        this.load.image('miel', 'assets/images/miel_pot.png');
        this.load.image('gold', 'assets/images/star.png');
        this.load.image('cle', 'assets/images/cle.jpg');
    }
    
    create ()
    {        
        this.physics.world.setBounds(0, 0, 2*config.width, config.height); 
        
        bg = this.add.tileSprite(1280, 360, 2*1280, 720, 'bg');
        
        murs = this.physics.add.staticGroup();
        murVertical = this.physics.add.staticGroup();
        
        murs.create(1280, -32, 'bloc').setScale(2*1280/400).refreshBody();
        murVertical1 = murVertical.create(0-16*720/400, 360, 'bloc').setScale(720/400).refreshBody();
        murVertical1.angle += 90;
        murs.create(1280, 720, 'bloc').setScale(2*1280/400).refreshBody();
        
        if(start){brics = this.physics.add.staticGroup();
            brics.create(1200, 120, 'bric');
            brics.create(1200, 270, 'bric');
            brics.create(1200, 420, 'bric');
            brics.create(1200, 570, 'bric');
        }
        
        golds = this.physics.add.group();
        golds.create(50,550, 'gold');
        
        power_up = this.physics.add.group();
        if(start && !power_up_collected){power_up.create(200,200, 'power_up');}
        
        miels = this.physics.add.group();
        miels.create(800,550, 'miel');
        
        cursors = this.input.keyboard.addKeys({ 'up': Phaser.Input.Keyboard.KeyCodes.Z, 'left': Phaser.Input.Keyboard.KeyCodes.Q, 'right': Phaser.Input.Keyboard.KeyCodes.D, 'down': Phaser.Input.Keyboard.KeyCodes.S,'gas': Phaser.Input.Keyboard.KeyCodes.SPACE, 'restart': Phaser.Input.Keyboard.KeyCodes.R, 'abandon': Phaser.Input.Keyboard.KeyCodes.A});

        player = this.physics.add.sprite(x_0, y_0, 'dude');
        
        player.setCollideWorldBounds(true);
        
        hpText = this.add.text(10, 20, 'Hp = ' + hp_player, style).setScrollFactor(0);        
        goldText = this.add.text(10, 80, 'Gold = ' + gold_player, style).setScrollFactor(0);
        
        this.physics.add.collider(player, murs);
        this.physics.add.collider(player, brics, collideBric, null, this);
        this.physics.add.overlap(player, power_up, collectPowerUp, null, this);
        this.physics.add.overlap(player, miels, collectMiel, null, this);
        this.physics.add.collider(player, golds, collectGold, null, this);
        
        this.cameras.main.startFollow(player, true, 0.5, 0.5);
        
        this.input.gamepad.once('down', function (pad, button, index) {
            gamepad = pad;
        }, this);
    }
    
    update ()
    {
        this.input.gamepad.once('connected', function (pad) {});
        
        if (power_up_collected)
        {
            player.angle += 10;
            this.add.image(300, 100, 'power_up').setScale(1.6).setScrollFactor(0);
        }
        
        if (red_power_up_collected)
        {
            player.setTint(0xff0000);
            image_red = this.add.image(700, 100, 'power_up').setScale(1.6).setScrollFactor(0);
            image_red.setTint(0xff0000);
        }
        
        if (cle_collecte)
        {
            this.add.image(500, 100, 'cle').setScale(0.8).setScrollFactor(0);
        }
        
        hpText.setText('Hp = ' + hp_player);
        goldText.setText('Gold = ' + gold_player);
        
        if (gamepad)
        {
            if (Math.pow(gamepad.leftStick.x,2)+Math.pow(gamepad.leftStick.y,2)>0.5)
            {
                move = true;
                gamepad_used = true;
                if (gamepad.leftStick.x == 0){angle = 0;}
                else
                {
                    angle = Math.round(360*Math.atan2(gamepad.leftStick.y,gamepad.leftStick.x)/(2*Math.PI));
                    if (angle < 0){angle += 360;}
                }
            }
            else
            {
                move = false;
                gamepad_used = false;
            }
        }
        
        if(!gamepad_used){
        if (cursors.left.isDown && !cursors.up.isDown && !cursors.right.isDown && !cursors.down.isDown)
        {
            angle = 180;
            move = true;
        }
        else if (!cursors.left.isDown && cursors.up.isDown && !cursors.right.isDown && !cursors.down.isDown)
        {
            angle = 270;
            move = true;
        }    
        else if (!cursors.left.isDown && !cursors.up.isDown && cursors.right.isDown && !cursors.down.isDown)
        {
            angle = 0;
            move = true;
        }   
        else if (!cursors.left.isDown && !cursors.up.isDown && !cursors.right.isDown && cursors.down.isDown)
        {
            angle = 90;
            move = true;
        }
        else if (cursors.left.isDown && cursors.up.isDown && !cursors.right.isDown && !cursors.down.isDown)
        {
            angle = 225;
            move = true;
        }
        else if (!cursors.left.isDown && cursors.up.isDown && cursors.right.isDown && !cursors.down.isDown)
        {
            angle = 315;
            move = true;
        }
        else if (!cursors.left.isDown && !cursors.up.isDown && cursors.right.isDown && cursors.down.isDown)
        {
            angle = 45;
            move = true;
        }
        else if (cursors.left.isDown && !cursors.up.isDown && !cursors.right.isDown && cursors.down.isDown)
        {
            angle = 135;
            move = true;
        }
        else {move = false;}
        }
        
        if (move)
        {
            //player.x += velocity * Math.cos(2*Math.PI*angle/360);
            //player.y += velocity * Math.sin(2*Math.PI*angle/360);
            player.setVelocityX(velocity * Math.cos(2*Math.PI*angle/360));
            player.setVelocityY(velocity * Math.sin(2*Math.PI*angle/360));
        }
        else
        {
            player.setVelocityX(0);
            player.setVelocityY(0);
        }
        
        if (player.x >= 1280*2 -50){
            y_0 = player.y;
            start = false;
            this.scene.start("scene2");
        }
    }

}

function collectGold (player, gold)
{
    gold.disableBody(true, true);

    //  Add and update the score
    gold_player += 1;

    if (gold_player == 10)
    {
        endText = this.add.text(600, 350, 'Vous êtes riche !', style).setScrollFactor(0);
        this.physics.pause();
        return;
    }
}

function collideBric (player, bric)
{
    if (power_up_collected)
    {
        bric.disableBody(true, true);
    }
}

function collectPowerUp (player, power_up)
{
    power_up_collected = true;
    power_up.disableBody(true, true);
}

function collectMiel (player, miel)
{
    hp_player += 1;
    miel.disableBody(true, true);
}