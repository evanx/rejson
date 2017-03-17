
set -u -e

PATH=$PATH:./node_modules/.bin

name='rejson'
network="$name-network"
redisName="$name-redis"

tearDown() {
   docker-rm-redis $name
}

setUp() {
   redisHost=`docker-run-redis $name`
}

build() {
   docker build -t rejson https://github.com/evanx/rejson.git
}

start() {
   docker run --name rejson-instance -d \
      --network=rejson-network \
      -e redisHost=$redisHost \
      -v /tmp/test/volumes/refile/data:/data \
      rejson
}

test() {
   curl -s http://localhost:8871/re/analytics | grep '"counts":'
}

stop() {
   docker rm -f rejson-instance
}

main() {
   tearDown
   setUp
   sleep 1
   build
   start
   test
   stop
   tearDown
   echo 'OK'
}

main
