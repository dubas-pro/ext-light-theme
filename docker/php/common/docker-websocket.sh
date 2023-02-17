#!/bin/bash

set -eu

/usr/local/bin/php /shared/httpd/site/websocket.php

exec "$@"