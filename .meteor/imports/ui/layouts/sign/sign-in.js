import './sign-in.html';

import { Meteor }   from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session }  from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';



let moment    = require('moment');
let translate = require('/imports/language')('SignIn');

let onButton = { SignIn: false, SignImage: false, Nav: true };
let toPanelSignId = function(fade){
  onButton.SignImage = false;
  $('.ui.button.sign-in').css({ 'border-radius': 0 });
  $('.ui.button.sign-back, .or.sign-or').hide();
  if(!fade) {
    $('.form.sign-in .sign-image').hide();
    $('.form.sign-in .sign-id').show();
  }
}

let toPanelSignImage = function(fullname, email, status, fade){
  onButton.SignImage = true;
  if(status) {
    $('.ui.button.sign-in').removeAttr('style');
    $('.ui.button.sign-back, .or.sign-or').show();
    if(!fade) {
      $('.form.sign-in .sign-id').hide();
      $('.form.sign-in .sign-image').show();
    } 
    $('.field.username input').val(email);
  } else {
    if(!fade) {
      $('.form.sign-in .sign-id').hide();
      $('.form.sign-in .sign-image').show();
    }
    $('.ui.button.sign-back').removeAttr('style');
    $('.ui.button.sign-in, .or.sign-or, .ui.sign-trouble').hide();
    $('.ui.button.sign-back').show();
    $('.field.username input').val(email);
  }

  $('.form.sign-in .sign-avartar').avatar(email, 256);
  $('.form.sign-in .sign-email').html(fullname);
  T.Storage('signin-username', { fullname: fullname, email: email, status: status});
}


Template.SignIn.events({
  'change .ui.remember-id input': function(event) {
  	T.Storage('signin-remember-id', event.target.checked ? 'check': 'uncheck');
  },
  'click #sign-trouble': function(event){
  	// $('.form.sign-in').transition('fade right', function(){
  		FlowRouter.go('trouble');
  	// });
  },
  'click .sign-back.button': function(){
    if(!onButton.SignIn) {
      $('.ui.sign-image').transition('remove looping').transition({ 
        animation: 'fade left', 
        onComplete: function(){
          $('.ui.sign-id').transition('fade left');
          if(!T.Storage('signin-username').status) {
            $('.ui.sign-password').transition('fade left');
            $('.ui.button.sign-in, .ui.sign-trouble').show();
            $('.ui.button.sign-back').css('max-width', '83px');
          }
        }
      });
    	toPanelSignId(true);
    }
    if(!T.Storage('signin-username').status) {
      $('.ui.sign-deined').transition('hide');
      $('.field.password input').val('');
      $('.field.username input').val('').focus();
      $('.ui.remember-id').checkbox('uncheck');
      onButton.SignImage = false;
    }
  }
});

Template.SignIn.helpers({
  rememberId: function () {
    return '';
  }
});

Template.SignIn.onRendered(function() {
  $('.ui.prepare.dimmer').transition({
    animation  : 'fade',
    duration   : '300ms',
    onComplete : function() { $('.ui.prepare.dimmer').remove(); }
  });
  
  $('.ui.panel.sign-in').fadeIn(300);
  $('.ui.panel.main').hide();
  $('.ui.remember-id').checkbox(T.Storage('signin-remember-id') || 'uncheck');  // 

  if(T.Storage('signin-remember-id') == 'check' && T.Storage('signin-username')) {
    let user = T.Storage('signin-username');
    toPanelSignImage(user.fullname, user.email, user.status);
    $('.ui.button.sign-back, .or.sign-or, .ui.button.sign-in, .ui.sign-trouble').show();
    $('.ui.button.sign-back').css('max-width', '83px');
    $('.field.password input').focus();
  } else {
    toPanelSignId();
    $('.field.username input').focus();
  }

  $('.ui.sign-in.form').form({
    inline : true,
    on     : 'blur',
    fields: {
      email: {
        identifier: 'email',
        rules: [
          { type: 'empty', prompt: translate('valid.email.empty') },
          // { type: 'email', prompt: translate('valid.email.invalid') }
        ]
      },
      password: {
        identifier: 'password',
        rules: [
          { type: 'empty', prompt: translate('valid.password.empty') },
          { type: 'length[6]', prompt: translate('valid.password.length') }
        ]
      }

    },
    onInvalid: function() {
      $('div.ui.panel.sign-in div.ui.basic.prompt.label').each(function(i, e){
        if(!$(e).hasClass('pointing below')) $(e).removeClass('pointing').addClass('pointing below');
      });
    },
    onSuccess: function(event, fields){
      $('.button.sign-in').removeClass('positive green').addClass('loading');
      $('.ui.sign-trouble').hide();
      $('.field.username, .field.remember, .field.password, .button.sign-back').addClass('disabled');

      if(!onButton.SignIn) {
        onButton.SignIn = true;
        
        let auth = { 
          email: $('.field.username input').val(), 
          password: $('.field.password input').val() 
        }

        Meteor.loginWithPassword(auth.email, auth.password, function(err){
          console.log('loginWithPassword', !err ? 'Successful.' : err);
          if(!err) {
            var profile = Meteor.user().profile;
            if(profile.status) {
              $('.ui.dimmer.prepare').fadeIn(300);
              $('.ui.panel.sign-in').fadeOut(300, function(){
                toPanelSignImage(profile.fullname, auth.email, true, true);
                Session.set('SESSION_ID', Meteor.userId()); 
                Session.set('SESSION_TIME', T.Timestamp); 

                T.Init(T.Timestamp).then(function(){
                  $('.ui.panel.main').fadeIn();
                  FlowRouter.go('repository');
                });
              });
            } else {
              console.log('Access is denied');
              $('.ui.sign-password').transition({ 
                animation: 'fade right', 
                onComplete: function(){
                  $('.ui.sign-deined').transition('fade right');
                }
              });
              if(!onButton.SignImage) {
                $('.ui.sign-id').transition('remove looping').transition({ 
                  animation: 'fade right', 
                  onComplete: function(){
                    $('.ui.sign-image').transition('fade right');
                  }
                });
              }
              Meteor.logout(function() {
                toPanelSignImage(profile.fullname, auth.email, false, true);
              });
            }

          } else {
            if (err.reason == "User not found") {
              $('.field.username').addClass('error');
              $('.field.username input').val('').focus().blur().focus();
              $('.field.password input').val('');
            } else if (err.reason == "Incorrect password") {
              if(!onButton.SignImage) {
                $('.ui.sign-id').transition('remove looping').transition({ 
                  animation: 'fade right', 
                  onComplete: function(){
                    $('.ui.sign-image').transition('fade right');
                  }
                });
                toPanelSignImage(auth.email, auth.email, true, true);
              }

              $('.field.password').addClass('error');
              $('.field.password input').val('').focus().blur().focus();

            }
          }
          onButton.SignIn = false;
          $('.button.sign-in').addClass('positive green').removeClass('loading');
          $('.ui.sign-trouble').show();
          $('.field.username, .field.remember, .field.password, .button.sign-back').removeClass('disabled');
        });


      }
      return false;
    },
    onFailure: function(){ 
      return false; 
    }
  });


});