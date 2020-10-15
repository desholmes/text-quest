.PHONY: clean-dangling-images setup az-login \
build-generic pull-generic build-and-push-generic run-generic \
build pull build-and-push run \
build-dev pull-dev build-and-push-dev run-dev

-include .env

export VERSION = $(shell node -p "require('./package.json').version")
export REPOSITORY = $(shell node -p "require('./package.json').name")

# Utils

clean-dangling-images:
	docker rmi -f $$(docker images -f 'dangling=true' -q)

setup:
	cp .env-dist .env

az-login:
	@az login
	@az acr login --name hentsu --subscription 98716bfd-a21c-4391-9ea3-9aac3667853a

# Generic

build-and-push-generic:
	@make build-generic filename=$(filename) repo=$(repo)
	@make push-generic repo=$(repo)

build-generic:
	@docker build \
		-f $(filename)Dockerfile \
		-t $(REGISTRY)/$(repo):$(VERSION) .

push-generic:
	docker push $(REGISTRY)/$(repo):$(VERSION)

pull-generic:
	docker pull $(REGISTRY)/$(repo):$(VERSION)

run-generic:
	docker run --rm -it \
		--env-file .env \
		-p $(port):$(port) \
		-e PORT=$(port) \
		-v $(PWD)/dist:/app/dist \
		-v $(PWD)/gulpfile.js:/app/gulpfile.js \
		-v $(PWD)/src:/app/src \
		--name $(REPOSITORY) \
	$(REGISTRY)/$(repo):$(VERSION)


# Wireframes

build:
	@make build-generic \
		filename="" \
		repo=$(REPOSITORY)

build-push:
	@make build-and-push-generic \
		filename="" \
		repo=$(REPOSITORY)
push:
	@make push-generic \
		filename="" \
		repo=$(REPOSITORY)

run:
	@docker run --rm -it \
		-p $(APP_PORT):$(APP_PORT) \
		-e PORT=$(APP_PORT) \
		--name $(REPOSITORY) \
	$(REGISTRY)/$(REPOSITORY):$(VERSION)

run-cold:
	@make build
	@make run

# Development

build-dev:
	@make build-generic \
		filename="dev." \
		repo="$(REPOSITORY)_dev"

run-dev:
	@docker run --rm -it \
		-p $(DEV_PORT):$(DEV_PORT) \
		-e PORT=$(DEV_PORT) \
		-v $(PWD)/dist:/app/dist \
		-v $(PWD)/gulpfile.js:/app/gulpfile.js \
		-v $(PWD)/src:/app/src \
		--name $(REPOSITORY) \
	$(REGISTRY)/$(REPOSITORY)_dev:$(VERSION)

run-dev-cold:
	@make -s build-generic \
		filename="dev." \
		repo="$(REPOSITORY)_dev"
	@make -s run-dev