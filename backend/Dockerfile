FROM python:3.9-alpine

# Copy source code
COPY src /app/src

# Copy another needed files
COPY Makefile poetry.toml pyproject.toml requirements.txt ../blockchain/contracts/RentalAgreement.sol /app/

# Checkout to the workdir
WORKDIR /app

# Reserve the port
EXPOSE 8000

RUN /usr/local/bin/python3.9 -m pip install --upgrade setuptools==59.8.0

# Install dependencies for alpine
RUN apk add make gcc musl-dev g++ zlib-dev libffi-dev py3-setuptools

# Install project dependencies
RUN python -m pip install -r requirements.txt

# Run the server
ENTRYPOINT ["python", "-m", "src"]
