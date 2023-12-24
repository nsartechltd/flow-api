ASSUME_ROLE_ARN="arn:aws:iam::308697347926:role/OrganizationAccountAccessRole"
TEMP_ROLE=`AWS_PROFILE=nsartech-dev aws sts assume-role --role-arn $ASSUME_ROLE_ARN --role-session-name ci`
export AWS_ACCESS_KEY_ID=$(echo "$TEMP_ROLE" | jq -r '.Credentials.AccessKeyId')
export AWS_SECRET_ACCESS_KEY=$(echo "$TEMP_ROLE" | jq -r '.Credentials.SecretAccessKey')
export AWS_SESSION_TOKEN=$(echo "$TEMP_ROLE" | jq -r '.Credentials.SessionToken')
export AWS_REGION=eu-west-2
serverless deploy --verbose --stage dev --force