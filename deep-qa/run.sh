docker build -t deepqa:latest .
DEEPQA_WORKDIR=./my-test docker-compose -f deploy.yml up