infohamster
------------
Node.js service which collect information about the status of the server into Elasticsearch.
Support as sources: Redis, MongoDB.


## Supported modules

### redis-info
Store the data of commands "info" and "info commandstats" into Elasticsearch.

### redis-slowlog
Store the data of command "slowlog get 10" into Elasticsearch.

### mongodb
Store the data of command "serverStatus" into Elasticsearch.


## How to install
1. Clone repository to some dir
2. Go to this dir
3. Install packages
```
npm install
```
4. Copy config.dist.js to config.js
5. Set actual parameters in config.js
6. Run
```
node index.js
```

## How to use
Each module sends the data into Elasticsearch with follow options:

_index: from config file + currend day, for example:
```
index: 'redis_slowlog' -> redis_slowlog-2020.01.01
```
_type: module name from config file, for example:
```
'redis-slowlog': { ... } -> redis-slowlog
```
