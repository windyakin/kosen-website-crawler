COMPOSE_FILES := docker-compose.yml
COMPOSE_FILES_ON_COMMAND_LINE := $(addprefix -f ,$(COMPOSE_FILES))

all: run copy down

ps:
	docker-compose $(COMPOSE_FILES_ON_COMMAND_LINE) ps

build:
	docker-compose $(COMPOSE_FILES_ON_COMMAND_LINE) build

pull:
	docker-compose $(COMPOSE_FILES_ON_COMMAND_LINE) pull

run:
	docker-compose $(COMPOSE_FILES_ON_COMMAND_LINE) up

copy:
	docker cp $(shell docker-compose $(COMPOSE_FILES_ON_COMMAND_LINE) ps -q crawler):/usr/src/app/screenshots .

down:
	docker-compose $(COMPOSE_FILES_ON_COMMAND_LINE) down

.PHONY: all ps build pull run copy down
