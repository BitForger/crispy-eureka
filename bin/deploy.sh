#!/usr/bin/env bash
# Deploys the project using the following steps:
# - build a docker image
# - push docker tag(s)
# - update task definition(s)
# - update service(s)
#
# requires aws-cli, semver, node
#
# Version 0.1.7

NAMESPACE="smith-bot"
APP="$NAMESPACE"
REPO="508511800738.dkr.ecr.us-east-1.amazonaws.com/$NAMESPACE"
LOCAL_REPO="$NAMESPACE/$APP"
TASKS="$APP"

export AWS_DEFAULT_REGION="us-east-1"

#npm version patch

# exit on any error
set -e

# semver may be in node_modules
PATH="$PATH:node_modules/.bin"

# determine environment and cluster to deploy to, based on the current branch
cluster="Web-Apps"
env="stage"
# build docker
echo "Building docker image for $env"
docker build -t "$LOCAL_REPO" .

# determine primary tag
tag=`git describe --abbrev=0 --match 'v[0-9]*'`
build_number=`git rev-list "$tag".. --count`
if [ "$build_number" = "0" ]; then
  tag=`semver "$tag"`
else
  tag=`semver "$tag" -i prerelease`".$build_number"
fi

# get a list a branches and update tags for them as well
branches=`git branch --points-at HEAD -r | awk -F/ '{print $2}' | grep -E 'master|development|beta|production' | sort | uniq`
tags=`printf "$branches" | sed 's/master/latest/;s/development/latest/;s/production/stable/'`" $tag"


# login to docker repository
echo
echo "Logging in to AWS docker"
`aws ecr get-login --no-include-email --region us-east-1 | sed 's/-e none//'`

# push docker tags
for t in $tags; do
  echo
  echo "Pushing docker tag: $t"
  image="$REPO:$t"
  docker tag "$LOCAL_REPO:latest" "$image"
  docker push "$image"
done

image="$REPO:$tag"
for task in $TASKS; do
  task="Smith-Bot"
  echo
  echo "Updating task family: $task"

  # pull current task definition and replace the image(s)
  current_def=`aws ecs describe-task-definition --task-def "$task"`
  current_containers=`node -pe "JSON.stringify(JSON.parse(process.argv[1]).taskDefinition.containerDefinitions)" "$current_def"`
  new_containers=`echo "$current_containers" | sed "s~$REPO:[A-Za-z0-9._-]*~$image~g"`

  # create a new revision of the task family
  aws ecs register-task-definition --family $task --container-definitions "$new_containers" > /dev/null

  echo "Updating $task service of cluster: $cluster"
  aws ecs update-service --cluster $cluster --service $task --task-definition $task > /dev/null
done

echo 'Finished'