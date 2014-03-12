// var game = new Phaser.Game(400, 490, Phaser.AUTO, 'game_div');

var main_state = {

    preload: function() { 
        this.game.stage.backgroundColor = '#71c5cf';
        this.game.load.image('bird', 'http://m.ak.fbcdn.net/profile.ak/hprofile-ak-prn2/t5/211934_1618235386_1567319985_q.jpg');  
        this.game.load.image('bg', 'assets/bg.png');
        this.game.load.image('pipe', 'assets/pipe.png');
        this.game.load.image('pipe-up', 'assets/pipe-up.png');
        this.game.load.image('pipe-down', 'assets/pipe-down.png');

        // Load jump sound
        this.game.load.audio('jump', 'assets/jump.wav');
    },

    create: function() { 
        var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space_key.onDown.add(this.jump, this); 
        this.game.add.sprite(0, 0, 'bg');

        this.pipes = game.add.group();
        // this.pipes.create(0,0,'pipe-down');
        // this.pipes.create(10,10,'pipe-up');
        this.pipes.createMultiple(20, 'pipe');
        this.timer = this.game.time.events.loop(1500, this.add_row_of_pipes, this);

        this.bird = this.game.add.sprite(100, 245, 'bird');
        this.bird.body.gravity.y = 1000; 
         // Change the anchor point of the bird
        this.bird.anchor.setTo(-0.2, 0.5);
               
        this.score = 0;
        this.first = true;
        var style = { font: "30px Arial", fill: "#ffffff" };
        this.label_score = this.game.add.text(20, 20, "0", style); 

        // Add sounds to the game
        this.jump_sound = this.game.add.audio('jump');
        // this.hit_sound = this.game.add.audio('hit'); 
    },

    update: function() {
        if (this.bird.inWorld == false)
            this.restart_game(); 

        // Make the bird slowly rotate downward
        if (this.bird.angle < 20)
            this.bird.angle += 1;

        this.game.physics.overlap(this.bird, this.pipes, this.hit_pipe, null, this);      
    },

    jump: function() {
        // if the bird hit a pipe, no jump
        if (this.bird.alive == false)
            return; 

        this.bird.body.velocity.y = -350;

        // Animation to rotate the bird
        this.game.add.tween(this.bird).to({angle: -20}, 100).start();

        // Play a jump sound
        this.jump_sound.play();
    },

    // Dead animation when the bird hit a pipe
    hit_pipe: function() {
        // Set the alive flag to false
        this.bird.alive = false;

        // Prevent new pipes from apearing
        this.game.time.events.remove(this.timer);

        // Go trough all the pipes, and stop their movement
        this.pipes.forEachAlive(function(p){
            p.body.velocity.x = 0;
        }, this);
    },

    restart_game: function() {
        this.game.time.events.remove(this.timer);
        this.game.state.start('main');
    },

    add_one_pipe: function(x, y, tipe) {
        var pipe = this.pipes.getFirstDead();
        pipe.reset(x, y);
        if (tipe == 0) {
            pipe.loadTexture('pipe');
        } else if (tipe == 1) {
            pipe.loadTexture('pipe-up');
        } else if (tipe == 2) {
            pipe.loadTexture('pipe-down');
        }
        pipe.body.velocity.x = -200; 
        pipe.outOfBoundsKill = true;
    },

    add_row_of_pipes: function() {
        var hole = Math.floor(Math.random()*5)+1;
        
        for (var i = 0; i < 8; i++) {
            var tipe = 0;
            if (i == hole - 1) tipe = 2;
            else if (i == hole + 2) tipe = 1;

            if (i != hole && i != hole +1) 
                this.add_one_pipe(400, i*65, tipe);   
        }
        
        if (!this.first) 
            this.score += 1;
        else
            this.first = false;
        this.label_score.content = this.score;  
    },
};

// game.state.add('main', main_state);  
// game.state.start('main'); 
