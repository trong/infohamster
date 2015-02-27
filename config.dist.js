var redis_servers = [
    {host: '127.0.0.1', port: 6379, db: 0, name: 'redis-6379'},
];

module.exports = {
    modules: {
        'init-elasticsearch-templates': {
            enabled: true
        },
        'redis-info': {
            index: 'redis_stat',
            servers: redis_servers,
            interval: 30000 //30 sec
        },
        'mongodb': {
            index: 'mongo_stat',
            servers: [
                {host: '127.0.0.1', port: 27017, db: 0, name: 'mongo-27017'}
            ],
            interval: 60000 //60 sec
        },
        'redis-slowlog': {
            index: 'redis_slowlog',
            servers: redis_servers,
            interval: 60000,
            enabled: true
        }
    },
    elasticsearch: {
        host: '127.0.0.1',
        port: 9200
    }
    ,
    log: 'output.log',
    version: "0.1.0"
}
;