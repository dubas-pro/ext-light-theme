#!/usr/bin/env bash

set -e

declare -A data=(
    [path]="site"
    [build]="full"
    [version]="stable"
)

function handleArguments() {
    for ARGUMENT in "$@"; do
        local key
        local value

        key=$(echo "$ARGUMENT" | cut -f1 -d=)
        value=$(echo "$ARGUMENT" | cut -f2 -d=)

        case "$key" in
        --path)
            data[path]="${value}"
            ;;

        -b | --build)
            data[build]="${value}"
            ;;

        -v | --version)
            data[version]="${value}"
            ;;

        # Removes EspoCRM files and database.
        --clean)
            needClean=true
            ;;

        --skipTestDataImport)
            skipTestDataImport=true
            ;;
        esac
    done
}

handleArguments "$@"

if ! docker-compose ps --services --filter "status=running" | grep -q php; then
    printf "Docker must be running.\n\n"
    printf "docker-compose up -d\n"
    exit 1
fi

# Setup config.php.
if [[ ! -e "config.php" ]]; then
    cp config.php.dist config.php
fi

if [ -n "$needClean" ] && [ $needClean = true ]; then
    ./bash.sh -c "vendor/bin/espo db:drop --force"
fi

./bash.sh -c "\
    vendor/bin/espo core:download --no-cache --no-interaction --type=full --branch=${data[version]}; \
    pnpm exec grunt; \
    vendor/bin/espo core:install; \
    vendor/bin/ecs check --fix --clear-cache; \
    vendor/bin/espo ext:copy; \
    vendor/bin/espo admin:rebuild; \
"

if [ -z "$skipTestDataImport" ]; then
    ./bash.sh -c "vendor/bin/espo import:test-data;"
fi

if test -f "${data[path]}/Gruntfile.js"; then
    sed -i 's/npm ci/pnpm install --frozen-lockfile/' "${data[path]}/Gruntfile.js"
fi
