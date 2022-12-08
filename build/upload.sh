#!/bin/bash

rsync -vrh --delete --exclude={'vue-web/*','.git/*'}  /Users/xinyun/study/gcy-blog/webView root@162.14.118.95:/usr/share/nginx/html