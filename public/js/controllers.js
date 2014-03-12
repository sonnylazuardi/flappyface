'use strict';

/* Controllers */

angular.module('FlappyFace.controllers', []).
controller('LoginCtrl', [function() {

}])
.controller('PlayCtrl', ['$scope', '$timeout', function($scope, $timeout) {
    // game.destroy();
    $scope.score = 0;
    $scope.die = false;
    $scope.restart = function() {
        console.log('restart');
        $scope.game.state.start('main');
    }
    $scope.main_state = {

        preload: function() { 
            this.game.stage.backgroundColor = '#71c5cf';
            this.game.load.image('bird', 'http://m.ak.fbcdn.net/profile.ak/hprofile-ak-prn2/t5/211934_1618235386_1567319985_q.jpg');  
            this.game.load.image('bird-enemy', 'http://profile.ak.fbcdn.net/hprofile-ak-prn2/t5/1119454_1532451461_781958746_q.jpg');  
            this.game.load.image('bg', 'assets/bg.png');
            this.game.load.image('btm', 'assets/btm.png');
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


            this.pipes = this.game.add.group();
            // this.pipes.create(0,0,'pipe-down');
            // this.pipes.create(10,10,'pipe-up');
            this.pipes.createMultiple(20, 'pipe');
            this.timer = this.game.time.events.loop(1500, this.add_row_of_pipes, this);

            this.bird_enemy = this.game.add.sprite(100, 245, 'bird-enemy');
            this.bird_enemy.body.gravity.y = 1000; 
            this.bird_enemy.hidup = true;
            this.bird_enemy.body.bounce.setTo(1, 1);
            this.bird_enemy.body.gravity.y = 1000; 
             // Change the anchor point of the bird
            this.bird_enemy.anchor.setTo(-0.2, 0.5);
            

            this.bird = this.game.add.sprite(100, 245, 'bird');
            this.bird.hidup = true;
            $scope.$apply(function() {
                $scope.die = false;
            });
            this.bird.body.gravity.y = 1000; 
             // Change the anchor point of the bird
            this.bird.anchor.setTo(-0.2, 0.5);

            this.btm = this.game.add.sprite(0, 470, 'btm');
            this.btm.body.velocity.x = -200;
                   
            this.score = 0;
            this.first = true;
            var style = { font: "30px Arial", fill: "#ffffff" };
            this.label_score = this.game.add.text(20, 20, "0", style); 

            // Add sounds to the game
            this.jump_sound = this.game.add.audio('jump');
            // this.hit_sound = this.game.add.audio('hit'); 
        },

        update: function() {
            if (this.bird.inWorld == false || !this.bird.hidup) {
                $scope.$apply(function() {
                    $scope.die = true;
                });
                this.bird_enemy.body.velocity.x = 0;
                // window.location = '#login';
                // this.restart_game(); 
            }

            // Make the bird slowly rotate downward
            if (this.bird.angle < 20)
                this.bird.angle += 1;

            
            this.game.physics.overlap(this.bird, this.pipes, this.hit_pipe, null, this);
            this.game.physics.collide(this.bird, this.btm, this.hit_btm, null, this);
            this.game.physics.overlap(this.bird_enemy, this.btm, this.hit_btm_enemy, null, this);
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

        hit_btm: function() {
            this.bird.hidup = false;
            this.hit_pipe();
        },

        hit_btm_enemy: function() {
            if (this.bird_enemy.hidup) {
                // this.bird.hidup = false;
                // this.hit_pipe();
                this.bird_enemy.body.velocity.y = 0;
                this.bird_enemy.body.gravity.y = 0;
                this.bird_enemy.body.velocity.x = -200;
                this.bird_enemy.hidup = false;
            }

        },

        // Dead animation when the bird hit a pipe
        hit_pipe: function() {
            // Set the alive flag to false
            this.bird.alive = false;

            // Prevent new pipes from apearing
            this.game.time.events.remove(this.timer);

            this.btm.reset(0, 470);
            this.btm.body.velocity.x = 0;

            // Go trough all the pipes, and stop their movement
            this.pipes.forEachAlive(function(p){
                p.body.velocity.x = 0;
            }, this);
        },

        restart_game: function() {
            this.bird.hidup = true;
            this.bird_enemy.hidup = true;
            $scope.$apply(function() {
                $scope.die = false;
            });
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
            
            this.btm.reset(0, 470);
            this.btm.body.velocity.x = -200;

            if (!this.first) 
                this.score += 1;
            else
                this.first = false;

            var score = this.score;
            $scope.$apply(function() {
                $scope.score = score;
            })
            this.label_score.content = this.score;  
        },
    };

    $scope.game = new Phaser.Game(400, 490, Phaser.CANVAS, 'game_div');
    $scope.game.state.add('main', $scope.main_state);  
    $scope.game.state.start('main');

    $scope.$on('$destroy', function() {
        window.webkitAudioContext = null;
        $scope.game.canvas = null;
        $scope.game.context = null;
        $scope.game.destroy();
    });
}]);