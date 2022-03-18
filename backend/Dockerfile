FROM deknowny/mall-dependencies

# Copy source code
COPY backend/src /app/src

# Copy another needed files
COPY backend/Makefile backend/poetry.toml backend/pyproject.toml backend/requirements.txt blockchain/contracts/RentalAgreement.sol /app/

# Checkout to the workdir
WORKDIR /app

# Reserve the port
EXPOSE 8000

# Run the server
ENTRYPOINT ["python", "-m", "src"]
