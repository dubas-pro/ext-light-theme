.DEFAULT_GOAL := help

IS_DOCKER := $(shell [ -f /.dockerenv ] && echo true)

.PHONY: requirements
requirements: ## Install requirements
	npm ci --no-audit --no-fund

.PHONY: full
full: requirements ## Build full environment (will destroy existing data)
ifdef IS_DOCKER
	@echo "Error: This Makefile should not be run inside a Docker container."
	@exit 1
endif
	docker compose build --no-cache --pull
	docker compose up --detach --remove-orphans --force-recreate --build && sleep 3
	docker exec --interactive --tty --user devilbox php sh -c ' \
		node build --all; \
		(cd src/files/client/custom/modules/dubas-light-theme; npm ci); \
	'

.PHONY: package
package: requirements ## Build extension package
	( \
		cd src/files/client/custom/modules/dubas-light-theme; \
		npm ci; \
		mkdir --parents /tmp/dubas-light-theme; \
		mv Gruntfile.js package-lock.json package.json frontend node_modules /tmp/dubas-light-theme; \
	)
	node build --extension
	mv /tmp/dubas-light-theme/* src/files/client/custom/modules/dubas-light-theme

.PHONY: copy
copy: ## Copy extension
	( \
		cd src/files/client/custom/modules/dubas-light-theme; \
		grunt; \
		mkdir --parents /tmp/dubas-light-theme; \
		mv Gruntfile.js package-lock.json package.json frontend node_modules /tmp/dubas-light-theme; \
	)
	node build --copy
	mv /tmp/dubas-light-theme/* src/files/client/custom/modules/dubas-light-theme

.PHONY: cc
cc: copy ## Copy extension and clear cache
	docker exec --interactive --tty --user devilbox php sh -c ' \
		cd site; php clear_cache.php \
	'

.PHONY: cr
cr: copy ## Copy extension and rebuild
	docker exec --interactive --tty --user devilbox php sh -c ' \
		cd site; php rebuild.php; \
	'

.PHONY: clean
clean: ## Clean up
	docker compose down --volumes --remove-orphans
	rm --recursive --force ./site
	git clean -fdX

.PHONY: help
help: ## Display this help screen
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' Makefile | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
