# tennu-title

A plugin for the [tennu](https://github.com/Tennu/tennu) irc framework.

Hooks into the dbcore and uses the data from dblogger to check when someone last sent a link to the channel.

Optionally uses - [tennu-cooldown](https://github.com/Tennu/tennu-cooldown)

### Configuration

**liveTitle**: (default: false) Send title when link is sent to the channel. 

```Javascript
"title": {
    "liveTitle": true
}
```

### Requires
- [tennu-admin](https://github.com/Tennu/tennu-admin)
- [tennu-dblogger](https://github.com/LordWingZero/tennu-dblogger)
  - [tennu-dbcore](https://github.com/LordWingZero/tennu-dbcore)


### Installing Into Tennu

See Downloadable Plugins [here](https://tennu.github.io/plugins/).

### Todo:

- Tests
