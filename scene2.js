
var cle;
var cle_collecte = false;
var image_cle;

var serrure;
var brics2;
var enemy;
var frame_invincible = 0;

var red_power_up;
var red_power_up_collected;

class scene2 extends Phaser.Scene{
    
    constructor ()
    {
        super("scene2");
        this.pad = null;
    }
    
    preload ()
    {   
        this.load.image('dude', 'assets/images/dude.png');
        this.load.image('bloc', 'assets/images/platform.png');
        this.load.image('bric2', 'assets/images/bric2.png');
        this.load.image('bg', 'assets/images/bg3.png');
        this.load.image('power_up', 'assets/images/power_up.png');
        this.load.image('miel', 'assets/images/miel_pot.png');
        this.load.image('gold', 'assets/images/star.png');
        this.load.image('cle', 'assets/images/cle.jpg');
        this.load.image('serrure', 'assets/images/serrure.png');
    }
    
    create ()
    {
        this.physics.world.setBounds(0, 0, 2*config.width, config.height); 
        
        bg = this.add.tileSprite(1280, 360, 2*1280, 720, 'bg');
        
        murs = this.physics.add.staticGroup();
        murVertical = this.physics.add.staticGroup();
        
        murs.create(1280, -32, 'bloc').setScale(2*1280/400).refreshBody();
        murVertical1 = murVertical.create(1280*2+16*720/400, 360, 'bloc').setScale(720/400).refreshBody();
        murVertical1.angle += 90;
        murs.create(1280, 720, 'bloc').setScale(2*1280/400).refreshBody();
        
        golds = this.physics.add.group();
        
        cle = this.physics.add.group();
        cle.create(400,400, 'cle').setScale(0.5);
        
        serrure = this.physics.add.staticGroup();
        serrure.create(1000,400, 'serrure');
        
        red_power_up = this.physics.add.group();
        red_power_up.create(800,150, 'power_up');
        red_power_up.setTint(0xff0000);
        
        brics2 = this.physics.add.staticGroup();
        brics2.create(1000, 40, 'bric2');
        brics2.create(1000, 160, 'bric2');
        brics2.create(1000, 640, 'bric2');
        brics2.create(1000, 520, 'bric2');
        brics2.create(1000, 280, 'bric2');
        
        cursors = this.input.keyboard.addKeys({ 'up': Phaser.Input.Keyboard.KeyCodes.Z, 'left': Phaser.Input.Keyboard.KeyCodes.Q, 'right': Phaser.Input.Keyboard.KeyCodes.D, 'down': Phaser.Input.Keyboard.KeyCodes.S,'gas': Phaser.Input.Keyboard.KeyCodes.SPACE, 'restart': Phaser.Input.Keyboard.KeyCodes.R, 'abandon': Phaser.Input.Keyboard.KeyCodes.A});
        
        player = this.physics.add.sprite(60, y_0, 'dude');
        player.setCollideWorldBounds(true);
        
        enemy = this.physics.add.sprite(800, 50, 'dude');
        enemy.setTint(0xff0000);
        enemy.setCollideWorldBounds(true);
        
        hpText = this.add.text(10, 20, 'Hp = ' + hp_player, style).setScrollFactor(0);        
        goldText = this.add.text(10, 80, 'Gold = ' + gold_player, style).setScrollFactor(0);
        
        golds.create(1300, 300, 'gold');
        golds.create(1500, 600, 'gold');
        
        this.physics.add.collider(player, murs);
        this.physics.add.collider(enemy, murs);
        this.physics.add.overlap(player, enemy, player_enemy, null, this);
        this.physics.add.collider(player, serrure, toucheSerrure, null, this);
        this.physics.add.collider(player, brics2);
        this.physics.add.collider(player, golds, collectGold, null, this);
        this.physics.add.collider(player, red_power_up, collectRed, null, this);
        this.physics.add.overlap(player, cle, collectCle, null, this);
        this.cameras.main.startFollow(player, true, 0.5, 0.5);
        
        this.input.gamepad.once('down', function (pad, button, index) {
            gamepad = pad;
        }, this);
        
        image_cle = this.add.image(500, 100, 'cle').setScale(0.8).setScrollFactor(0);
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
            image_cle.setVisible(true);
        }
        else
        {
            image_cle.setVisible(false);
        }
        
        if (frame_invincible > 0)
        {
            if (Math.floor(frame_invincible/7)%2 == 0)
            {
                player.setVisible(false);
            }
            else
            {
                player.setVisible(true);
            }
            frame_invincible -= 1;
        }
        else {player.setVisible(true);}
        
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
        
        if (player.x <= 50){
            x_0 = 1280*2 - 60;
            y_0 = player.y;
            this.scene.start("scene1");
        }
        
        if (enemy.y <= 120){enemy.setVelocityY(1200);}
        if (enemy.y >= 550){enemy.setVelocityY(-1200);}
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

function collectCle (player, cle)
{
    cle_collecte = true;
    cle.disableBody(true, true);
}

function collectRed (player, red_power_up)
{
    red_power_up_collected = true;
    red_power_up.disableBody(true, true);
}

function toucheSerrure (player, serrure)
{
    if (cle_collecte){
        serrure.disableBody(true, true);
        cle_collecte = false;
    }
}

function player_enemy (player, enemy)
{
    if (red_power_up_collected)
    {
        golds.create(enemy.x + 50,enemy.y, 'gold');
        enemy.disableBody(true, true);
    }
    else if (frame_invincible == 0)
    {
        frame_invincible = 180;
        hp_player -=1;
        if (hp_player == 0)
        {
            endText = this.add.text(600, 350, 'Vous êtes mort !', style).setScrollFactor(0);
            this.physics.pause();
            return;
        }
    }
}