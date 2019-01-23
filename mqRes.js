window.mqRes = function (mediaQueries) {
    this.status = {};
    this.watchers = [];
    this.matchMedia = [];
    this.mediaQueries = mediaQueries || null;
    this.labels = [];
    this.callbacks = [];
    this.isMediaAttached = false;

    this.init(mediaQueries);
};

window.mqRes.prototype = {
    init: function (mediaQueries) {
        this.mediaQueries = mediaQueries;

        if (!this.mediaQueries) {
            throw 'mqRes first argument should be array with media queries object!!!!';
        }

        this.attachMedia(this.mediaQueries);
    },
    attachMedia: function (mediaQueries) {
        var that = this;

        if (that.isMediaAttached) {
            that.watchers.forEach(function (item) {
                item.removeListener(that.responseMedia.bind(that));
            });
        }

        mediaQueries.forEach(function (item) {
            var mediaQuery = '',
                index = 0;

            if (item.from !== undefined) {
                mediaQuery += '(min-width: ' + item.from + 'px)';
            }

            if (item.to !== undefined) {
                if (item.from !== undefined) {
                    mediaQuery += ' and (max-width: ' + item.to + 'px)';
                } else {
                    mediaQuery += '(max-width: ' + item.to + 'px)';
                }
            }

            that.watchers.push(window.matchMedia(mediaQuery));
            index = that.watchers.length - 1;

            that.labels.push({
                label: item.label,
                media: that.watchers[index].media
            });

            that.responseMedia(that.watchers[index]);
            that.watchers[index].addListener(that.responseMedia.bind(that));
        });

        this.isMediaAttached = true;
    },
    responseMedia: function (watcher, callbackFromAdd) {
        var that = this,
            matchingLabel = that.getMatchingLabel(watcher);

        if (watcher.matches) {
            if (matchingLabel) {
                that.status[matchingLabel] = true;
            }
        } else if (matchingLabel) {
            that.status[matchingLabel] = false;
        }

        if (watcher.matches) {
            setTimeout(function () {
                if (callbackFromAdd) {
                    callbackFromAdd(that.status);
                } else {
                    that.callbacks.forEach(function (callback) {
                        callback(that.status);
                    });
                }
            }, 10);
        }
    },
    getMatchingLabel: function (watcher) {
        var matchingLabel = false;

        this.labels.forEach(function (item) {
            if (item.media === watcher.media) {
                matchingLabel = item.label;
            }
        });

        return matchingLabel;
    },
    add: function (callback) {
        if (typeof callback === 'function') {
            if (!this.mediaQueries.length) {
                throw 'media queries list is not set, please set it and try again';
            }

            this.watchers.forEach(function (watcher) {
                this.responseMedia(watcher, callback);
            }.bind(this));

            this.callbacks.push(callback);
        } else {
            throw 'callback must be a function';
        }
    }
};
