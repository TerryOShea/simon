$(document).ready(function() {
  const audioURL = 'https://s3.amazonaws.com/freecodecamp/simonSound',
        audio = ['1.mp3', '2.mp3', '3.mp3', '4.mp3'], 
        $btn = $('.btn'), 
        $startBtn = $('.start-btn'),
        $strictBtn = $('.strict-btn'), 
        $strictLight = $('.strict-light'), 
        $countDisplay = $('.count-display'), 
        $onoffBtn = $('.onoff-btn'), 
        $slider = $('.slider');
  
  $btn.addClass('unclickable');
  $startBtn.addClass('unclickable');
  $strictBtn.addClass('unclickable');
  
  var timeoutID;
  var answers = [];
  var playeranswers = [];
  var strict = false;

  function reset() {
    answers = [];
    playeranswers = [];
    $btn.removeClass('unclickable');
    clearTimeout(timeoutID);
  }
  
  function init() {
    if (strict) $strictLight.addClass('strict');
    $countDisplay.html('1');
    setTimeout(function() {newMove();}, 700);
  }
  
  $strictBtn.on('click', function() {
    $strictLight.toggleClass('strict');
    strict = !strict;
  });

  function lightup(button) {
    $(button).animate({ opacity: .7 }, 100).delay(200).animate({ opacity: 1 }, 100);
    var i = $(button).attr('id');
    new Audio(audioURL + audio[i - 1]).play();
  }

  function newMove() {
    var i = Math.floor(Math.random() * 4 + 1)
    answers.push(i);
    lightup('#' + i);
    playeranswers = [];
  }
  
  function computerSequence() {
    var i = 0, len = answers.length;
    var intervalID = setInterval(function() {
      if (i == len) clearInterval(intervalID);
      lightup('#' + answers[i]);
      i++;
    }, 1000);
    setTimeout(function() {
      $btn.removeClass('unclickable');
    }, (answers.length + 1)*1000);
  }
  
  function win() {
    var order = [2,1,4,3];
    var i = 0;
    var intervalID = setInterval(function() {
      if (i == 11) clearInterval(intervalID);
      lightup($('#' + order[i % 4]));
      i++;
    }, 200);
    setTimeout(function() {
      var j = 0;
      var intervalID2 = setInterval(function() {
        if (j == 3) clearInterval(intervalID2);
        lightup($('#1'));
        lightup($('#2'));
        lightup($('#3'));
        lightup($('#4'));
        j++;
      }, 200);
    }, 2500);
  }
  
  function loss() {
    var i = 0;
    var intervalID = setInterval(function() {
      if (i == 2) clearInterval(intervalID);
      new Audio(audioURL + audio[0]).play();
      new Audio(audioURL + audio[1]).play();
      new Audio(audioURL + audio[2]).play();
      new Audio(audioURL + audio[3]).play();
      i++
    }, 200);
  }

  $btn.on('click', function() {
    lightup($(this));
    var i = $(this).attr('id');
    playeranswers.push(i);
    if (i != answers[playeranswers.length - 1]) {
      if (strict) {
        loss();
        setTimeout(function() {
          reset();
          init();
        }, 1000);
      }
      else {
        loss();
        playeranswers = [];
        setTimeout(function() {
          computerSequence();
        }, 1000);
      }
    }
    else if (playeranswers.length == answers.length) {
      $btn.addClass('unclickable');
      if (playeranswers.length == 20) {
        $countDisplay.html('Win!!');
        win();
        reset();
      }
      else {
        setTimeout(function() {
          $countDisplay.html((answers.length + 1).toString());
        }, 700);
        computerSequence();
        timeoutID = setTimeout(newMove, (answers.length + 1)*1000);
      }
    }
  });

  $onoffBtn.on('click', function() {
    $slider.toggleClass('on');
    $startBtn.toggleClass('unclickable');
    $strictBtn.toggleClass('unclickable');
    $btn.toggleClass('unclickable');
    if ($slider.hasClass('on')) {
      $countDisplay.html('--');
    }
    else { 
      reset();
      $strictLight.removeClass('strict');
      $countDisplay.html(''); 
    }
  });
  
  $startBtn.on('click', function() {
    reset();
    init();
  });
});