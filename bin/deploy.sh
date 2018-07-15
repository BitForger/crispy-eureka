#!/usr/bin/env bash
TASKS="smith-bot"
NAMESPACE="smith-bot"
REPO="508511800738.dkr.ecr.us-east-1.amazonaws.com/$NAMESPACE"
PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')

PACKAGE_VERSION="$(echo -e "$PACKAGE_VERSION" | tr -d '[:space:]')"

export AWS_DEFAULT_REGION="us-east-1"

docker build -t "smith-bot:latest" .

# determine primary tag
tag=`git describe --abbrev=0 --match 'v[0-9]*'`

build_number=`git rev-list "$tag".. --count`

if [ "$build_number" = "0" ]; then
  tag=`semver "$tag"`
else
  tag=`semver "$tag" -i prerelease`".$build_number"
fi

tags=`semver $PACKAGE_VERSION -i prerelease`" latest"

echo "Logging in to AWS docker"
`aws ecr get-login --no-include-email --region us-east-1 | sed 's/-e none//'`

echo ""
echo "Pushing docker tag: $tag"
image="508511800738.dkr.ecr.us-east-1.amazonaws.com/smith-bot-bot:$tag"
latest_image="508511800738.dkr.ecr.us-east-1.amazonaws.com/smith-bot:latest"
docker tag "smith-bot:latest" "$image"
docker push "$image"
docker tag "smith-bot:latest" "$latest_image"
docker push "$latest_image"


image="$REPO:$tag"
cluster="Web-Apps"
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

