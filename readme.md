# PushWoosh.js - a wrapper for the PushWoosh REST API

**NOTE:** This is a WIP, not thoroughly tested.  

## Installation

$ npm install PushWoosh.js

## Usage

```javascript
var PushWoosh = require('PushWoosh.js'),
pushWoosh = new PushWoosh({
  auth: your_auth_key,
  application: your_application_id
});
```

The methods available mirror that of the PushWoosh API, ie:

- createMessage
- deleteMessage
- registerDevice
- unregisterDevice
- setTags
- getTags
- setBadge
- pushStat
- getNearestZone

See the [PushWoosh API documentation](https://www.pushwoosh.com/programming-push-notification/pushwoosh-push-notification-remote-api/) for more information.

```javascript
pushWoosh.createMessage({
  // see PushWoosh API reference
})
.then(function (response) {
    // do something
})
.fail(function (err) {
    // do something
});
```

If you need to override the application ID or supply an application group instead, you can do so:

```javascript
pushWoosh.createMessage({
    application: your_id_here,
    notifications: []
}).then().fail();
```

More documentation to come.
