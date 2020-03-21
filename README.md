# Reward logger

Reward logger is something that does exactly what its name implies : it logs rewards. When you are running a business on the steem blockchain (like @steempress) your revenues come from a lot of different channels, curation rewards, producer rewards, author rewards or even benefactor rewards for some cases. 

And these are key performance indicators when you want to monitor how well you are doing, for instance if we were to change our curation methods we don't really have the tools to easily know how that affected our revenues. Of course you can always go to the various tools already provided by the community like steemdb, steemd, steemworld etc to check it out 

But steemdb has yet to be updated with the changes regarding hf20  (beneficiaries now pay out sbd). and it can be a bit unstable at times. Plus if you are monitoring several accounts there is no way to really have everything in the same place and you have to do some calculations yourself which is not ideal at all. 

So I figured I would build my own version to track all that.

With this tool you simply provide a list of accounts to track and it will fill a mysql database with the data regarding your rewards day by day, which allows you to easily build your preferred visualizations on top of it, or extract it to excel and make graphs/tinker with the data. 

This is intended to provide a data layer to support another visual layer later on (I am probably going to build my own and share it with you all later on)

## Features

- Track as many accounts as you want 
- Completely configurable 
- Runs in the background and fills a database with day by day infos on  
  - curation rewards 
  - Benefactor rewards
  - Witness rewards 
  - Author rewards

Installation

> git clone git@github.com:drov0/reward-logger.git
>
> cd reward-logger
>
> npm install 
>
> touch .env

now edit the .env with your database informations : 

```
DB_USER=root
DB_PW=root
DB_NAME=Mysuperdatabase
```

then execute the content of table.sql on your database to add the table. 

edit config.js to add the accounts you want to track, for instance if I want to track steempress and howo :

```
module.exports = ["steempress", "howo"]
```

And then just run it, I suggest using pm2 as it will provide you with some easy start stop mechanism and run it in the background :

> pm2 start logger.js

Technology Stack

- Nodejs : main language
- mysql  : storage
- dsteem : Library to query the steem blockchain   

Roadmap

- Optimize the number of operations that are picked, right now there is a lot of data that is recalculated for no reason and it's putting unnecessary strain on anyx.io 
- Build a dashboard on top to display the data.  

How to contribute?

Any contribution is welcome, I believe no code is perfect and can always be improved. Feel free to make pull requests, just make sure to fit to the coding style : 4 space indent and snake_case 

