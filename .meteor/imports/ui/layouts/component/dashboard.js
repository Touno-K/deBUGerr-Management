import './dashboard.html';

import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';

// import Chart from 'chart.js';

require('/imports/language')('Dashboard');



// Tracker.autorun(function(c) {
//   console.log(Session.get('sign-in'), Session.get('prepare'));
//   if(Session.get('sign-in') && Session.get('prepare')) {
//     $('.ui.dimmer.prepare').fadeOut(300);
//   }
//   // if(!Sessio n.get('prepare')) {
//   //   $('.ui.dimmer.prepare').fadeIn(300);
//   // }
// });


Template.Dashboard.onCreated(function(){

	// this.autorun(function(c) {
	// 	console.log('autorun');
	//   if(Session.get('sign-in') && Session.get('sign-user')) {
	//     $('.ui.dimmer.prepare').fadeOut(300);
	//   }
	// });
});


Template.Dashboard.onRendered(() => {

	$('.ui.prepare.dimmer').transition({
    animation  : 'fade',
    duration   : '300ms',
    onComplete : function() { $('.ui.prepare.dimmer').remove(); }
  });
  $('.ui.panel.main, .ui.panel.board').show();
  $('.ui.panel.sign-in').hide();

  $('.user-menu > .item').removeClass('selected');
  $('.user-menu > .item.home').addClass('selected');
});