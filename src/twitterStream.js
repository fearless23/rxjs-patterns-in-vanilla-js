const Twit = require('twit');
const { twitterConfig } = require('./configs/twitter.config');
const Twitter = new Twit(twitterConfig);
const { Subject } = require('rxjs');
const { VanillaSubject } = require('./vanillaJS');

const extractTweetData = (tweet) => {
  const { id_str, text, retweet_count, favorite_count, created_at, timestamp_ms } = tweet;
  const {
    id,
    screen_name,
    name,
    followers_count,
    friends_count,
    profile_image_url_https,
  } = tweet.user;
  return {
    time: created_at,
    timeMS: timestamp_ms,
    id: id_str,
    text,
    retweets: retweet_count,
    favorites: favorite_count,
    user: {
      screenName: '@' + screen_name,
      id: id,
      img: profile_image_url_https,
      name: name,
      followers: followers_count,
      friends: friends_count,
    },
  };
};

class BasicTwitterStream {
  constructor(hashtag) {
    this.stream = Twitter.stream('statuses/filter', {
      track: '#' + hashtag,
      language: 'en',
    });

    this.hashtag = hashtag;
    this.isStopped = false;
  }

  /**
   * Set isStopeed true and stops twitter stream
   */
  stop() {
    this.isStopped = true;
    this.stream.stop();
  }
}

class RxjsTypeTwitterStream extends BasicTwitterStream {
  newTweet = new Subject();
  constructor(hashtag) {
    super(hashtag);
    this.getData();
  }

  getData() {
    this.stream.on('tweet', (tweet) => {
      this.newTweet.next(extractTweetData(tweet));
    });
  }

  getTweet() {
    return this.newTweet.asObservable();
  }

  die() {
    this.stop();
    this.newTweet.complete();
  }
}

class VanillaTypeTwitterStream extends BasicTwitterStream {
  constructor(hashtag) {
    super(hashtag);
  }

  getTweet() {
    // OBSERVABLE IN VANILLA JS
    // https://dev.to/creeland/intro-to-rxjs-concepts-with-vanilla-javascript-4aji
    // SIMPLE PATTERN
    // return (observer)=> {
    //     this.stream.on('tweet', (tweet) => {
    //       observer( extractTweetData(tweet))
    //     });
    // }
    // ADD MORE TO OBSERVER LIKE ERROR, COMPLETE aND DATA METHOD
    return (observer) => {
      console.log('data fn', observer.data);
      this.stream.on('tweet', (tweet) => {
        console.log('TWEET', tweet.id);
        observer.data(extractTweetData(tweet));
        // if(err) observer.error("ERROR")
        // if(complete) observer
      });
    };
  }

  die() {
    this.stop();
  }
}

class VanillaSubjectTypeTwitterStream extends BasicTwitterStream {
  newTweet = new VanillaSubject();
  constructor(hashtag) {
    super(hashtag);
    this.getData()
  }

  getData() {
    this.stream.on('tweet', (tweet) => {
      this.newTweet.next(extractTweetData(tweet));
    });
  }

  getTweet() {
    return this.newTweet;
  }

  die() {
    this.stop();
    this.newTweet.complete()
  }
}

const createStream = (type, hashtag) => {
  switch (type) {
    case 'rxjs':
      return new RxjsTypeTwitterStream(hashtag);

    case 'vanilla':
      return new VanillaTypeTwitterStream(hashtag);

    case 'vanillaSub':
      return new VanillaSubjectTypeTwitterStream(hashtag);

    default:
      throw new Error('Pass correct type');
  }
};

module.exports = { createStream };
