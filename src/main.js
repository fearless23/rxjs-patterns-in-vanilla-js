const { createStream } = require('./twitterStream');
const { observer } = require('./vanillaJS');

/*
const stream = createStream('rxjs', 'corona');

stream.getTweet().subscribe((d) => {
  console.log(d.id);
});
*/

const stream = createStream('vanilla', 'corona');
stream.getTweet(observer);

// const stream = createStream("vanillaSub", 'corona')
