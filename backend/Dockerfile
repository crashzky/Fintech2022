# Dockerfile example
FROM nikitat0/graphql_python_dapp

WORKDIR /app
# RUN apk add gcc g++ make libffi-dev openssl-dev

# COPY requirements.txt ./
# RUN pip install -r requirements.txt

# RUN apk add gcc g++ make libffi-dev openssl-dev

COPY requirements.txt ./
# RUN pip install -r requirements.txt

COPY . .

CMD ["strawberry", "server", "app", "-p", "4000"]