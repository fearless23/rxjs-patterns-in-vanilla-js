const simpleObserver = (tweet) => console.log('M2', tweet.id);

const observer = {
  data: (d) => console.log('M2', d.id),
  complete: (c) => console.log('M2 COMPLETE', c),
  error: (e) => console.log('M2 ERROR', e),
};

class VanillaSubject {
  constructor(value = null) {
    this.value = value;
  }

  subscribe(onData, onError, onComplete) {
    this.onData = (d) => onData(d);
    this.onComplete = (c) => onComplete(c);
    this.onError = (e) => onError(e);
  }

  next(value) {
    try {
      this.onData(value);
    } catch (err) {
      this.onError(err);
    }
  }

  complete(data) {
    this.onComplete(data);
  }
}

module.exports = { simpleObserver, observer, VanillaSubject };
