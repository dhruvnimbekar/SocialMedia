// const queue = require('../config/kue');

// const commentsMailer = require('../mailers/comments_mailer');

// queue.process('emails',function(job,done){
//     console.log('email worker processing a job',job.done);

//     commentsMailer.newComment(job.done);
//     done();
// });