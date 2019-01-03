# mq-respond
Vanilla js lib which handles responsive javascript using matchMedia method

## Installation
Include the mqRes in your page via script tag or require it from npm.

There is 2 mqRes.js and mqRes.min.js files in repo.

## Usage
Lib creates class mqRes on window object, you need to create an instance of it and pass array with media queries objects to it.

```
var mqRespond = new mqRes([
    {
        label: 'phone',
        from: 0,
        to: 479
    },
    {
        label: 'phoneLandscape',
        from: 480,
        to: 767
    },
    {
        label: 'tablet',
        from: 768,
        to: 1023
    },
    {
        label: 'desktop',
        from: 1024,
        to: 1679
    },
    {
        label: 'desktopLarge',
        from: 1680
    }
]);

mqRespond.add(function (status) {
    console.log('desktopL:', status.desktopLarge);
});

mqRespond.add(function (status) {
    console.log('desktopL2:', status.desktopLarge);
});
```

Each object has the following properties:   
label - label of the beakpoint, needs to be one word since it will be used in js later   
from - from where breakpoint starts   
to - where breakpoint ends   

if `to` in not specified code will create only `min-width` media query

Now when you have initialized mqRes instance you can add multiple callbacks to it via `add` method.

`add` method accepts callback parameter which provides `status` parameter which will provide info per media config array you used as constructor parameter.

e.g:   
```
{
    desktop: false
    desktopLarge: true
    phone: false
    phoneLandscape: false
    tablet: false
}
```

So in your callbacks you can write code like:
```
mqRespond.add(function (status) {
    if (status.phone || status.phoneLandscape || status.tablet) {
        console.log('Do something you need on mobile only');
    }

    if (status.desktop || status.desktopLarge) {
        console.log('Do something you need on desktop only');
    }

    if (!status.phone) {
        console.log('Do something which you want to do everywhere but mobile viewport');
    }
});
```

