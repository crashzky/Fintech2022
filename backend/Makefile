python_exec = python3.9
poetry_exec = $(python_exec) -m poetry


# Install project in dev mode
install-dev:
	$(poetry_exec) install && \
	$(poetry_exec) run pre-commit install


# Install project in production mode
install-prod:
	$(python_exec) -m pip install --upgrade poetry==1.2.0a2 setuptools==59.8.0 pip
	$(python_exec) -m poetry run python -m pip install --upgrade poetry==1.2.0a2 setuptools==59.8.0 pip
	$(poetry_exec) install --no-dev

# Run the server
run:
	$(poetry_exec) run python -m src

# Run the server with hot reload mode
run-debug:
	GROCERY_SERVER_DEBUG=1 make run

# Build docker image
build-prod:
	docker build -t grocery-server .

# Run server in production mode (with docker)
run-prod: build-prod
	docker run -p 4000:4000 grocery-server

# Reformat code style
format:
	$(poetry_exec) run black src && \
	$(poetry_exec) run isort src && \
	$(poetry_exec) run autoflake \
		--ignore-init-module-imports \
		--remove-unused-variables \
		--recursive \
		--in-place src


# Build an archive for stepik
archive:
	rm -rf build && \
	mkdir build && \
	zip -r "build/archive.zip" . \
		-x "*.git*" \
		-x "*.venv*" \
		-x "*.idea*" \
		-x "*.vscode*" \
		-x "*.DS_Store*" \
		-x "*.zip*" \
		-x "*build*" \
		-x "*__pycache__*"
