# 1 -Create Security Polices
# 2 - Create secury roles an AWS
aws iam create-role \
    --role-name lambda-example \
    --assume-role-policy-document file://polices.json \
    | tee logs/role.log

# 3 - Create file with content and zip
zip function.zip index.js

aws lambda create-function \
    --function-name hello-cli \
    --zip-file fileb://function.zip \
    --handler index.handler \
    --runtime nodejs18.x \
    --role arn:aws:iam::148198459315:role/lambda-example \
    | tee logs/lambda-create.log

aws lambda invoke \
    --function-name hello-cli \
    --log-type Tail \
    logs/lambda-exec.log


# 4 - After update, zip file again
zip function.zip index.js

# 5 Update lambda
aws lambda update-function-code \
    --zip-file fileb://function.zip \
    --function-name hello-cli \
    --publish \
    | tee logs/lambda-update.log


# 6 invoke and see results
aws lambda invoke \
    --function-name hello-cli \
    --log-type Tail \
    logs/lambda-exec-update.log


# 7 remove lambda functions
aws lambda delete-function \
    --function-name hello-cli

aws iam delete-role \
    --role-name lambda-example